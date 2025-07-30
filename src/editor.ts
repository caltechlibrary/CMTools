
function pickEditor(): string {
  const editor: string | undefined = Deno.env.get("EDITOR");
  if (editor === undefined) {
    if (Deno.build.os === "windows") {
      editor = "notepad.exe";
    } else {
      editor = "nano";
    }
  }
  return editor as string;
}

export function getEditorFromEnv(envVar?: string): string {
  const editor: string | undefined = (envVar === undefined)  ? undefined : Deno.env.get(envVar);
  if (editor === undefined) {
    return pickEditor();
  }
  return editor as string;
}

// editor.ts assumes Micro Editor in order to simplify testing.
const editor: string = pickEditor();

// editFile takes an editor name and filename. It runs the editor using the
// filename (e.g. micro, nano, code) and returns success or failure based on
// the the exit status code. If the exit statuss is zero then true is return,
// otherwise false is returned.
export async function editFile(
  editor: string,
  filename: string,
): Promise<{ ok: boolean; text: string }> {
  const command = new Deno.Command(editor, {
    args: [filename],
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });
  const child = command.spawn();
  const status = await child.status;
  if (status.success) {
    const txt = await Deno.readTextFile(filename);
    return { ok: status.success, text: txt };
  }
  return { ok: status.success, text: "" };
}

// editTempData will take data in string form, write it
// to a temp file, open the temp file for editing and
// return the result. If a problem occurs then an undefined
// value is returns otherwise is the contents of the text file
// as a string.
export async function editTempData(val: string): Promise<string> {
  const tmpFilename = await Deno.makeTempFile({
    dir: "./",
    prefix: "cme_",
    suffix: ".tmp",
  });
  if (val !== "") {
    await Deno.writeTextFile(tmpFilename, val);
  }
  const res = await editFile(editor, tmpFilename);
  await Deno.remove(tmpFilename);
  if (res.ok) {
    // NOTE: string is returned via standard out not the text of the file.
    return res.text;
  }
  return val;
}

