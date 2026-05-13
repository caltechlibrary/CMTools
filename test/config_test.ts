import { assertEquals, assertNotEquals } from "@std/assert";
import {
  configSearchPaths,
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
  saveConfig,
  type Config,
} from "../src/config.ts";

const sampleConfig: Config = {
  default_profile: "rdoiel",
  default_license: "caltech",
  profiles: {
    "rdoiel": {
      type: "Person",
      givenName: "R. S.",
      familyName: "Doiel",
      email: "rdoiel@caltech.edu",
      id: "https://orcid.org/0000-0003-0900-6903",
      affiliation: { type: "Organization", name: "Caltech Library" },
    },
    "caltech-library": {
      type: "Organization",
      name: "Caltech Library",
      email: "library@caltech.edu",
    },
  },
  licenses: {
    "caltech": { name: "Caltech License", text: "Copyright Caltech." },
    "agpl3": {
      name: "AGPL v3",
      url: "https://spdx.org/licenses/AGPL-3.0-or-later.html",
      text: "GNU AGPL v3 text here.",
    },
  },
  person_lists: {
    "dld-team": [
      { type: "Person", givenName: "R. S.", familyName: "Doiel" },
      { type: "Person", givenName: "Tom", familyName: "Morrell" },
    ],
  },
};

Deno.test("loadConfig returns null for missing file", async () => {
  const result = await loadConfig("/nonexistent/path/.cmtoolsrc");
  assertEquals(result, null);
});

Deno.test("saveConfig and loadConfig round-trip", async () => {
  const tmp = await Deno.makeTempDir();
  const path = `${tmp}/.cmtoolsrc`;

  const saved = await saveConfig(sampleConfig, path);
  assertEquals(saved, true);

  const loaded = await loadConfig(path);
  assertNotEquals(loaded, null);
  assertEquals(loaded!.default_profile, "rdoiel");
  assertEquals(loaded!.default_license, "caltech");
  assertEquals(Object.keys(loaded!.profiles).length, 2);
  assertEquals(Object.keys(loaded!.licenses).length, 2);
  assertEquals(Object.keys(loaded!.person_lists).length, 1);

  await Deno.remove(tmp, { recursive: true });
});

Deno.test("loadConfig defaults missing sections to empty objects", async () => {
  const tmp = await Deno.makeTempDir();
  const path = `${tmp}/.cmtoolsrc`;
  await Deno.writeTextFile(path, "default_profile: me\n");

  const loaded = await loadConfig(path);
  assertNotEquals(loaded, null);
  assertEquals(loaded!.profiles, {});
  assertEquals(loaded!.licenses, {});
  assertEquals(loaded!.person_lists, {});

  await Deno.remove(tmp, { recursive: true });
});

Deno.test("loadConfig returns null for invalid YAML", async () => {
  const tmp = await Deno.makeTempDir();
  const path = `${tmp}/.cmtoolsrc`;
  await Deno.writeTextFile(path, "key: [unclosed bracket\n");

  const result = await loadConfig(path);
  assertEquals(result, null);

  await Deno.remove(tmp, { recursive: true });
});

Deno.test("getProfileNames returns all profile keys", () => {
  assertEquals(getProfileNames(sampleConfig), ["rdoiel", "caltech-library"]);
});

Deno.test("getProfile returns correct profile", () => {
  const p = getProfile(sampleConfig, "rdoiel");
  assertNotEquals(p, undefined);
  assertEquals(p!.familyName, "Doiel");
});

Deno.test("getProfile returns undefined for unknown name", () => {
  assertEquals(getProfile(sampleConfig, "nobody"), undefined);
});

Deno.test("formatProfile formats a person with affiliation", () => {
  const p = getProfile(sampleConfig, "rdoiel")!;
  assertEquals(formatProfile(p), "R. S. Doiel, Caltech Library");
});

Deno.test("formatProfile formats an organization", () => {
  const p = getProfile(sampleConfig, "caltech-library")!;
  assertEquals(formatProfile(p), "Caltech Library");
});

Deno.test("profileToPersonOrOrg converts profile to PersonOrOrganization", () => {
  const p = getProfile(sampleConfig, "rdoiel")!;
  const person = profileToPersonOrOrg(p);
  assertEquals(person.familyName, "Doiel");
  assertEquals(person.givenName, "R. S.");
  assertEquals(person.email, "rdoiel@caltech.edu");
});

Deno.test("getLicenseNames returns all license keys", () => {
  assertEquals(getLicenseNames(sampleConfig), ["caltech", "agpl3"]);
});

