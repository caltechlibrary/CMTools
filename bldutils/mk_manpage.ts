// mk_manpage.ts generates a man page for given tool in a project. It is suitable
// to call from a Deno task like build. It assumes it is a folder inside
// of the Git repository (e.g. `<PROJECT>/bldutils/mk_manpage.ts`).
import * as path from "@std/path";

async function mkManPage(name: string, chapter: number): Promise<string> {
  const mName = `${name}.${chapter}`;
  Deno.mkdir(`man/man${chapter}`, { recursive: true });
  const command = new Deno.Command("pandoc", {
    args: [
      `${name}.${chapter}.md`,
      "--from=markdown",
      "--to=man",
      "-s",
      "-o",
      `man/man${chapter}/${name}.${chapter}`,
    ],
  });
  const { code, stdout, stderr } = await command.output();
  console.assert(code === 0);
  return (new TextDecoder()).decode(stdout);
}

async function main() {
  const args: string[] = Deno.args.slice(0);
  const name: string | undefined = args.shift();
  const chpt: string | undefined = args.shift();
  if (name === undefined) {
    console.log(
      "usage: deno run --allow-run --allow-read --allow-write  bldutils/mk_manpages.ts PAGE_NAME CHAPTER_NO",
    );
    console.log("Missing chapter name");
    Deno.exit(1);
  }
  if (chpt === undefined) {
    console.log(
      "usage: deno run --allow-run --allow-read --allow-write  bldutils/mk_manpages.ts PAGE_NAME CHAPTER_NO",
    );
    console.log("Missing chapter number");
    Deno.exit(1);
  }
  const chapter = new Number(chpt) as number;
  if (isNaN(chapter)) {
    console.log(`Invalid chapter number, ${chpt}`);
  }
  mkManPage(name, chapter.valueOf());
}

if (import.meta.main) main();
