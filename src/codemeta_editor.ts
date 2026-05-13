import * as yaml from "@std/yaml";
import {
  type AttributeType,
  CodeMeta,
  CodeMetaTerms,
  complexFieldList,
  getExampleText,
} from "./codemeta.ts";
import { PersonOrOrganization } from "./person_or_organization.ts";
import { editTempData } from "./editor.ts";
import {
  formatProfile,
  getLicense,
  getLicenseNames,
  getLicenseText,
  getPersonList,
  getPersonListNames,
  getProfile,
  getProfileNames,
  loadConfig,
  profileToPersonOrOrg,
  type Profile,
} from "./config.ts";
import { getRemoteOriginURL } from "./gitcmds.ts";

function getAttributeByName(name: string): AttributeType | undefined {
  for (const attr of CodeMetaTerms) {
    if (attr.name === name) {
      return attr;
    }
  }
  return undefined;
}

export async function editCodeMetaTerm(
  cm: CodeMeta,
  name: string,
  useEditor: boolean,
  configPath?: string,
): Promise<boolean> {
  const attr = getAttributeByName(name);
  if (attr === undefined) {
    return false;
  }
  const obj: { [key: string]: unknown } = {};
  let curVal: string | undefined = "";
  curVal = getStringFromObject(cm.toObject(), name);
  let val: string | undefined = undefined;
  console.log(`Default: ${name}: ${curVal}`);

  if (useEditor) {
    if (confirm(`Edit ${name}?`)) {
      let eVal = (curVal === undefined) ? "" : curVal;
      if (eVal === "" && (complexFieldList.indexOf(name) > -1)) {
        eVal = getExampleText(name);
      }
      val = await editTempData(eVal);
    }
  } else {
    // --- Config-assisted paths ---

    // License field: offer to apply from config
    if (name === "license") {
      const config = await loadConfig(configPath);
      if (config && getLicenseNames(config).length > 0) {
        const names = getLicenseNames(config);
        console.log("\nAvailable licenses:");
        for (let i = 0; i < names.length; i++) {
          const lic = getLicense(config, names[i])!;
          console.log(`  ${i + 1}. ${names[i]} (${lic.name})`);
        }
        console.log(`  ${names.length + 1}. Enter manually`);
        console.log(`  q. Skip / keep existing`);
        const choice = prompt(`Select (1-${names.length + 1}, or q): `);
        if (choice === "q" || choice === null) return false;
        const idx = parseInt(choice) - 1;
        if (idx >= 0 && idx < names.length) {
          const lic = getLicense(config, names[idx])!;
          const text = await getLicenseText(lic);
          if (text === null) {
            console.log(`Warning: could not read text for license "${names[idx]}"`);
          } else {
            await Deno.writeTextFile("LICENSE", text);
            console.log("Wrote ./LICENSE");
          }
          if (lic.url) {
            obj[name] = lic.url;
            return cm.patchObject(obj);
          }
          // No url configured — fall through to manual prompt for the URL value
          console.log(`No URL configured for "${names[idx]}". Enter license URL manually.`);
        }
        // idx === names.length → "Enter manually"; fall through
      }
    }

    // Person/org fields: offer profiles and pre-defined lists
    if (
      attr.type === "person_or_organization" ||
      attr.type === "person_or_organization_list"
    ) {
      const config = await loadConfig(configPath);
      if (config) {
        const profileNames = getProfileNames(config);
        const listNames = attr.type === "person_or_organization_list"
          ? getPersonListNames(config)
          : [];
        if (profileNames.length > 0 || listNames.length > 0) {
          let idx = 1;
          if (profileNames.length > 0) {
            console.log("\nAvailable profiles:");
            for (const n of profileNames) {
              console.log(`  ${idx++}. ${n} (${formatProfile(getProfile(config, n)!)})`);
            }
          }
          if (listNames.length > 0) {
            console.log("Pre-defined lists:");
            for (const n of listNames) {
              const count = getPersonList(config, n)!.length;
              console.log(`  ${idx++}. ${n} (${count} ${count === 1 ? "person" : "people"})`);
            }
          }
          const manualIdx = idx;
          console.log(`  ${manualIdx}. Enter manually`);
          console.log(`  q. Skip / keep existing`);
          const choice = prompt(`Select (1-${manualIdx}, or q): `);
          if (choice === "q" || choice === null) return false;
          const chosen = parseInt(choice) - 1;
          if (chosen >= 0 && chosen < manualIdx - 1) {
            // Determine if it's a profile or a list
            if (chosen < profileNames.length) {
              const profile = getProfile(config, profileNames[chosen])!;
              const personOrOrg = profileToPersonOrOrg(profile);
              if (attr.type === "person_or_organization_list") {
                const list: PersonOrOrganization[] = [personOrOrg];
                while (confirm("Add another entry?")) {
                  list.push(...(await pickPersonEntry(config, profileNames)));
                }
                obj[name] = list;
              } else {
                obj[name] = personOrOrg;
              }
              return cm.patchObject(obj);
            } else {
              // It's a list selection (only reachable for person_or_organization_list)
              const listName = listNames[chosen - profileNames.length];
              const profiles = getPersonList(config, listName)!;
              obj[name] = profiles.map((p: Profile) => profileToPersonOrOrg(p));
              return cm.patchObject(obj);
            }
          }
          // chosen === manualIdx - 1 → "Enter manually"; fall through
        }
      }
    }

    // --- Suggested defaults for empty URL fields ---
    let suggestedDefault = "";
    if (name === "codeRepository" && (curVal === undefined || curVal === "")) {
      const gitUrl = await getRemoteOriginURL();
      if (gitUrl) {
        suggestedDefault = gitUrl;
        console.log(`  (suggested from git remote: ${gitUrl})`);
      }
    }
    if (name === "issueTracker" && (curVal === undefined || curVal === "")) {
      const repoUrl = cm.codeRepository
        .replace(/^git\+/, "").replace(/\.git$/, "").trim();
      if (repoUrl) {
        suggestedDefault = `${repoUrl}/issues`;
        console.log(`  (derived from codeRepository: ${suggestedDefault})`);
      }
    }

    // --- Original prompt path ---
    let pVal: string | null = "";
    if (complexFieldList.indexOf(name) > -1) {
      console.log(
        `Enter YAML for ${name}. Enter '.' on an empty line to skip/keep existing.`,
      );
      const lines: string[] = [];
      let txt: string | null = "";
      while (txt !== null && txt.trim() !== ".") {
        txt = prompt("");
        if (txt !== null && txt.trim() !== ".") {
          lines.push(txt);
        }
      }
      txt = lines.join("\n").trim();
      if (txt === "") {
        pVal = null;
      } else {
        pVal = txt;
      }
    } else {
      const hint = suggestedDefault
        ? `Enter ${name} (Enter to accept suggestion, '.' to skip): `
        : `Enter ${name} (Enter or '.' to keep current): `;
      pVal = prompt(hint, suggestedDefault);
    }
    if (pVal === null) {
      val = undefined;
    } else {
      val = pVal;
    }
  }

  if (val === undefined || val === "" || val === ".") {
    return false;
  }
  if (setObjectFromString(obj, name, val.trim(), attr.type) === false) {
    return false;
  }
  return cm.patchObject(obj);
}

