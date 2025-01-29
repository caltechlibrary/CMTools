import { CodeMeta, CodeMetaTerms, AttributeType } from './codemeta.ts';
import { PersonOrOrganization } from './person_or_organization.ts';
import * as yaml from "@std/yaml";
import { type StringifyOptions, type ParseOptions } from "@std/yaml/"

// editor.ts assumes Micro Editor in order to simplify testing.
let editor = 'micro';

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
export async function editFile(editor: string, filename: string): Promise<{ok: boolean, text: string}> {
    const decoder = new TextDecoder();
    const command = new Deno.Command(editor, { args: [filename] });
    const { code, stdout, stderr } = await command.output();
    let txt = decoder.decode(stdout);
    if (code === 0) {
        return { ok: true, text: txt };
    }
    txt = decoder.decode(stderr);
    return { ok: false, text: txt };
}

// editTempData will take data in string form, write it
// to a temp file, open the temp file for editing and
// return the result. If a problem occurs then an undefined
// value is returns otherwise is the contents of the text file
// as a string.
export async function editTempData(val: string): Promise<string> {
    const tmpFilename = await Deno.makeTempFile({dir: "./", prefix: "cme_", suffix: ".tmp"});
    if (val !== "") {
        await Deno.writeTextFile(tmpFilename, val);
    }
    let res = await editFile(editor, tmpFilename);
    await Deno.remove(tmpFilename);
    if (res.ok) {
        // NOTE: string is returned via standard out not the text of the file.
        return res.text;
    }
    return val;
}

export async function editCodeMetaTerm(cm: CodeMeta, name: string, useEditor: boolean): Promise<boolean> {
    const attr = getAttributeByName(name);
    // Prompt and get value back as string
    // Inspect the attribute and determine what to of value
    // Use CodeMeta patchObject similar to fromObject but for simple
    // attribute update.
    if (attr === undefined) {
      return false;
    }
    const obj: {[key: string]: any} = {};
    let curVal: string | undefined = '';
    curVal = getStringFromObject(cm.toObject(), name);
    let val: string | undefined = undefined;
    console.log(`Default: ${name}: ${curVal}`);
    if (useEditor) {
      if (confirm(`Edit ${name}?`)) {
        const eVal = (curVal === undefined) ? '': curVal;
        val = await editTempData(eVal);
      }
    } else {
      let pVal: string | null = '';
      if ([ "author", "maintainer", "contributor", "funder", "softwareRequirements", "programmingLanguage", "keywords" ].indexOf(name) > -1) {
        console.log(`Enter YAML for ${name}. Enter period '.' on an empty line when done.`);
        let decoder = new TextDecoder();
        let lines: string[] = [];
        let txt: string | null = '';
        while (txt !== null && txt.trim() !== ".") {
          txt = prompt('');
          if (txt !== null && txt.trim() !== ".") {
            lines.push(txt);
          }
        }
        //FIXME: Need to distinguish from "no change" and "remove value(s)"
        txt = lines.join('\n').trim();
        if (txt === '') {
          pVal = null;
        } else {
          pVal = txt;
        }
      } else {
        pVal = prompt(`Enter ${name} (press enter, to accept current value): `, '');
      }
      if (pVal === null) { 
        val = undefined; 
      } else {
        val = pVal;
      }
    }
    if (val === undefined || val === '') {
      return false;
    }
    if (setObjectFromString(obj, name, val.trim(), attr.type) === false) {
      return  false;
    }
    return cm.patchObject(obj);
}

export function getStringFromObject(obj: {[key : string]: any}, key: string): string | undefined {
  if (obj[key] === undefined) {
    return undefined;
  }
  let val: string | number | any[] = obj[key];
  if (val === undefined) {
    return undefined;
  }
  let src: string | undefined = undefined;
  if ([ "author", "contributor", "maintainer", "funder", "keywords", "operatingSystem", "softwareRequired" ].indexOf(key) > -1) {
    try {
      let yamlOpt: StringifyOptions = {};
      yamlOpt.skipInvalid = true;
      src = yaml.stringify(val, yamlOpt);
    } catch (err) {
      console.log(`YAML ERROR: ${err} -> ${val}, editing as JSON`);
      try {
        src = JSON.stringify(val, null, 2);
      } catch (err) {
        console.log(`JSON ERROR: ${err} -> ${val}`);
        return undefined;
      }
    }  
  } else if (obj[key] !== undefined) {
    src = obj[key] as unknown as string;
  }
  return src;
}

export function setObjectFromString(obj: {[key: string]: any}, key: string, val: string, data_type: string): boolean {
  let n: number = 0;
  let dt: Date;
  let u: URL | null;
  let textData: string[] = [];
  let personData: PersonOrOrganization[] = [];
  let objData: { [key: string]: any} = {};

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
      try {
        textData = yaml.parse(val) as unknown as string[];
      } catch (err) {
        return false;
      }
      obj[key] = textData;      
      break;
    case "url_list":
      try {
        textData = yaml.parse(val) as unknown as string[];
      } catch (err) {
        console.log(`YAML ERROR: ${err} -> ${val}`);
        return false;
      }
      let list_of_url: URL[] = [];
      for (let item of textData) {
        let u: URL | null = URL.parse(item);
        if (u !== null) {
          list_of_url.push(u);
        }
      }
      obj[key] = list_of_url;
      break;
    case "person_or_organization":
      try {
        objData = yaml.parse(val + "\n") as unknown as PersonOrOrganization;
      } catch (err) {
        console.log(`YAML ERROR: ${err} -> ${val}`);
        try {
          objData = JSON.parse(val) as unknown as PersonOrOrganization;
        } catch (err) {
          console.log(`JSON ERROR: ${err} -> ${val}`);
          return false;
        }
      }
      obj[key] = objData;
      break;
    case "person_or_organization_list":
      try {
        personData = yaml.parse(val + "\n") as unknown as PersonOrOrganization[];
      } catch (err) {
        console.log(`YAML ERROR: ${err} -> ${val}`);
        try {
          personData = JSON.parse(val) as unknown as PersonOrOrganization[];
        } catch (err) {
          console.log(`JSON ERROR: ${err} -> ${val}`);
          return false;
        }
      }
      obj[key] = personData;
      break;
    default:
      // Unsupported conversion
      break;
  }
  return true;
}