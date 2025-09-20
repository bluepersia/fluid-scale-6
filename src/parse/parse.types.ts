import { StyleRuleClone } from "./cloner/cloner.types";

type CSSParseResult = {
  breakpoints: number[];
};

type RuleBatch = {
  rules: StyleRuleClone[];
  width: number;
  isMediaQuery: boolean;
};

type RuleBatchState = {
  currentRuleBatch: RuleBatch | null;
  ruleBatches: RuleBatch[];
};

export { CSSParseResult, RuleBatch, RuleBatchState };
