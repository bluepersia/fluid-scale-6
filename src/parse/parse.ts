import {
  DocumentClone,
  MediaRuleClone,
  RuleClone,
  StyleRuleClone,
  StyleSheetClone,
} from "./cloner/cloner.types";
import { CSSParseResult, RuleBatch, RuleBatchState } from "./parse.types";

/* We need to parse the CSS and return data to feed to the engine of the fluid interpolator.
We will start by initializing the main state: breakpoints and global baseline width. 
Global baseline width allows users to define one baseline width for the entire project.
Empty media queries are useless, so we will use these as baseline-indicators.
*/

let parseCSS = (doc: DocumentClone): CSSParseResult => {
  const sheets = Array.from(doc.styleSheets);
  const { breakpoints, globalBaselineWidth } = initDoc(sheets);

  parseStyleSheets(sheets, globalBaselineWidth);

  return {
    breakpoints,
  };
};

let initDoc = (sheets: StyleSheetClone[]) => {
  const breakpointsSet: Set<number> = new Set();
  let globalBaselineWidth: number = 375;

  for (const sheet of sheets) {
    for (const rule of sheet.cssRules) {
      if (rule.type === 4) {
        const mediaRule = rule as MediaRuleClone;
        breakpointsSet.add(mediaRule.minWidth);

        if (mediaRule.cssRules.length === 0) {
          globalBaselineWidth = mediaRule.minWidth;
        }
      }
    }
  }

  return {
    breakpoints: Array.from(breakpointsSet),
    globalBaselineWidth,
  };
};

let parseStyleSheets = (
  sheets: StyleSheetClone[],
  globalBaselineWidth: number
) => {
  for (const sheet of sheets) {
    parseStyleSheet(sheet, globalBaselineWidth);
  }
};

let parseStyleSheet = (sheet: StyleSheetClone, globalBaselineWidth: number) => {
  batchStyleSheet(sheet.cssRules, globalBaselineWidth);
};

let batchStyleSheet = (
  cssRules: RuleClone[],
  globalBaselineWidth: number
): RuleBatch[] => {
  let batchState: RuleBatchState = {
    currentRuleBatch: null,
    ruleBatches: [],
  };

  const baselineMediaRule = cssRules.find(
    (rule) => rule.type === 4 && (rule as MediaRuleClone).cssRules.length === 0
  ) as MediaRuleClone;

  const baselineWidth = baselineMediaRule
    ? baselineMediaRule.minWidth
    : globalBaselineWidth;

  for (const rule of cssRules) {
    batchState = batchRule(rule, batchState, baselineWidth);
  }
  return batchState.ruleBatches;
};

let batchRule = (
  rule: RuleClone,
  batchState: RuleBatchState,
  baselineWidth: number
): RuleBatchState => {
  if (rule.type === 1) {
    return batchStyleRule(rule as StyleRuleClone, batchState, baselineWidth);
  } else {
    return batchMediaRule(rule as MediaRuleClone, batchState);
  }
};

let batchStyleRule = (
  rule: StyleRuleClone,
  batchState: RuleBatchState,
  baselineWidth: number
): RuleBatchState => {
  const newBatchState: RuleBatchState = {
    ...batchState,
  };
  newBatchState.ruleBatches = [...batchState.ruleBatches];

  if (newBatchState.currentRuleBatch === null) {
    newBatchState.currentRuleBatch = {
      rules: [],
      width: baselineWidth,
      isMediaQuery: false,
    };

    newBatchState.ruleBatches.push(newBatchState.currentRuleBatch);
  }
  newBatchState.currentRuleBatch.rules.push(rule);
  newBatchState.ruleBatches[newBatchState.ruleBatches.length - 1] =
    newBatchState.currentRuleBatch;

  return newBatchState;
};

let batchMediaRule = (
  rule: MediaRuleClone,
  batchState: RuleBatchState
): RuleBatchState => {
  if (rule.cssRules.length === 0) {
    return batchState;
  }
  const newBatchState: RuleBatchState = { ...batchState };
  newBatchState.currentRuleBatch = null;
  newBatchState.ruleBatches = [...batchState.ruleBatches];
  newBatchState.ruleBatches.push({
    rules: rule.cssRules,
    width: rule.minWidth,
    isMediaQuery: true,
  });
  return newBatchState;
};

//---------//
//TEST WRAPPING//
//--------//
function wrap(
  parseCSSWrapped: (doc: DocumentClone) => CSSParseResult,
  initDocWrapped: (sheets: StyleSheetClone[]) => {
    breakpoints: number[];
    globalBaselineWidth: number;
  },
  parseStyleSheetWrapped: (
    sheet: StyleSheetClone,
    globalBaselineWidth: number
  ) => void,
  batchStyleSheetWrapped: (
    cssRules: RuleClone[],
    globalBaselineWidth: number
  ) => RuleBatch[],
  batchRuleWrapped: (
    rule: RuleClone,
    batchState: RuleBatchState,
    baselineWidth: number
  ) => RuleBatchState,
  batchStyleRuleWrapped: (
    rule: StyleRuleClone,
    batchState: RuleBatchState,
    baselineWidth: number
  ) => RuleBatchState,
  batchMediaRuleWrapped: (
    rule: MediaRuleClone,
    batchState: RuleBatchState
  ) => RuleBatchState
) {
  parseCSS = parseCSSWrapped;
  initDoc = initDocWrapped;
  parseStyleSheet = parseStyleSheetWrapped;
  batchStyleSheet = batchStyleSheetWrapped;
  batchRule = batchRuleWrapped;
  batchStyleRule = batchStyleRuleWrapped;
  batchMediaRule = batchMediaRuleWrapped;
}

export {
  parseCSS,
  initDoc,
  wrap,
  batchRule,
  parseStyleSheet,
  batchStyleRule,
  batchMediaRule,
  batchStyleSheet,
};
