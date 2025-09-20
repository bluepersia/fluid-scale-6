import {
  StyleRuleClone,
  MediaRuleClone,
} from "../../../src/parse/cloner/cloner.types";
import { DocumentClone } from "../../../src/parse/cloner/cloner.types";

function findStyleRuleByAbsIndex(
  docClone: DocumentClone,
  index: number
): StyleRuleClone {
  let currIndex = 0;
  for (const sheet of docClone.styleSheets) {
    for (const rule of sheet.cssRules) {
      if (rule.type === 1) {
        if (currIndex === index) {
          return rule as StyleRuleClone;
        }
        currIndex++;
      } else if (rule.type === 4) {
        const mediaRule = rule as MediaRuleClone;
        for (const subRule of mediaRule.cssRules) {
          if (currIndex === index) return subRule;
          currIndex++;
        }
      }
    }
  }
  throw new Error(`Rule with index ${index} not found`);
}

function findMediaRuleByAbsIndex(
  docClone: DocumentClone,
  index: number
): MediaRuleClone {
  let currIndex = 0;
  for (const sheet of docClone.styleSheets) {
    for (const rule of sheet.cssRules) {
      if (rule.type === 4) {
        if (currIndex === index) return rule as MediaRuleClone;
        currIndex++;
      }
    }
  }
  throw new Error(`Media rule with index ${index} not found`);
}

export { findStyleRuleByAbsIndex, findMediaRuleByAbsIndex };
