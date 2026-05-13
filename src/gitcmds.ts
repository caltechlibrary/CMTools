// gitcmds.ts this holds various commands to interact with Git in a Git repository.
import * as path from "@std/path";

export async function gitReleaseHash(): Promise<string> {
  const options: string[] = [
    "log",
    "--pretty=format:%h",
    "-n",
    "1",
  ];
  const command = new Deno.Command("git", {
    args: options,
  });
  // NOTE: stderr isn't used yet, maybe later.
  const { code, stdout, stderr } = await command.output();
  if (code > 0) {
    console.log(`"git ${options.join(" ")}" exited with ${code}`);
    return "";
  }
  return (new TextDecoder()).decode(stdout);
}

// Normalize a raw remote.origin.url to a plain HTTPS URL:
//   git@github.com:org/repo.git      → https://github.com/org/repo
//   git+https://github.com/org/repo.git → https://github.com/org/repo
export function normalizeRemoteURL(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const sshMatch = trimmed.match(/^git@([^:]+):(.+)$/);
  if (sshMatch) {
    return `https://${sshMatch[1]}/${sshMatch[2].replace(/\.git$/, "")}`;
  }
  return trimmed.replace(/^git\+/, "").replace(/\.git$/, "");
}

export async function getRemoteOriginURL(): Promise<string> {
  const options: string[] = ["config", "--get", "remote.origin.url"];
  const command = new Deno.Command("git", { args: options });
  const { code, stdout } = await command.output();
  if (code > 0) return "";
  return normalizeRemoteURL((new TextDecoder()).decode(stdout));
}

export async function gitOrgOrPerson(): Promise<string> {
  // Fall back to parent directory name when no git remote is configured.
  const groupDir: string = path.basename(path.join(Deno.cwd(), "../"));
  const remoteOriginURL: string = await getRemoteOriginURL();
  const u = URL.parse(remoteOriginURL);
  if (!remoteOriginURL || u === null) {
    return groupDir;
  }
  return path.dirname(u.pathname).replace(/^\//, "");
}
