// mk_version.ts generates a version.ts file for a project. It is suitable
// to call from a Deno task like build. It assumes it is a folder inside
// of the Git repository (e.g. `<PROJECT>/bldutils/mk_version.ts`).
import * as path from "@std/path";
import * as markdown from "@libs/markdown";
import { renderTemplate } from "../transform.ts";

async function mkHTMLPage(inputName: string, outputName: string): Promise<string> {
    const src = await Deno.readTextFile(inputName);
    const encoder = new markdown.Renderer();
    const block = await encoder.render(src);
    // FIXME: trim front matter from block.
    const hbsTemplate = await Deno.readTextFile("page.hbs");
    const page = renderTemplate({"content": block}, hbsTemplate);
    await Deno.writeTextFile(outputName, page);
    return `Wrote ${inputName} as ${outputName}`;
}

async function main() {
    const args: string[] = Deno.args.slice(0);
    const inputName: string = (args[0] === undefined) ? '': args.shift() + '';
    let outputName: string = (args[0] === undefined) ? '' : args.shift() + '';

    if (inputName === '') {
    	console.log("usage: deno run --allow-read --allow-write  bldutils/mk_html.ts MD_NAME [HTML_NAME]");
    	console.log("Missing Markdown filename");
    	Deno.exit(1);
    }
    if (outputName === '') {
        outputName = inputName.replace(/\.md$/i, '') + ".html";
        console.log(`using ${outputName} for HTML_NAME`);
    }
    mkHTMLPage(`${inputName}`, `${outputName}`);
}

if (import.meta.main) main();
