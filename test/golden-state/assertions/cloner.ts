import { expect } from "vitest";
import { Master } from "../eau-de-parfum/master/master";
import { DocumentClone } from "../../../src/cloner.types";
import { DefaultAssertions } from "./index.types";

const cloneDocumentAssertions: DefaultAssertions<Document, DocumentClone> = {
  "should clone document": ({ master, result }) => {
    expect(result).toEqual(master!.docClone);
  },
};

const cloneDocumentAssertionChain = {
  cloneDocument: cloneDocumentAssertions,
};

function wrapCloneDocument(
  cloneDocument: (document: Document) => DocumentClone
) {
  return (doc: Document, master: Master) => {
    const result = cloneDocument(doc);
    (window as any).assertionResponses.push({
      master,
      result,
      name: "cloneDocument",
    });
    return { master, result, name: "cloneDocument" };
  };
}

export {
  cloneDocumentAssertions,
  wrapCloneDocument,
  cloneDocumentAssertionChain,
};
