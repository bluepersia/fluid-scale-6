import { describe, test, expect } from "vitest";
import { parseCSS } from "../../src/parse/parse";
import { CSSParseResult } from "../../src/parse/parse.types";
import { DocumentClone } from "../../src/parse/cloner/cloner.types";
import masterProject1 from "../golden-state/eau-de-parfum/master/master";
import * as parseAssertions from "../golden-state/assertions/parse";
import {
  ParseCSSAssertionName,
  parseCSSAssertionChain,
} from "../golden-state/assertions/parse";
import {
  getResponses,
  resetResponses,
} from "../golden-state/assertions/global";
const masters = [masterProject1];
describe("parseCSS", () => {
  test.each(masters)("should parse CSS", (master) => {
    parseAssertions.resetWrapState(master);

    resetResponses();

    parseCSS(master.docClone);

    const responses = getResponses();

    for (const res of responses) {
      const assertions =
        parseCSSAssertionChain[res.name as ParseCSSAssertionName];
      for (const assertion of Object.values(assertions)) {
        assertion(res);
      }
    }
  });
});
