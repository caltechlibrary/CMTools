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
  const { code, stdout, stderr } = await command.output();
  if (code > 0) {
    console.log(`"git ${options.join(" ")}" exited with ${code}`);
    return "";
  }
  return (new TextDecoder()).decode(stdout);
}

async function getRemoteOriginURL(): Promise<string> {
  const options: string[] = [
    "config",
    "--get",
    "remote.origin.url",
  ];
  const command = new Deno.Command("git", {
    args: options,
  });
  const { code, stdout, stderr } = await command.output();
  if (code > 0) {
    console.log(`"git ${options.join(" ")}" exited with ${code}`);
    return "";
  }
  return (new TextDecoder()).decode(stdout);
}

export async function gitOrgOrPerson(): Promise<string> {
  // NOTE: Group directory is a fall back git there is no remote in the Git config
  const groupDir: string = path.basename(path.join(Deno.cwd(), "../"));
  const remoteOriginURL: string | undefined = await getRemoteOriginURL();
  // QUESTION: should I get the URL from the Git repo config or from CodeMeta?
  const u = URL.parse(
    remoteOriginURL.replace("git@github.com:", "https://github.com/"),
  );
  if (remoteOriginURL === undefined || remoteOriginURL === "" || u === null) {
    return groupDir;
  }
  return path.dirname(u.pathname).replace(/^\//, "");
}
