export interface PersonOrOrganizationInterface {
  fromObject(obj: object): boolean;
  toObject(): object;
}


export class PersonOrOrganization implements PersonOrOrganizationInterface {
  // ORCID is use for person id
  id: string = "";
  type: string = "";

  // Name is used by organizations
  name: string = "";
  // Given/Family are used by individual persons
  givenName: string = "";
  familyName: string = "";
  affiliation: PersonOrOrganization | undefined;
  email: string = "";

  toObject(): object {
    const obj: {[key: string]: unknown} = {};
    (this.id === undefined || this.id.length === 0) ? '': obj["id"] = this.id;
    (this.type === undefined || this.type.trim().length === 0) ? '': obj["type"] = this.type;
    (this.name === undefined || this.name.trim().length === 0) ? '': obj["name"] = this.name;
    (this.givenName === undefined || this.givenName.length === 0) ? '': obj["givenName"] = this.givenName;
    (this.familyName === undefined || this.familyName.length === 0) ? '': obj["familyName"] = this.familyName;
    (this.affiliation === undefined) ? '': obj["affiliation"] = this.affiliation;
    (this.email === undefined || this.email.length === 0) ? '': obj['email'] = this.email;
    return obj;
  }

  fromObject(obj: { [key: string]: unknown }): boolean {
    (obj["id"] === undefined) ? "" : this.id = obj["id"].trim();
    if (this.id === "") {
      (obj["@id"] === undefined) ? "" : this.id = obj["@id"].trim();
    }
    (obj["type"] === undefined) ? "" : this.type = obj["type"].trim();
    if (this.type === "") {
      (obj["@type"] === undefined) ? "" : this.type = obj["@type"].trim();
    }
    (obj["name"] === undefined) ? "" : this.name = obj["name"].trim();
    (obj["givenName"] === undefined) ? "" : this.givenName = obj["givenName"].trim();
    (obj["familyName"] === undefined) ? "" : this.familyName = obj["familyName"].trim();
    (obj["affiliation"] === undefined) ? '' : this.affiliation = obj["affiliation"];
    (obj["email"] === undefined) ? "" : this.email = obj["email"].trim();
    return true;
  }
}

export function normalizePersonOrOrgList(obj: object | string): PersonOrOrganization[] {
  const oType = Object.prototype.toString.call(obj);
  let p: PersonOrOrganization = new PersonOrOrganization();
  const l: {[key: string]: unknown}[] = [];
  switch (oType) {
    case "[object Array]":
      for (const item of Object.values(obj)) {
        p = new PersonOrOrganization();
        p.fromObject(item);
        if (p.type === "") {
          if (p.name === "") {
            p.type = "Person";
          } else if (p.familyName === "" && p.givenName === "" ){
            p.type = "Organization";
          }
        }
        l.push(p.toObject());
      }
      break;
    case "[object Object]":
      p.fromObject(obj as object);
      if (p.type === "") {
        if (p.name === "") {
          p.type = "Person";
        } else if (p.familyName === "" && p.givenName === "" ){
          p.type = "Organization";
        }
      }
      l.push(p.toObject());
      break;
    case "[object String]":
      p.type = "Person";
      p.name = obj.toString().trim();
      l.push(p.toObject());
      break;
  }
  return l as unknown as PersonOrOrganization[];
}
