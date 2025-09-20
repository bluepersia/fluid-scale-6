import { expect } from "vitest";
import { Master } from "../../index.types";
import { DefaultAssertions } from "./index.types";
import {
  batchRule,
  batchStyleRule,
  batchMediaRule,
  initDoc,
  parseStyleSheet,
  wrap,
  batchStyleSheet,
} from "../../../src/parse/parse";
import { getResponses } from "./global";
import {
  CSSParseResult,
  RuleBatch,
  RuleBatchState,
} from "../../../src/parse/parse.types";
import { parseCSS } from "../../../src/parse/parse";
import {
  DocumentClone,
  MediaRuleClone,
  RuleClone,
  StyleRuleClone,
  StyleSheetClone,
} from "../../../src/parse/cloner/cloner.types";
type State = {
  master: Master;
  sheetIndex: number;
  batchRuleIndex: number;
  extra: any;
};

const parseCSSAssertions: DefaultAssertions<
  DocumentClone,
  CSSParseResult,
  State
> = {
  "should parse the CSS of the doc clone": ({ state, result }) => {
    expect(result!.breakpoints).toEqual(state!.master.breakpoints);
  },
};

const initDocAssertions: DefaultAssertions<
  StyleSheetClone[],
  { breakpoints: number[]; globalBaselineWidth: number },
  State
> = {
  "should initialize the doc": ({ state, result }) => {
    expect(result!.breakpoints).toEqual(state!.master.breakpoints);
    expect(result!.globalBaselineWidth).toEqual(
      state!.master.globalBaselineWidth
    );
  },
};

const batchStyleSheetAssertions: DefaultAssertions<
  RuleClone[],
  RuleBatch[],
  State
> = {
  "should batch the style sheet": ({ state, result }) => {
    expect(result).toEqual(
      state!.master.batchedDoc.styleSheets[state!.sheetIndex].batches
    );
  },
};

const batchRuleAssertions: DefaultAssertions<RuleClone, RuleBatchState, State> =
  {
    "should batch the rule": ({ state, result }) => {
      const batchIndex = result!.ruleBatches.length - 1;
      expect(
        state!.master.batchedDoc.styleSheets[state!.sheetIndex].batches[
          batchIndex
        ].rules
      ).toEqual(expect.arrayContaining(result!.ruleBatches[batchIndex].rules));
    },
  };

const batchStyleRuleAssertions: DefaultAssertions<
  StyleRuleClone,
  RuleBatchState,
  State
> = {
  "should batch the style rule": ({ state, result }) => {
    const batchIndex = result!.ruleBatches.length - 1;

    const lastRuleBatch = result!.ruleBatches[batchIndex];
    expect(result!.currentRuleBatch!.isMediaQuery).toEqual(
      lastRuleBatch.isMediaQuery
    );
    expect(result!.currentRuleBatch!.width).toEqual(lastRuleBatch.width);

    expect(
      state!.master.batchedDoc.styleSheets[state!.sheetIndex].batches[
        batchIndex
      ].rules
    ).toEqual(expect.arrayContaining(lastRuleBatch.rules));
  },
};

const batchMediaRuleAssertions: DefaultAssertions<
  MediaRuleClone,
  RuleBatchState,
  State
> = {
  "should batch the media rule": ({ state, result }) => {
    const batchIndex = result!.ruleBatches.length - 1;
    const lastRuleBatch = result!.ruleBatches[batchIndex];

    const childCount = state!.extra;
    if (childCount > 0) expect(result!.currentRuleBatch).toBeNull();
    else expect(result!.currentRuleBatch).toBe(lastRuleBatch);

    expect(
      state!.master.batchedDoc.styleSheets[state!.sheetIndex].batches[
        batchIndex
      ].rules
    ).toEqual(expect.arrayContaining(lastRuleBatch.rules));
  },
};

const parseCSSAssertionChain = {
  parseCSS: parseCSSAssertions,
  initDoc: initDocAssertions,
  batchStyleSheet: batchStyleSheetAssertions,
  batchRule: batchRuleAssertions,
  batchStyleRule: batchStyleRuleAssertions,
  batchMediaRule: batchMediaRuleAssertions,
};
type ParseCSSAssertionName = keyof typeof parseCSSAssertionChain;
//
//TEST WRAPPERS
//--------------------------------------------

