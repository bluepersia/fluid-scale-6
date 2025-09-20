import * as cloner from "../src/parse/cloner/cloner";
import * as clonerAssertions from "../test/golden-state/assertions/cloner";
import {
  resetResponses,
  getResponses,
} from "../test/golden-state/assertions/global";

clonerAssertions.wrapAll();

const cloneDocument = cloner.cloneDocument;
const cloneStyleSheet = cloner.cloneStyleSheet;
const clonerWrapReset = clonerAssertions.resetWrapState;

export {
  cloneDocument,
  cloneStyleSheet,
  clonerWrapReset,
  resetResponses,
  getResponses,
};
