// codemeta.ts is a part of cmtools.  It describes a Codemeta object.
import { PersonOrOrganization, normalizePersonOrOrgList } from "./person_or_organization.ts";

export interface CodeMetaInterface {
  atContext: string;
  toObject(): object;
  fromObject(obj: object): boolean;
}

export class CodeMeta implements CodeMetaInterface {
  atContext: string = "https://doi.org/10.5063/schema/codemeta-2.0";
  type: string = "";
  version: string = "";
  applicationCategory: string = "";
  author: PersonOrOrganization[] = [];
  codeRepository: string = "";
  dateCreated: string = "";
  dateModified: string = "";
  name: string = "";
  description: string = "";
  creationDate: string = "";
  firstRelease: string = "";
  license: string = "";
  uniqueIdentifier: string = "";
  keywords: string[] = [];
  funding: string = "";
  funder: PersonOrOrganization | undefined;
  contributor: PersonOrOrganization[] = [];
  maintainer: PersonOrOrganization[] = [];
  continuousIntegration: string = "";
  issueTracker: string = "";
  relatedLink: string[] = [];
  programmingLanguage: string[] = [];
  runtimePlatform: string[] = [];
  operatingSystem: string[] = [];
  otherSoftwareRequirements: string[] = [];
  versionNumber: string = "";
  releaseDate: string = "";
  modifiedDate: string = "";
  downloadUrl: string = "";
  releaseNotes: string = "";
  referencePublication: string = "";
  reviewAspect: string = "";
  reviewBody: string = "";
  developmentStatus: string = "";
  isSourceCodeOf: string = "";
  isPartOf: string = "";

  toObject(): object {
    return {
      "@context": this.atContext,
      "type": this.type,
      applicationCategory: this.applicationCategory,
      author: this.author,
      codeRepository: this.codeRepository,
      contributor: this.contributor,
      maintainer: this.maintainer,
      dateCreated: this.dateCreated,
      dateModified: this.dateModified,
      description: this.description,
      funder: this.funder,
      funding: this.funding,
      keywords: this.keywords,
      name: this.name,
      operatingSystem: this.operatingSystem,
      programmingLanguage: this.programmingLanguage,
      relatedLink: this.relatedLink,
      runtimePlatform: this.runtimePlatform,
      otherSoftwareRequirements: this.otherSoftwareRequirements,
      version: this.version,
      developmentStatus: this.developmentStatus,
      issueTracker: this.issueTracker,
      downloadUrl: this.downloadUrl,
      releaseNotes: this.releaseNotes,
      referencePublication: this.referencePublication,
      isSourceCodeOf: this.isSourceCodeOf,
      isPartOf: this.isPartOf,
    };
  }

  fromObject(obj: { [key: string]: any }): boolean {
    //FIXME: need to handle prior codemeta version import
    this.atContext = (obj["@context"] === undefined)
      ? "https://doi.org/10.5063/schema/codemeta-2.0"
      : obj["@context"];
    this.type = (obj["type"] === undefined) ? "" : obj["type"];
    this.applicationCategory = (obj["applicationCategory"] === undefined)
      ? ""
      : obj["applicationCategory"];
    if (obj["author"] === undefined) {
      this.author = [];
    } else {
      //FIXME: if this is NOT an array I need to write code to handle it here.
      const oType = Object.prototype.toString.call(obj["author"]); 
      this.author = normalizePersonOrOrgList(obj['author']);
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
      this.otherSoftwareRequirements = [];
    } else {
      if (typeof (obj["softwareRequirements"]) === "string") {
        this.otherSoftwareRequirements = [];
        this.otherSoftwareRequirements.push(obj["softwareRequirements"]);
      } else {
        this.otherSoftwareRequirements = obj["softwareRequirements"];
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
    this.referencePublication = (obj["referencePublication"] === undefined)
      ? ""
      : obj["referencePublication"];
    this.isSourceCodeOf = (obj["isSourceCodeOf"] === undefined)
      ? ""
      : obj["isSourceCodeOf"];
    this.isPartOf = (obj["isPartOf"] === undefined) ? "" : obj["isPartOf"];
    return true;
  }
}
