import { CodeMeta, CodeMetaTerms, AttributeType } from './codemeta.ts';

function getAttributeByName(name: string): AttributeType | undefined {
    for (let attr of CodeMetaTerms) {
      if (attr.name === name) {
        return attr;
      }
    }
    return undefined
  }
  
  
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

export function editCodeMetaTerm(cm: CodeMeta, name: string): boolean {
    const attr = getAttributeByName(name);
    // Prompt and get value back as string
    // Inspect the attribute and determine what to of value
    // Use CodeMeta patchObject similar to fromObject but for simple
    // attribute update.
    if (attr === undefined) {
      return false;
    }

    console.log(`DEBUG attribute name: ${name}`);
    let val: string | null = prompt(`Enter ${name}: `, '');
    if (val === null) return false;
    const obj: {[key: string]: any} = {};
    if (setObjectFromString(obj, name, val, attr.type) === false) {
      console.log(`DEBUG obj type -> ${attr.type}, name -> ${name}, val -> ${val}`);
      return  false;
    }
    console.log(`DEBUG updating obj[${name}] -> ${obj[name]}`);
    console.log(`DEBUG edit ${name} attr: ${attr}`);    
    return cm.patchObject(obj);     
}

export function setObjectFromString(obj: {[key: string]: any}, key: string, val: string, data_type: string): boolean {
  let n: number = 0;
  let dt: Date;
  let u: URL | null;


  switch (data_type) {
    case "text":
      obj[key] = val;
      break;
    case "url":
      u = URL.parse(val);
      if (u === null) return false;
      obj[key] = u;
      break;
    case "number": 
      n = (new Number(val)).valueOf();
      if (isNaN(n)) return false;
      obj[key] = n;
      break;
    case "date":
      dt = new Date(val);
      if (isNaN(dt.valueOf())) return false;
      obj[key] = dt;
    case "text_or_url":
      u = URL.parse(val);
      if (u === null) {
        obj[key] = val;
      } else {
        obj[key] = u;
      }
      break;
    case "number_or_text":
      n = (new Number(val)).valueOf();
      if (isNaN(n)) {
        obj[key] = val;
      } else {
        obj[key] = n;
      }
      break;
    case "property_value_or_url":
      obj[key] = val;
      break;
    case "text_list":
      return false; // FIXME: NOT IMPLEMENT
      break;
    case "url_list":
      return false; // FIXME: NOT IMPLEMENT
      break;
    case "person_or_organization_list":
      //FIXME: need to parse a complex YAML expression from text.
      return false; // FIXME: NOT IMPLEMENT
      break;
    default:
      // Unsupported conversion
      break;
  }
  return true;
}