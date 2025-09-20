import { cloneDocument as cloneDocumentOriginal } from "./src/cloner";
import * as clonerAssertions from "./test/golden-state/assertions/cloner";

const cloneDocument = clonerAssertions.wrapCloneDocument(cloneDocumentOriginal);

export { cloneDocument };
