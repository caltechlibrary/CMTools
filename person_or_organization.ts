export interface PersonOrOrganizationInterface {
    fromObject(obj: object): boolean;
    toObject(): object;
}

export class PersonOrOrganization implements PersonOrOrganizationInterface {
    // ORCID is use for person id
    id: string = '';
    type: string = '';
    
    // Name is used by organizations
    name: string = '';
    // Given/Family are used by individual persons
    givenName: string = '';
    familyName: string = '';
    affiliation: PersonOrOrganization | undefined;
    email: string = '';

    toObject(): object {
        return {
            id: this.id,
            type: this.type,
            name: this.name,
            givenName: this.givenName,
            familyName: this.familyName,
            affiliation: this.affiliation,
            email: this.email
        };
    }

    fromObject(obj: {[key: string]: any}): boolean {
        this.id = (obj['id'] === undefined) ? '': obj['id'];
        this.type = (obj['type'] === undefined) ? '': obj['type'];
        this.name = (obj['name'] === undefined) ? '': obj['name'];
        this.givenName = (obj['givenName'] === undefined) ? '': obj['givenName'];
        this.familyName = (obj['familyName'] === undefined) ? '': obj['familyName'];
        this.affiliation = (obj['affiliation'] === undefined) ? undefined : obj['affiliation'];
        this.email = (obj['email'] === undefined) ? '': obj['email'];
        return true;
    }
}