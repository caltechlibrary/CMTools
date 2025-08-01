// mk_version.ts generates a version.ts file for a project. It is suitable
// to call from a Deno task like build. It assumes it is a folder inside
// of the Git repository (e.g. `<PROJECT>/bldutils/mk_version.ts`).
import * as path from "@std/path";
import { CodeMeta } from "../codemeta.ts";
import { gitReleaseHash } from "../gitcmds.ts";

async function main() {
  const licenseText = await Deno.readTextFile("LICENSE");
  const codemetaText = await Deno.readTextFile("codemeta.json");
  const releaseHash = await gitReleaseHash();
  const codemeta: object = JSON.parse(codemetaText);
  const date = new Date();
  const releaseDate = `${date.getFullYear()}-${
    date.toLocaleDateString("en-US", { month: "2-digit" })
  }-${date.toLocaleDateString("en-US", { day: "2-digit" })}`;
  const version = (codemeta["version"] === undefined)
    ? "0.0.0"
    : codemeta["version"];
  const project_name = path.basename(Deno.cwd());
  const src = `// ${project_name} version and license information.

export const version = '${version}',
releaseDate = '${releaseDate}',
releaseHash = '${releaseHash}',
licenseText = ` + "`" + `
${licenseText}
` + "`;\n";
  console.log("Writing version.ts");
  Deno.writeTextFile("version.ts", src);
}

if (import.meta.main) main();