// Prompt user to pick a single person/org entry from profiles (used in add-another loop).
async function pickPersonEntry(
  config: Parameters<typeof getProfileNames>[0],
  profileNames: string[],
): Promise<PersonOrOrganization[]> {
  console.log("\nAvailable profiles:");
  for (let i = 0; i < profileNames.length; i++) {
    console.log(`  ${i + 1}. ${profileNames[i]} (${formatProfile(getProfile(config, profileNames[i])!)})`);
  }
  console.log(`  ${profileNames.length + 1}. Enter manually`);
  const choice = prompt(`Select (1-${profileNames.length + 1}): `);
  if (choice === null || choice === `${profileNames.length + 1}`) return [];
  const idx = parseInt(choice) - 1;
  if (idx >= 0 && idx < profileNames.length) {
    return [profileToPersonOrOrg(getProfile(config, profileNames[idx])!)];
  }
  return [];
}

export function getStringFromObject(
  obj: { [key: string]: unknown },
  key: string,
): string | undefined {
  if (obj[key] === undefined) {
    return undefined;
  }
  const val: string | number | unknown[] = obj[key] as
    | string
    | number
    | unknown[];
  if (val === undefined) {
    return undefined;
  }
  let src: string | undefined = undefined;
  if (complexFieldList.indexOf(key) > -1) {
    try {
      const yamlOpt: yaml.StringifyOptions = {};
      yamlOpt.skipInvalid = true;
      src = yaml.stringify(val, yamlOpt);
    } catch (err) {
      console.log(`YAML ERROR: ${err} -> ${val}, editing as JSON`);
      try {
        src = JSON.stringify(val, null, 2);
      } catch (err) {
        console.log(`JSON ERROR: ${err} -> ${val}`);
        return undefined;
      }
    }
  } else if (obj[key] !== undefined) {
    src = obj[key] as unknown as string;
  }
  return src;
}

