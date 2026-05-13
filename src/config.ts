import * as yaml from "@std/yaml";
import { PersonOrOrganization } from "./person_or_organization.ts";

export interface Profile {
  type?: string;
  givenName?: string;
  familyName?: string;
  name?: string;
  id?: string;
  email?: string;
  affiliation?: { type?: string; name?: string };
}

export interface License {
  name: string;
  url?: string;   // written to codemeta.json license field when present
  file?: string;  // path to license text file; ~ expanded; takes precedence over text
  text?: string;  // inline license text
}

export interface Config {
  default_profile?: string;
  default_license?: string;
  profiles: { [key: string]: Profile };
  licenses: { [key: string]: License };
  person_lists: { [key: string]: Profile[] };
}

// Builds the ordered list of .cmtoolsrc paths to try.
// Walks from cwd up to (and including) the home directory, then appends the
// fallback path. First match wins. If cwd is outside home the walk stops at
// cwd and jumps to home rather than continuing past it.
export function configSearchPaths(): string[] {
  const home = Deno.env.get("HOME") ?? "";
  const cwd = Deno.cwd();
  const paths: string[] = [];

  if (home && cwd.startsWith(home)) {
    let dir = cwd;
    while (true) {
      paths.push(`${dir}/.cmtoolsrc`);
      if (dir === home) break;
      const parent = dir.substring(0, dir.lastIndexOf("/"));
      if (!parent || parent === dir) break;
      dir = parent;
    }
  } else {
    // cwd is outside home — check cwd then jump straight to home
    paths.push(`${cwd}/.cmtoolsrc`);
    if (home) paths.push(`${home}/.cmtoolsrc`);
  }

  if (home) paths.push(`${home}/.config/cmtools/config.yaml`);
  return paths;
}

// Returns the primary user-level path, used by saveConfig.
export function getConfigPath(override?: string): string {
  if (override) return override;
  const home = Deno.env.get("HOME") ?? "";
  return `${home}/.cmtoolsrc`;
}

async function tryLoadPath(path: string): Promise<Config | null> {
  let src: string;
  try {
    src = await Deno.readTextFile(path);
  } catch (_err) {
    return null;
  }
  try {
    const raw = yaml.parse(src) as Partial<Config>;
    return {
      default_profile: raw.default_profile,
      default_license: raw.default_license,
      profiles: raw.profiles ?? {},
      licenses: raw.licenses ?? {},
      person_lists: raw.person_lists ?? {},
    };
  } catch (_err) {
    return null;
  }
}

export async function loadConfig(configPath?: string): Promise<Config | null> {
  // Explicit override bypasses the search entirely.
  if (configPath) return tryLoadPath(configPath);
  // Otherwise try each path in priority order, return first match.
  for (const path of configSearchPaths()) {
    const config = await tryLoadPath(path);
    if (config !== null) return config;
  }
  return null;
}

export async function saveConfig(
  config: Config,
  configPath?: string,
): Promise<boolean> {
  const path = getConfigPath(configPath);
  try {
    const dir = path.substring(0, path.lastIndexOf("/"));
    if (dir) await Deno.mkdir(dir, { recursive: true });
    await Deno.writeTextFile(path, yaml.stringify(config as unknown as Record<string, unknown>));
    return true;
  } catch (_err) {
    return false;
  }
}

export function getProfileNames(config: Config): string[] {
  return Object.keys(config.profiles);
}

export function getProfile(
  config: Config,
  name: string,
): Profile | undefined {
  return config.profiles[name];
}

export function profileToPersonOrOrg(profile: Profile): PersonOrOrganization {
  const p = new PersonOrOrganization();
  p.fromObject(profile as { [key: string]: unknown });
  return p;
}

export function formatProfile(profile: Profile): string {
  const isOrg = profile.type === "Organization" ||
    (!profile.givenName && !profile.familyName && !!profile.name);
  if (isOrg) return profile.name ?? "(unnamed organization)";
  const parts: string[] = [];
  if (profile.givenName) parts.push(profile.givenName);
  if (profile.familyName) parts.push(profile.familyName);
  const fullName = parts.join(" ") || (profile.name ?? "(unnamed)");
  const orgName = profile.affiliation?.name;
  return orgName ? `${fullName}, ${orgName}` : fullName;
}

export function getLicenseNames(config: Config): string[] {
  return Object.keys(config.licenses);
}

export function getLicense(
  config: Config,
  name: string,
): License | undefined {
  return config.licenses[name];
}

export async function getLicenseText(license: License): Promise<string | null> {
  if (license.file) {
    const home = Deno.env.get("HOME") ?? "";
    const filePath = license.file.replace(/^~/, home);
    try {
      return await Deno.readTextFile(filePath);
    } catch (_err) {
      return null;
    }
  }
  if (license.text) return license.text;
  return null;
}

export function getPersonListNames(config: Config): string[] {
  return Object.keys(config.person_lists);
}

export function getPersonList(
  config: Config,
  name: string,
): Profile[] | undefined {
  return config.person_lists[name];
}
