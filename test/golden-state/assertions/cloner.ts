import { expect } from "vitest";
import { Master } from "../../index.types";
import {
  DocumentClone,
  MediaRuleClone,
  RuleClone,
  StyleRuleClone,
  StyleSheetClone,
} from "../../../src/parse/cloner/cloner.types";
import { DefaultAssertions } from "./index.types";
import {
  wrap,
  cloneDocument,
  cloneStyleSheet,
  cloneRule,
  cloneStyleRule,
  cloneMediaRule,
  handleShorthand,
} from "../../../src/parse/cloner/cloner";
import { findMediaRuleByAbsIndex, findStyleRuleByAbsIndex } from "./docClone";
import { getResponses } from "./global";

type State = {
  sheetIndex: number;
  ruleIndex: number;
  absStyleRuleIndex: number;
  absMediaRuleIndex: number;
  master: Master;
};

const cloneDocumentAssertions: DefaultAssertions<
  Document,
  DocumentClone,
  State
> = {
  "should clone document": ({ state, result }) => {
    expect(result).toEqual(state!.master!.docClone);
  },
};

const cloneStyleSheetAssertions: DefaultAssertions<
  CSSStyleSheet,
  StyleSheetClone,
  State
> = {
  "should clone style sheet": ({ result, state }) => {
    expect(result).toEqual(
      state!.master.docClone.styleSheets[state!.sheetIndex]
    );
  },
};

const cloneRuleAssertions: DefaultAssertions<CSSRule, RuleClone, State> = {
  "should clone rule": ({ result, state }) => {
    expect(result).toEqual(
      state!.master!.docClone.styleSheets[state!.sheetIndex].cssRules[
        state!.ruleIndex
      ]
    );
  },
};

const cloneStyleRuleAssertions: DefaultAssertions<CSSRule, RuleClone, State> = {
  "should clone style rule": ({ result, state }) => {
    expect(result).toEqual(
      findStyleRuleByAbsIndex(state!.master.docClone, state!.absStyleRuleIndex)
    );
  },
};

const cloneMediaRuleAssertions: DefaultAssertions<CSSRule, RuleClone, State> = {
  "should clone media rule": ({ result, state }) => {
    expect(result).toEqual(
      findMediaRuleByAbsIndex(state!.master.docClone, state!.absMediaRuleIndex)
    );
  },
};

const handleShorthandAssertions: DefaultAssertions<
  string,
  Record<string, string>,
  State
> = {
  "should handle shorthand": ({ result, state }) => {
    expect(
      findStyleRuleByAbsIndex(state!.master.docClone, state!.absStyleRuleIndex)
        .style
    ).toMatchObject(result!);
  },
};

const cloneDocumentAssertionChain = {
  cloneDocument: cloneDocumentAssertions,
  cloneStyleSheet: cloneStyleSheetAssertions,
  cloneRule: cloneRuleAssertions,
  cloneStyleRule: cloneStyleRuleAssertions,
  cloneMediaRule: cloneMediaRuleAssertions,
  handleShorthand: handleShorthandAssertions,
};
type CloneDocumentAssertionName = keyof typeof cloneDocumentAssertionChain;
//
//TEST WRAPPERS
//--------------------------------------------

function wrapAll() {
  wrap(
    wrapCloneDocument(cloneDocument),
    wrapCloneStyleSheet(cloneStyleSheet),
    wrapCloneRule(cloneRule),
    wrapCloneStyleRule(cloneStyleRule),
    wrapCloneMediaRule(cloneMediaRule),
    wrapHandleShorthand(handleShorthand)
  );
}

let wrapState = newWrapState();

function newWrapState() {
  return {
    sheetIndex: 0,
    ruleIndex: 0,
    absStyleRuleIndex: 0,
    absMediaRuleIndex: 0,
    master: null as Master | null,
  };
}
function resetWrapState(master: Master) {
  wrapState = newWrapState();
  wrapState.master = master;
}
function wrapCloneDocument(
  cloneDocument: (document: Document) => DocumentClone
) {
  return (doc: Document) => {
    wrapState.sheetIndex = 0;
    const result = cloneDocument(doc);
    getResponses().push({
      state: { ...wrapState },
      result,
      name: "cloneDocument",
    });
    return result;
  };
}

function wrapCloneStyleSheet(
  cloneStyleSheet: (styleSheet: CSSStyleSheet) => StyleSheetClone
) {
  return (styleSheet: CSSStyleSheet) => {
    wrapState.ruleIndex = 0;
    const result = cloneStyleSheet(styleSheet);
    getResponses().push({
      state: { ...wrapState },
      result,
      name: "cloneStyleSheet",
    });

    wrapState.sheetIndex++;
    return result;
  };
}

function wrapCloneRule(cloneRule: (rule: CSSRule) => RuleClone | null) {
  return (rule: CSSRule) => {
    const result = cloneRule(rule);
    getResponses().push({
      state: { ...wrapState },
      result,
      name: "cloneRule",
    });
    wrapState.ruleIndex++;
    return result;
  };
}

function wrapCloneStyleRule(
  cloneStyleRule: (styleRule: CSSStyleRule) => StyleRuleClone
) {
  return (styleRule: CSSStyleRule) => {
    const result = cloneStyleRule(styleRule);
    getResponses().push({
      state: { ...wrapState },
      result,
      name: "cloneStyleRule",
    });
    wrapState.absStyleRuleIndex++;
    return result;
  };
}

function wrapCloneMediaRule(
  cloneMediaRule: (mediaRule: CSSMediaRule) => MediaRuleClone | null
) {
  return (mediaRule: CSSMediaRule) => {
    const result = cloneMediaRule(mediaRule);
    getResponses().push({
      state: { ...wrapState },
      result,
      name: "cloneMediaRule",
    });
    wrapState.absMediaRuleIndex++;
    return result;
  };
}

function wrapHandleShorthand(
  handleShorthand: (
    shorthandName: string,
    shorthandValue: string
  ) => Record<string, string>
) {
  return (shorthandName: string, shorthandValue: string) => {
    const result = handleShorthand(shorthandName, shorthandValue);
    getResponses().push({
      state: { ...wrapState },
      result,
      name: "handleShorthand",
    });
    return result;
  };
}

export {
  cloneDocumentAssertions,
  cloneDocumentAssertionChain,
  wrapAll,
  resetWrapState,
  CloneDocumentAssertionName,
};
