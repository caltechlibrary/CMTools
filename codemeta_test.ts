
import { assertEquals, assertNotEquals } from '@std/assert';
import { CodeMeta } from './codemeta.ts';
import { validateROR, validateORCID } from 'https://caltechlibrary.github.io/metadatatools/mod.ts';

Deno.test('test fromObject', async function() {
	const src: string = await Deno.readTextFile("./codemeta.json");
	let obj = JSON.parse(src);
	let cm = new CodeMeta();
	assertNotEquals(obj['name'], undefined);
	assertEquals(cm.fromObject(obj), true, "expected fromObject to return true");
	let expected = "CMTools";
	assertEquals(cm.name, expected, `expected "cmtools", got "${cm.name}" -> ${src}`);
	assertEquals(cm.description, obj['description']);
	assertEquals(cm.developmentStatus, obj['developmentStatus']);
	assertEquals(cm.author.length, 1);
	let author = cm.author[0];
	assertEquals(validateORCID(author.id),true);
	assertNotEquals(author.affiliation, undefined);
	if (author.affiliation !== undefined) {
		let affiliation = author.affiliation;
		assertNotEquals(affiliation.id, undefined);
		let ror = affiliation.id;
		assertEquals(ror, "https://ror.org/05dxps055");
		assertEquals(validateROR(ror), true);
	}
	assertEquals(author.type, "Person");
	assertEquals(author.id, "https://orcid.org/0000-0003-0900-6903");
});
