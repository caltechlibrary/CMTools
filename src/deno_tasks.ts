/*
const denoTasks: { [key: string]: string } = {};
// Handle updating the deno.json file.
if (isDeno) {
let src: string | undefined = undefined;
let doBackup: boolean = true;
try {
    src = await Deno.readTextFile("deno.json");
} catch (_err) {
    console.warn(`creating %cdeno.json`, GREEN);
    doBackup = false;
}
if (src === undefined) {
    src = `{"tasks":{}}`;
}

let denoJSON: { [key: string]: unknown } = {};
try {
    denoJSON = JSON.parse(src) as {[key: string]: {[key:string]: unknown}};
} catch (err) {
    console.log(`deno.json error, %c${err}`, ERROR_COLOR);
    Deno.exit(0);
}
const genCodeTasks: string[] = [];
if (denoJSON.tasks === undefined || denoJSON.tasks === null) {
    denoJSON.tasks = {} as {[key: string]: string};
}
const tasks: {[key:string]: string} = {};
for (const taskName of Object.keys(denoTasks)) {
    tasks[taskName] = denoTasks[taskName];
    genCodeTasks.push(`deno task ${taskName}`);
}
if (genCodeTasks.length > 0) {
    tasks["gen-code"] = (genCodeTasks as string[]).join(" ; ");
}
if (Object(tasks).keys().length > 0) {
    denoJSON.tasks = tasks;
}
// Update deno.json file.
if (doBackup) {
    try {
    await Deno.copyFile("deno.json", "deno.json.bak");
    } catch (err) {
    console.log(
        `failed to backup deno.json aborting, %c${err}`,
        ERROR_COLOR,
    );
    Deno.exit(1);
    }
}
src = JSON.stringify(denoJSON, null, 2);
if (src !== undefined) {
    Deno.writeTextFile("deno.json", src);
}
}
*/
