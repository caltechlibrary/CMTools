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
    const obj: { [key: string]: unknown } = {};
    (this.id === undefined || this.id.length === 0) ? "" : obj["id"] = this.id;
    (this.type === undefined || this.type.trim().length === 0)
      ? ""
      : obj["type"] = this.type;
    (this.name === undefined || this.name.trim().length === 0)
      ? ""
      : obj["name"] = this.name;
    (this.givenName === undefined || this.givenName.length === 0)
      ? ""
      : obj["givenName"] = this.givenName;
    (this.familyName === undefined || this.familyName.length === 0)
      ? ""
      : obj["familyName"] = this.familyName;
    (this.affiliation === undefined)
      ? ""
      : obj["affiliation"] = this.affiliation;
    (this.email === undefined || this.email.length === 0)
      ? ""
      : obj["email"] = this.email;
    return obj;
  }

  fromObject(obj: { [key: string]: unknown }): boolean {
    (obj["id"] === undefined) || (obj["id"] === null)
      ? ""
      : this.id = (obj["id"] as string).trim();
    if (this.id === "") {
      (obj["@id"] === undefined) || (obj["@id"] === null)
        ? ""
        : this.id = (obj["@id"] as string).trim();
    }
    (obj["type"] === undefined) || (obj["type"] === null)
      ? ""
      : this.type = (obj["type"] as string).trim();
    if (this.type === "") {
      (obj["@type"] === undefined) || (obj["@type"] === null)
        ? ""
        : this.type = (obj["@type"] as string).trim();
    }
    (obj["name"] === undefined) || (obj["name"] === null)
      ? ""
      : (this.name = obj["name"] as string).trim();
    (obj["givenName"] === undefined) || (obj["givenName"] === null)
      ? ""
      : this.givenName = (obj["givenName"] as string).trim();
    (obj["familyName"] === undefined) || (obj["familyName"] === null)
      ? ""
      : this.familyName = (obj["familyName"] as string).trim();
    (obj["affiliation"] === undefined) || (obj["affiliation"] === null)
      ? ""
      : this.affiliation = obj["affiliation"] as PersonOrOrganization;
    (obj["email"] === undefined) || (obj["email"] === null)
      ? ""
      : this.email = (obj["email"] as string).trim();
    return true;
  }
}

export function normalizePersonOrOrgList(
  obj: object | string,
): PersonOrOrganization[] {
  const oType = Object.prototype.toString.call(obj);
  let p: PersonOrOrganization = new PersonOrOrganization();
  const l: { [key: string]: unknown }[] = [];
  switch (oType) {
    case "[object Array]":
      for (const item of Object.values(obj)) {
        p = new PersonOrOrganization();
        p.fromObject(item);
        if (p.type === "") {
          if (p.name === "") {
            p.type = "Person";
          } else if (p.familyName === "" && p.givenName === "") {
            p.type = "Organization";
          }
        }
        l.push(p.toObject() as { [key: string]: unknown });
      }
      break;
    case "[object Object]":
      p.fromObject(obj as { [key: string]: unknown });
      if (p.type === "") {
        if (p.name === "") {
          p.type = "Person";
        } else if (p.familyName === "" && p.givenName === "") {
          p.type = "Organization";
        }
      }
      l.push(p.toObject() as { [key: string]: unknown });
      break;
    case "[object String]":
      p.type = "Person";
      p.name = obj.toString().trim();
      l.push(p.toObject() as { [key: string]: unknown });
      break;
  }
  return l as unknown as PersonOrOrganization[];
}
