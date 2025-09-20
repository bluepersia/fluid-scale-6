import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { initPlaywrightPages, teardownPlaywrightPages } from "../setup";
import { PlaywrightPage } from "../index.types";
import {
  cloneDocumentAssertionChain,
  CloneDocumentAssertionName,
} from "../golden-state/assertions/cloner";
import masterProject1 from "../golden-state/eau-de-parfum/master/master";
import { JSDOMDocs } from "../setup";
import {
  AssertionResponse,
  getResponses,
  resetResponses,
} from "../golden-state/assertions/global";
import * as clonerAssertions from "../golden-state/assertions/cloner";
import {
  cloneDocument,
  normalizeSelector,
  normalizeZero,
} from "../../src/parse/cloner/cloner";

const JSDOMDocsWithIndex = JSDOMDocs.map((doc, index) => ({
  index: index,
  doc,
}));

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
      window.clonerWrapReset(master);
      // @ts-expect-error global from IIFE bundle
      window.resetResponses();
      // @ts-expect-error global from IIFE bundle
      window.cloneDocument(document);

      // @ts-expect-error global from IIFE bundle
      return window.getResponses() as AssertionResponse[];
    }, master);

    for (const res of assertionResponses) {
      const assertions =
        cloneDocumentAssertionChain[res.name as CloneDocumentAssertionName];
      for (const assertion of Object.values(assertions)) {
        assertion(res);
      }
    }
  });

  test.each(JSDOMDocsWithIndex)(
    "should clone JSDOM document",
    async ({ doc, index }) => {
      const { master } = masters[index];

      clonerAssertions.resetWrapState(master);

      resetResponses();

      cloneDocument(doc);

      const responses = getResponses();

      for (const res of responses) {
        const assertions =
          cloneDocumentAssertionChain[res.name as CloneDocumentAssertionName];
        for (const assertion of Object.values(assertions)) {
          assertion(res);
        }
      }
    }
  );
});

describe("normalize zero", () => {
  test("should normalize zero", () => {
    expect(normalizeZero("0")).toBe("0px");
    expect(normalizeZero("0px")).toBe("0px");
    expect(normalizeZero("0.0")).toBe("0px");
    expect(normalizeZero("0 5px")).toBe("0px 5px");
    expect(normalizeZero("0px 5px")).toBe("0px 5px");
  });

  test("should normalize zero in depth 1", () => {
    expect(normalizeZero("min(2rem, 0)")).toBe("min(2rem, 0px)");
    expect(normalizeZero("5rem 0.0 3rem")).toBe("5rem 0px 3rem");
    expect(normalizeZero("min(4rem, 0) min(3rem, 2rem)")).toBe(
      "min(4rem, 0px) min(3rem, 2rem)"
    );
  });

  test("should normalize zero in depth 2", () => {
    expect(normalizeZero("min(2rem, max(2rem, 0)) min(3rem, 2rem)")).toBe(
      "min(2rem, max(2rem, 0px)) min(3rem, 2rem)"
    );
  });

  test("should not normalize non-zero", () => {
    expect(normalizeZero("1")).toBe("1");
    expect(normalizeZero("1px")).toBe("1px");
    expect(normalizeZero("1.0")).toBe("1.0");
  });
});

describe("normalize selector", () => {
  test("should normalize selector", () => {
    expect(normalizeSelector("*::before")).toBe("::before");
    expect(normalizeSelector("*::after")).toBe("::after");
    expect(normalizeSelector("*::before,\n*::after")).toBe("::before, ::after");
  });
});
