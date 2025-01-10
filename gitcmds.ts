// gitcmds.ts this holds various commands to interact with Git in a Git repository.
import * as path from "@std/path";

export async function gitReleaseHash(): Promise<string> {
  const command = new Deno.Command("git", {
    args: [
      "log",
      "--pretty=format:%h",
      "-n",
      "1",
    ],
  });
  const { code, stdout, stderr } = await command.output();
  console.assert(code === 0);
  return (new TextDecoder()).decode(stdout);
}

async function getRemoteOriginURL(): Promise<string> {
  const command = new Deno.Command("git", {
    args: [
      "config",
      "--get",
      "remote.origin.url",
    ],
  });
  const { code, stdout, stderr } = await command.output();
  console.assert(code === 0);
  return (new TextDecoder()).decode(stdout);
}

export async function gitOrgOrPerson(): Promise<string> {
  // NOTE: Group directory is a fall back git there is no remote in the Git config
  const groupDir: string = path.basename(path.join(Deno.cwd(), "../"));
  const remoteOriginURL: string | undefined = await getRemoteOriginURL();
  //console.log(`DEBUG groupDir "${groupDir}"`);
  //console.log(`DEBUG remoteOriginURL "${remoteOriginURL}"`);
  // QUESTION: should I get the URL from the Git repo config or from CodeMeta?
  const u = URL.parse(
    remoteOriginURL.replace("git@github.com:", "https://github.com/"),
  );
  if (remoteOriginURL === undefined || remoteOriginURL === "" || u === null) {
    return groupDir;
  }
  return path.dirname(u.pathname).replace(/^\//, "");
}
