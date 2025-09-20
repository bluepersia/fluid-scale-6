import * as cloner from "../src/cloner";
import * as clonerAssertions from "../test/golden-state/assertions/cloner";

clonerAssertions.wrapAll();

const cloneDocument = cloner.cloneDocument;
const cloneStyleSheet = cloner.cloneStyleSheet;
const clonerWrapReset = clonerAssertions.resetWrapState;

export { cloneDocument, cloneStyleSheet, clonerWrapReset };
