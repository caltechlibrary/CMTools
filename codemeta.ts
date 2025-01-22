// codemeta.ts is a part of cmtools.  It describes a Codemeta object.
import { PersonOrOrganization, normalizePersonOrOrgList } from "./person_or_organization.ts";

export interface AttributeTypeInterface {
   "name": string,
   "type": string,
   "help": string
};

export class AttributeType implements AttributeTypeInterface {
  name: string = "";
  type: string = "";
  help: string = "";

  constructor(name?: string, type?: string, help?: string) {
    if (name === undefined) {
      this.name = '';
    } else {
      this.name = name;
    }
    if (type === undefined) {
      this.type = '';
    } else {
      this.type = type;
    }
    if (help === undefined) {
      this.help = '';
    } else {
      this.help = help;
    }
  }
}


// Top level terms attribute from https://codemeta.github.io/terms/
// NOTE: This is a subset of all attributes to explore the proof of concept usage of cmt and cme.
export const CodeMetaTerms: AttributeType[] = [ 
  new AttributeType("name", "text", "Type of software application, e.g. 'Game, Multimedia'."),
  new AttributeType("description", "text", "A description of the item."),
  new AttributeType("author", "person_or_organization_list", "The author of this content or rating. Please note that author is special in that HTML 5 provides a special mechanism for indicating authorship via the rel tag. That is equivalent to this and may be used interchangeably. (enter as YAML list)"),
  new AttributeType("contributor", "person_or_organization_list", "A secondary contributor to the CreativeWork or Event. (enter as YAML list)"),
  new AttributeType("maintainer", "person_or_organization_list", "Individual responsible for maintaining the software (usually includes an email contact address). (enter ass YAML list)"),
  new AttributeType("codeRepository", "url", "Link to the repository where the un-compiled, human readable code and related code is located (SVN, GitHub, CodePlex, institutional GitLab instance, etc.)."),
  new AttributeType("copyrightYear", "number", "The year during which the claimed copyright for the CreativeWork was first asserted."), 
  new AttributeType("copyrightHolder", "person_or_organization", "The party holding the legal copyright to the CreativeWork. "),
  new AttributeType("funder", "person_or_organization", "A person or organization that supports (sponsors) something through some kind of financial contribution."),
  new AttributeType("funding", "text", "Funding source (e.g. specific grant)"),
  new AttributeType("dateCreated", "date", "The date on which the CreativeWork was created or the item was added to a DataFeed."),
  new AttributeType("dateModified", "date", "The date on which the CreativeWork was most recently modified or when the item's entry was modified within a DataFeed."),
  new AttributeType("datePublished", "date", "Date of first broadcast/publication."),
  new AttributeType("version", "number_or_text", "The version of the CreativeWork embodied by a specified resource."),
  new AttributeType("releaseNotes", "text_or_url", "Description of what changed in this version."),
  new AttributeType("downloadUrl", "url", "If the file can be downloaded, URL to download the binary."),
  new AttributeType("installUrl", "url", "URL at which the app may be installed, if different from the URL of the item."),
  new AttributeType("identifier", "property_value_or_url", "The identifier property represents any kind of identifier for any kind of Thing, such as ISBNs, GTIN codes, UUIDs etc. Schema.org provides dedicated properties for representing many of these, either as textual strings or as URL (URI) links. See background notes for more details."),
  new AttributeType("keywords", "text_list", "Keywords or tags used to describe this content. Multiple entries in a keywords list are typically delimited by commas."),
  new AttributeType("license", "text_or_url", "A license document that applies to this content, typically indicated by URL."),
  new AttributeType("programmingLanguage", "text", "The computer programming language."),
  new AttributeType("operatingSystem", "text", "Operating systems supported (Windows 7, OSX 10.6, Android 1.6)."),
  new AttributeType("runtimePlatform", "text", "Runtime platform or script interpreter dependencies (Example - Java v1, Python2.3, .Net Framework 3.0). Supersedes runtime."),
  new AttributeType("processorRequirements", "text", "Processor architecture required to run the application (e.g. IA64)."),
  new AttributeType("softwareRequirements", "text_list", "Required software dependencies"),
  new AttributeType("relatedLink", "url_list", "A link related to this object, e.g. related web pages"), 
  new AttributeType("publisher", "person_or_organization_list", "The publisher of the creative work."),
  new AttributeType("issueTracker", "url", "link to software bug reporting or issue tracking system"),
  new AttributeType("referencePublication", "url", "An academic publication related to the software."),
  new AttributeType("softwareSuggestions", "text_list", "Optional dependencies , e.g. for optional features, code development, etc."),
];

