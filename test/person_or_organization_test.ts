import { assertEquals } from "@std/assert";
import {
  normalizePersonOrOrgList,
  PersonOrOrganization,
} from "../src/person_or_organization.ts";

Deno.test("test normalizePersonOrOrgLits()", function () {
  const s = "R. S. Doiel";
  const l: PersonOrOrganization[] = [];
  const o: PersonOrOrganization = new PersonOrOrganization();
  o.type = "Person";
  o.name = s;
  l.push(o);

  // Now that we have the three likely forms for a author, contributor or maintainer
  // let's see if normalize works.
  let result: PersonOrOrganization[] = normalizePersonOrOrgList(s);
  assertEquals(
    result.length,
    1,
    `for '${s} of type ${
      Object.prototype.toString.call(s)
    }, should have list with length 1`,
  );
});
