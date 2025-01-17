// editFile takes an editor name and filename. It runs the editor using the
// filename (e.g. micro, nano, code) and returns success or failure based on
// the the exit status code. If the exit statuss is zero then true is return,
// otherwise false is returned.
export async function editFile(editor: string, filename: string): Promise<boolean> {
    const command = new Deno.Command(editor, { args: [filename] });
    const { code, stdout, stderr } = await command.output();
    if (code === 0) {
        return true;
    }
    console.log((new TextDecoder()).decode(stdout));
    console.log((new TextDecoder()).decode(stderr));
    return false;
}

// getEditorFromEnv looks at the environment variable and returns the value of EDITOR
// is set. Otherwise it returns an empty string.
export function getEditorFromEnv(): string {
    const editor = Deno.env.get("EDITOR");
    if (editor === undefined) {
        return '';
    }
    return editor;
}

// editTempData will take data in string form, write it
// to a temp file, open the temp file for editing and
// return the result. If a problem occurs then an undefined
// value is returns otherwise is the contents of the text file
// as a string.
export async function editTempData(val: string): Promise<string | undefined> {
    let editor = getEditorFromEnv();
    if (editor === '') {
        editor = 'micro';
    }
    const tmpFilename = await Deno.makeTempFile();
    if (val !== "") {
        await Deno.writeTextFile(tmpFilename, val);
    }
    if (await editFile(editor, tmpFilename)) {
        // Read back string
        const txt = await Deno.readTextFile(tmpFilename);
        await Deno.remove(tmpFilename);
        return txt;
    }
    return undefined;
}