// Attributes used by CodeMeta terms taken from https://codemeta.github.io/terms/
// NOTE: This is a subset for proof of concept
export const CodeMetaAttributes: AttributeType[] = [
  new AttributeType("address", "text", "Physical address of the item."),
  new AttributeType("affiliation", "organization", "An organization that this person is affiliated with. For example, a school/university"),
  new AttributeType("email", "text", "Email address"),
  new AttributeType("familyName", "text", "Family name. In the U.S., the last name of an Person. This can be used along with givenName instead of the name property."),
  new AttributeType("givenName", "text", "Given name. In the U.S., the first name of a Person. This can be used along with familyName instead of the name property"),
  new AttributeType("identifier", "property_value_or_url", "The identifier property represents any kind of identifier for any kind of Thing, such as ISBNs, GTIN codes, UUIDs etc. Schema.org provides dedicated properties for representing many of these, either as textual strings or as URL (URI) links. See background notes for more details"),
  new AttributeType("name", "text", "The name of the item (software, Organization)"),
  new AttributeType("relatedLink", "url", "A link related to this object, e.g. related web pages"),
];

export interface CodeMetaInterface {
  atContext: string;
  toObject(): {[key: string]: string};
  fromObject(obj: {[key: string]: string}): boolean;
  patchObject(obj: {[key: string]: string}): boolean;
}

export class CodeMeta implements CodeMetaInterface {
  atContext: string = "https://w3id.org/codemeta/3.0";
  identifier: string = "";
  type: string = "";
  version: string = "";
  author: PersonOrOrganization[] = [];
  contributor: PersonOrOrganization[] = [];
  maintainer: PersonOrOrganization[] = [];
  codeRepository: string = "";
  dateCreated: string = "";
  dateModified: string = ""; // dateModified holds the most recent released
  datePublished: string = ""; // Date something is released date in cff file, in CodeMeta geneator this the value from "first published" field
  name: string = "";
  description: string = "";
  license: string = ""; // .license in output codemeta, should be a url to text of license
  licenseText?: string = ""; // This is an optional field that can hold the text of the license
  keywords: string[] = [];
  funding: string = "";
  funder: PersonOrOrganization[] = [];
  issueTracker: string = "";
  relatedLink: string[] = [];
  programmingLanguage: string[] = [];
  runtimePlatform: string[] = [];
  operatingSystem: string[] = [];
  softwareRequirements: string[] = [];
  downloadUrl: string = "";
  releaseNotes: string = "";
  developmentStatus: string = "";

  toObject(): {[key: string]: any} {
    //FIXME: Only build an `{[key: string]: string}` minimal object
    let obj: {[key: string]: any} = {};
    obj["@context"] = this.atContext;
    obj["type"] = this.type;
    (this.codeRepository !== "") ? obj["codeRepository"] = this.codeRepository : '';
    (this.author.length > 0) ? obj["author"] = this.author : [];
    (this.contributor.length > 0) ? obj["contributor"] = this.contributor: [];
    (this.maintainer.length > 0) ? obj["maintainer"] = this.maintainer: [];
    (this.dateCreated !== "") ? obj["dateCreated"] = this.dateCreated: '';
    (this.dateModified !== "") ? obj["dateModified"] = this.dateModified: '';
    (this.datePublished !== "") ? obj["datePublished"] = this.datePublished: '';
    (this.description !== "") ? obj["description"] = this.description : '';
    (this.funder.length > 0) ? obj["funder"] = this.funder: [];
    (this.funding !== "") ? obj["funding"] = this.funding: '';
    (this.keywords.length > 0) ? obj["keywords"] = this.keywords: [];
    (this.name !== "") ? obj["name"] = this.name: '';
    (this.license !== "") ? obj['license'] = this.license: '';
    (this.operatingSystem.length > 0) ? obj["operatingSystem"] = this.operatingSystem: [];
    (this.programmingLanguage.length > 0) ? obj['programmingLanguage'] = this.programmingLanguage: [];
    (this.relatedLink.length > 0) ? obj['relatedLink'] = this.relatedLink : [];
    (this.runtimePlatform.length > 0) ? obj['runtimePlatform'] =  this.runtimePlatform: [];
    (this.softwareRequirements.length > 0) ? obj['softwareRequirements'] = this.softwareRequirements: [];
    (this.version !== "") ? obj['version'] = this.version : '';
    (this.developmentStatus !== '') ? obj['developmentStatus'] = this.developmentStatus: '';
    (this.issueTracker !== '') ? obj['issueTracker'] = this.issueTracker: '';
    (this.downloadUrl !== '') ? obj['downloadUrl'] = this.downloadUrl: '';
    (this.releaseNotes !== '') ? obj['releaseNotes'] = this.releaseNotes: '';
    (this.identifier !== '') ? obj['identifier'] = this.identifier: '';
    return obj;
  }