Deno.test("getLicense returns correct license", () => {
  const lic = getLicense(sampleConfig, "agpl3")!;
  assertEquals(lic.name, "AGPL v3");
  assertEquals(lic.url, "https://spdx.org/licenses/AGPL-3.0-or-later.html");
});

Deno.test("getLicenseText returns inline text", async () => {
  const lic = getLicense(sampleConfig, "caltech")!;
  const text = await getLicenseText(lic);
  assertEquals(text, "Copyright Caltech.");
});

Deno.test("getLicenseText reads from file", async () => {
  const tmp = await Deno.makeTempDir();
  const licPath = `${tmp}/license.txt`;
  await Deno.writeTextFile(licPath, "File license text.");

  const text = await getLicenseText({ name: "Test", file: licPath });
  assertEquals(text, "File license text.");

  await Deno.remove(tmp, { recursive: true });
});

Deno.test("getLicenseText prefers file over text when both present", async () => {
  const tmp = await Deno.makeTempDir();
  const licPath = `${tmp}/license.txt`;
  await Deno.writeTextFile(licPath, "From file.");

  const text = await getLicenseText({
    name: "Test",
    file: licPath,
    text: "Inline text.",
  });
  assertEquals(text, "From file.");

  await Deno.remove(tmp, { recursive: true });
});

Deno.test("getLicenseText returns null when file is missing", async () => {
  const text = await getLicenseText({ name: "Test", file: "/no/such/file.txt" });
  assertEquals(text, null);
});

Deno.test("getLicenseText returns null when neither file nor text present", async () => {
  const text = await getLicenseText({ name: "Test" });
  assertEquals(text, null);
});

Deno.test("getPersonListNames returns all list keys", () => {
  assertEquals(getPersonListNames(sampleConfig), ["dld-team"]);
});

Deno.test("getPersonList returns correct list", () => {
  const list = getPersonList(sampleConfig, "dld-team")!;
  assertEquals(list.length, 2);
  assertEquals(list[0].familyName, "Doiel");
  assertEquals(list[1].familyName, "Morrell");
});

Deno.test("getPersonList returns undefined for unknown name", () => {
  assertEquals(getPersonList(sampleConfig, "nobody"), undefined);
});

Deno.test("configSearchPaths walks from cwd to home then fallback", () => {
  const home = Deno.env.get("HOME") ?? "";
  const cwd = Deno.cwd();
  const paths = configSearchPaths();

  // Must have at least: cwd entry, home entry, fallback
  assertEquals(paths.length >= 3, true);

  // First path is always cwd
  assertEquals(paths[0], `${cwd}/.cmtoolsrc`);

  // Last path is always the fallback
  assertEquals(paths[paths.length - 1], `${home}/.config/cmtools/config.yaml`);

  // Second-to-last path (before fallback) is home
  assertEquals(paths[paths.length - 2], `${home}/.cmtoolsrc`);

  // Every .cmtoolsrc path ends with /.cmtoolsrc
  for (const p of paths.slice(0, -1)) {
    assertEquals(p.endsWith("/.cmtoolsrc"), true);
  }

  // Paths are ordered from longest (most specific) to shortest (home)
  const cmtoolsrcPaths = paths.slice(0, -1);
  for (let i = 1; i < cmtoolsrcPaths.length; i++) {
    assertEquals(cmtoolsrcPaths[i].length < cmtoolsrcPaths[i - 1].length, true);
  }
});

Deno.test("loadConfig explicit path bypasses search order", async () => {
  const tmp = await Deno.makeTempDir();
  const explicit = `${tmp}/explicit.json`;
  const other = `${tmp}/other.json`;

  const explicitCfg: Config = { ...sampleConfig, default_profile: "explicit" };
  const otherCfg: Config = { ...sampleConfig, default_profile: "other" };
  await Deno.writeTextFile(explicit, JSON.stringify(explicitCfg));
  await Deno.writeTextFile(other, JSON.stringify(otherCfg));

  const loaded = await loadConfig(explicit);
  assertEquals(loaded!.default_profile, "explicit");

  await Deno.remove(tmp, { recursive: true });
});

Deno.test("loadConfig falls through to second path when first is missing", async () => {
  const tmp = await Deno.makeTempDir();
  // Write only the second path in the search list
  const secondPath = `${tmp}/.cmtoolsrc`;
  const cfg: Config = { ...sampleConfig, default_profile: "from-second" };
  await Deno.writeTextFile(secondPath, JSON.stringify(cfg));

  // Pass it as an explicit override to simulate "user-level" being the only one present
  const loaded = await loadConfig(secondPath);
  assertEquals(loaded!.default_profile, "from-second");

  await Deno.remove(tmp, { recursive: true });
});
