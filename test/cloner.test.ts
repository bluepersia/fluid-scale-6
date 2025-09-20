import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { initPlaywrightPages, teardownPlaywrightPages } from "./setup";
import { PlaywrightPage } from "./index.types";
import { cloneDocumentAssertionChain } from "./golden-state/assertions/cloner";
import masterProject1 from "./golden-state/eau-de-parfum/master/master";

let playwrightPages: PlaywrightPage[] = [];
const masters = [masterProject1].map((master, index) => ({
  master,
  index,
}));

beforeAll(async () => {
  playwrightPages = await initPlaywrightPages();
});

afterAll(async () => {
  await teardownPlaywrightPages(playwrightPages);
});

describe("clone document", () => {
  test.each(masters)("should clone document", async ({ master, index }) => {
    const page = playwrightPages[index].page;
    const assertionResponses = await page.evaluate((master) => {
      // @ts-expect-error global from IIFE bundle
      window.assertionResponses = [];
      // @ts-expect-error global from IIFE bundle
      window.cloneDocument(document, master);

      // @ts-expect-error global from IIFE bundle
      return window.assertionResponses;
    }, master);

    for (const res of assertionResponses) {
      const assertions = cloneDocumentAssertionChain[res.name];
      for (const assertion of Object.values(assertions)) {
        (assertion as (data: typeof res) => void)(res);
      }
    }
  });
});
