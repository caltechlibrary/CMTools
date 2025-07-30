import * as yaml from "@std/yaml";
import { CodeMeta, getExampleText, complexFieldList, CodeMetaTerms, type AttributeType } from "./codemeta.ts";
import { PersonOrOrganization } from "./person_or_organization.ts";
import { editTempData} from "./editor.ts";


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
): Promise<boolean> {
  const attr = getAttributeByName(name);
  // Prompt and get value back as string
  // Inspect the attribute and determine what to of value
  // Use CodeMeta patchObject similar to fromObject but for simple
  // attribute update.
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
      //FIXME: if eVal is for a complex type and it is empty 
      // then I need to insert example text to use when editing the temp data.
      if (eVal === "" && (complexFieldList.indexOf(name) > -1)) {
        eVal = getExampleText(name);
      }
      val = await editTempData(eVal);
    }
  } else {
    let pVal: string | null = "";
    if (complexFieldList.indexOf(name) > -1) {
      console.log(
        `Enter YAML for ${name}. Enter period '.' on an empty line when done.`,
      );
      const lines: string[] = [];
      let txt: string | null = "";
      while (txt !== null && txt.trim() !== ".") {
        txt = prompt("");
        if (txt !== null && txt.trim() !== ".") {
          lines.push(txt);
        }
      }
      //FIXME: Need to distinguish from "no change" and "remove value(s)"
      txt = lines.join("\n").trim();
      if (txt === "") {
        pVal = null;
      } else {
        pVal = txt;
      }
    } else {
      pVal = prompt(
        `Enter ${name} (press enter, to accept current value): `,
        "",
      );
    }
    if (pVal === null) {
      val = undefined;
    } else {
      val = pVal;
    }
  }
  if (val === undefined || val === "") {
    return false;
  }
  if (setObjectFromString(obj, name, val.trim(), attr.type) === false) {
    return false;
  }
  return cm.patchObject(obj);
}

export function getStringFromObject(
  obj: { [key: string]: unknown },
  key: string,
): string | undefined {
  if (obj[key] === undefined) {
    return undefined;
  }
  const val: string | number | unknown[] = obj[key] as string | number | unknown[];
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
  let objData: { [key: string]: unknown } = {};

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
      obj[key] = dt;
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