  fromObject(obj: { [key: string]: any }): boolean {
    //FIXME: obj
    //FIXME: need to handle prior codemeta version import
    this.atContext = (obj["@context"] === undefined)
      ? "https://w3id.org/codemeta/3.0"
      : obj["@context"];
    this.type = (obj["type"] === undefined) ? "" : obj["type"];
    if (obj["identifier"] === undefined) {
      this.identifier = "";
    } else {
      this.identifier = obj["identifier"];
    }
    if (obj["author"] === undefined) {
      this.author = [];
    } else {
      //FIXME: if this is NOT an array I need to write code to handle it here.
      const oType = Object.prototype.toString.call(obj["author"]); 
      this.author = normalizePersonOrOrgList(obj['author']);
    }
    if (obj["license"] === undefined) {
      this.license = "";
    } else {
      // This field should be a URL
      try {
        const u = URL.parse(obj["license"]);
        if (u !== null) {
          this.license = obj["license"];
        } else {
          this.license = "";
          this.licenseText = obj["license"];
        }
      } catch (err) {
        this.license = "";
      }
    }
    if (obj["contributor"] === undefined) {
      this.contributor = [];
    } else {
      //FIXME: if this is NOT an array I need to write code to handle it here.
      this.contributor = normalizePersonOrOrgList(obj["contributor"]);
    }
    if (obj["maintainer"] === undefined) {
      this.maintainer = [];
    } else {
      //FIXME: if this is NOT an array I need to write code to handle it here.
      this.maintainer = normalizePersonOrOrgList(obj["maintainer"]);
    }
    this.codeRepository = (obj["codeRepository"] === undefined)
      ? ""
      : obj["codeRepository"];
    this.dateCreated = (obj["dateCreated"] === undefined)
      ? ""
      : obj["dateCreated"];
    this.dateModified = (obj["dateModified"] === undefined)
      ? ""
      : obj["dateModified"];
    this.description = (obj["description"] === undefined)
      ? ""
      : obj["description"];
    this.funder = (obj["funder"] === undefined) ? "" : obj["funder"];
    this.funding = (obj["funding"] == undefined) ? "" : obj["funding"];
    this.keywords = (obj["keywords"] === undefined) ? [] : obj["keywords"];
    this.name = (obj["name"] === undefined) ? "" : obj["name"];
    this.operatingSystem = (obj["operatingSystem"] === undefined)
      ? ""
      : obj["operatingSystem"];
    if (obj["programmingLanguage"] === undefined) {
      this.programmingLanguage = [];
    } else {
      this.programmingLanguage = [];
      if (typeof obj["programmingLanguage"] === "string") {
        this.programmingLanguage.push(obj["programmingLanguage"]);
      } else {
        this.programmingLanguage = obj["programmingLanguage"];
      }
    }
    this.relatedLink = (obj["relatedLink"] === undefined)
      ? ""
      : obj["relatedLink"];
    this.runtimePlatform = (obj["runtimePlatform"] === undefined)
      ? ""
      : obj["runtimePlatform"];
    if (obj["softwareRequirements"] === undefined) {
      this.softwareRequirements = [];
    } else {
      if (typeof (obj["softwareRequirements"]) === "string") {
        this.softwareRequirements = [];
        this.softwareRequirements.push(obj["softwareRequirements"]);
      } else {
        this.softwareRequirements = obj["softwareRequirements"];
      }
    }
    this.version = (obj["version"] === undefined) ? "" : obj["version"];
    this.developmentStatus = (obj["developmentStatus"] === undefined)
      ? ""
      : obj["developmentStatus"];
    this.issueTracker = (obj["issueTracker"] === undefined)
      ? ""
      : obj["issueTracker"];
    this.downloadUrl = (obj["downloadUrl"] === undefined)
      ? ""
      : obj["downloadUrl"];
    this.releaseNotes = (obj["releaseNotes"] === undefined)
      ? ""
      : obj["releaseNotes"];
    return true;
  }