function wrapAll() {
  wrap(
    wrapParseCSS(parseCSS),
    wrapInitDoc(initDoc),
    wrapParseStyleSheet(parseStyleSheet),
    wrapBatchStyleSheet(batchStyleSheet),
    wrapBatchRule(batchRule),
    wrapBatchStyleRule(batchStyleRule),
    wrapBatchMediaRule(batchMediaRule)
  );
}

let wrapState = newWrapState();

function newWrapState() {
  return {
    master: null as Master | null,
    sheetIndex: 0,
    batchRuleIndex: 0,
  };
}
function resetWrapState(master: Master) {
  wrapState = newWrapState();
  wrapState.master = master;
}
function wrapParseCSS(parseCSS: (docClone: DocumentClone) => CSSParseResult) {
  return (docClone: DocumentClone) => {
    const result = parseCSS(docClone);
    getResponses().push({
      state: { ...wrapState },
      result,
      name: "parseCSS",
    });
    return result;
  };
}

function wrapInitDoc(
  initDoc: (sheets: StyleSheetClone[]) => {
    breakpoints: number[];
    globalBaselineWidth: number;
  }
) {
  return (sheets: StyleSheetClone[]) => {
    const result = initDoc(sheets);
    getResponses().push({
      state: { ...wrapState },
      result,
      name: "initDoc",
    });
    return result;
  };
}

function wrapParseStyleSheet(
  parseStyleSheet: (sheet: StyleSheetClone, globalBaselineWidth: number) => void
) {
  return (sheet: StyleSheetClone, globalBaselineWidth: number) => {
    wrapState.batchRuleIndex = 0;
    parseStyleSheet(sheet, globalBaselineWidth);
    wrapState.sheetIndex++;
  };
}

function wrapBatchStyleSheet(
  batchStyleSheet: (
    cssRules: RuleClone[],
    globalBaselineWidth: number
  ) => RuleBatch[]
) {
  return (cssRules: RuleClone[], globalBaselineWidth: number) => {
    const result = batchStyleSheet(cssRules, globalBaselineWidth);
    getResponses().push({
      state: { ...wrapState },
      result,
      name: "batchStyleSheet",
    });
    return result;
  };
}

function wrapBatchRule(
  batchRule: (
    rule: RuleClone,
    batchState: RuleBatchState,
    baselineWidth: number
  ) => RuleBatchState
) {
  return (
    rule: RuleClone,
    batchState: RuleBatchState,
    baselineWidth: number
  ) => {
    const result = batchRule(rule, batchState, baselineWidth);
    getResponses().push({
      state: { ...wrapState },
      result,
      name: "batchRule",
    });
    wrapState.batchRuleIndex++;
    return result;
  };
}

function wrapBatchStyleRule(
  batchStyleRule: (
    rule: StyleRuleClone,
    batchState: RuleBatchState,
    baselineWidth: number
  ) => RuleBatchState
) {
  return (
    rule: StyleRuleClone,
    batchState: RuleBatchState,
    baselineWidth: number
  ) => {
    const result = batchStyleRule(rule, batchState, baselineWidth);
    getResponses().push({
      state: { ...wrapState },
      result,
      name: "batchStyleRule",
    });
    return result;
  };
}

function wrapBatchMediaRule(
  batchMediaRule: (
    rule: MediaRuleClone,
    batchState: RuleBatchState
  ) => RuleBatchState
) {
  return (rule: MediaRuleClone, batchState: RuleBatchState) => {
    const result = batchMediaRule(rule, batchState);
    getResponses().push({
      state: { ...wrapState, extra: rule.cssRules.length },
      result,
      name: "batchMediaRule",
    });
    return result;
  };
}
export {
  wrapParseCSS,
  wrapAll,
  resetWrapState,
  ParseCSSAssertionName,
  parseCSSAssertionChain,
};