export function setObjectFromString(
  obj: { [key: string]: unknown },
  key: string,
  val: string,
  data_type: string,
): boolean {
  let n: number = 0;
  let dt: Date;
  let u: URL | null;
  let textData: string[] = [];
  let personData: PersonOrOrganization = {} as PersonOrOrganization;
  let personDataList: PersonOrOrganization[] = [];

  switch (data_type) {
    case "text":
      obj[key] = val;
      break;
    case "url":
      u = URL.parse(val);
      if (u === null) return false;
      obj[key] = u;
      break;
    case "number":
      n = (new Number(val)).valueOf();
      if (isNaN(n)) return false;
      obj[key] = n;
      break;
    case "date":
      dt = new Date(val);
      if (isNaN(dt.valueOf())) return false;
      obj[key] = dt.toISOString().split("T")[0];
      break;
    case "text_or_url":
      u = URL.parse(val);
      if (u === null) {
        obj[key] = val;
      } else {
        obj[key] = u;
      }
      break;
    case "number_or_text":
      n = (new Number(val)).valueOf();
      if (isNaN(n)) {
        obj[key] = val;
      } else {
        obj[key] = n;
      }
      break;
    case "property_value_or_url":
      obj[key] = val;
      break;
    case "text_list":
      try {
        textData = yaml.parse(val) as unknown as string[];
      } catch (_err) {
        return false;
      }
      obj[key] = textData;
      break;
    case "url_list":
      try {
        textData = yaml.parse(val) as unknown as string[];
      } catch (err) {
        console.log(`YAML ERROR: ${err} -> ${val}`);
        return false;
      }
      // now collect our URLs
      {
        const list_of_url: URL[] = [];
        for (const item of textData) {
          const u: URL | null = URL.parse(item);
          if (u !== null) {
            list_of_url.push(u);
          }
        }
        obj[key] = list_of_url;
      }
      break;
    case "person_or_organization":
      try {
        personData = yaml.parse(val + "\n") as unknown as PersonOrOrganization;
      } catch (err) {
        console.log(`YAML ERROR: ${err} -> ${val}`);
        try {
          personData = JSON.parse(val) as unknown as PersonOrOrganization;
        } catch (err) {
          console.log(`JSON ERROR: ${err} -> ${val}`);
          return false;
        }
      }
      obj[key] = personData;
      break;
    case "person_or_organization_list":
      try {
        personDataList = yaml.parse(
          val + "\n",
        ) as unknown as PersonOrOrganization[];
      } catch (err) {
        console.log(`YAML ERROR: ${err} -> ${val}`);
        try {
          personDataList = JSON.parse(val) as unknown as PersonOrOrganization[];
        } catch (err) {
          console.log(`JSON ERROR: ${err} -> ${val}`);
          return false;
        }
      }
      obj[key] = personDataList;
      break;
    default:
      // Unsupported conversion
      break;
  }
  return true;
}