  patchObject(obj: { [key: string]: any }): boolean {
    //FIXME: obj
    //FIXME: need to handle prior codemeta version import
    this.atContext = (obj["@context"] === undefined)
      ? this.atContext
      : obj["@context"];
    this.type = (obj["type"] === undefined) ? this.type : obj["type"];
    if (obj["identifier"] === undefined) {
      // do nothing.
    } else {
      this.identifier = obj["identifier"];
    }
    if (obj["author"] === undefined) {
      // do nothing.
    } else {
      //FIXME: if this is NOT an array I need to write code to handle it here.
      const oType = Object.prototype.toString.call(obj["author"]); 
      this.author = normalizePersonOrOrgList(obj['author']);
    }
    if (obj["license"] === undefined) {
      // do nothing.
    } else {
      // This field should be a URL
      try {
        const u = URL.parse(obj["license"]);
        if (u !== null) {
          this.license = obj["license"];
        } else {
          // do nothing.
          this.license = "";
          this.licenseText = obj["license"];
        }
      } catch (err) {
        // do nothing.
      }
    }
    if (obj["contributor"] === undefined) {
      // do nothing.
    } else {
      //FIXME: if this is NOT an array I need to write code to handle it here.
      this.contributor = normalizePersonOrOrgList(obj["contributor"]);
    }
    if (obj["maintainer"] === undefined) {
      // do nothing.
    } else {
      //FIXME: if this is NOT an array I need to write code to handle it here.
      this.maintainer = normalizePersonOrOrgList(obj["maintainer"]);
    }
    this.codeRepository = (obj["codeRepository"] === undefined)
      ? this.codeRepository
      : obj["codeRepository"];
    this.dateCreated = (obj["dateCreated"] === undefined)
      ? this.dateCreated
      : obj["dateCreated"];
    this.dateModified = (obj["dateModified"] === undefined)
      ? this.dateModified
      : obj["dateModified"];
    this.description = (obj["description"] === undefined)
      ? this.description
      : obj["description"];
    this.funder = (obj["funder"] === undefined) ? this.funder : obj["funder"];
    this.funding = (obj["funding"] == undefined) ? this.funding : obj["funding"];
    this.keywords = (obj["keywords"] === undefined) ? this.keywords : obj["keywords"];
    this.name = (obj["name"] === undefined) ? this.name : obj["name"];
    this.operatingSystem = (obj["operatingSystem"] === undefined)
      ? this.operatingSystem
      : obj["operatingSystem"];
    if (obj["programmingLanguage"] === undefined) {
      // do nothing.
    } else {
      this.programmingLanguage = (this.programmingLanguage === undefined) ? [] : this.programmingLanguage;
      if (typeof obj["programmingLanguage"] === "string") {
        this.programmingLanguage.push(obj["programmingLanguage"]);
      } else {
        this.programmingLanguage = obj["programmingLanguage"];
      }
    }
    this.relatedLink = (obj["relatedLink"] === undefined)
      ? this.relatedLink
      : obj["relatedLink"];
    this.runtimePlatform = (obj["runtimePlatform"] === undefined)
      ? this.runtimePlatform
      : obj["runtimePlatform"];
    if (obj["softwareRequirements"] === undefined) {
      // do nothing.
    } else {
      this.softwareRequirements = (this.softwareRequirements === undefined) ? [] : this.softwareRequirements; 
      if (typeof (obj["softwareRequirements"]) === "string") {
        this.softwareRequirements.push(obj["softwareRequirements"]);
      } else {
        this.softwareRequirements = obj["softwareRequirements"];
      }
    }
    this.version = (obj["version"] === undefined) ? this.version : obj["version"];
    this.developmentStatus = (obj["developmentStatus"] === undefined)
      ? this.developmentStatus
      : obj["developmentStatus"];
    this.issueTracker = (obj["issueTracker"] === undefined)
      ? this.issueTracker
      : obj["issueTracker"];
    this.downloadUrl = (obj["downloadUrl"] === undefined)
      ? this.downloadUrl
      : obj["downloadUrl"];
    this.releaseNotes = (obj["releaseNotes"] === undefined)
      ? this.releaseNotes
      : obj["releaseNotes"];
    return true;
  }
}

