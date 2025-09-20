/* We convert the CSSOM to a JSON object that can be tested outside of playwright*/

import {
  DocumentClone,
  MediaRuleClone,
  RuleClone,
  StyleRuleClone,
  StyleSheetClone,
} from "./cloner.types";

const FLUID_PROPERTY_NAMES = new Set<string>([
  "font-size",
  "line-height",
  "letter-spacing",
  "word-spacing",
  "text-indent",
  "width",
  "min-width",
  "max-width",
  "height",
  "min-height",
  "max-height",
  "grid-template-columns",
  "grid-template-rows",
  "background-position-x",
  "background-position-y",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
  "border-top-left-radius",
  "border-top-right-radius",
  "border-bottom-right-radius",
  "border-bottom-left-radius",
  "column-gap",
  "row-gap",
  "--fluid-bg-size",
  "top",
  "left",
  "right",
  "bottom",
  "object-position",
]);
function cloneDocument(doc: Document): DocumentClone {
  const docClone: DocumentClone = {
    styleSheets: [],
  };

  for (const sheet of filterAccessibleStyleSheets(doc.styleSheets)) {
    docClone.styleSheets.push(cloneStyleSheet(sheet));
  }

  return docClone;
}

function filterAccessibleStyleSheets(
  styleSheets: StyleSheetList
): CSSStyleSheet[] {
  return Array.from(styleSheets).filter((styleSheet) => {
    try {
      const rules = styleSheet.cssRules;
      return rules ? true : false;
    } catch (error) {
      return false;
    }
  });
}

function cloneStyleSheet(sheet: CSSStyleSheet): StyleSheetClone {
  const sheetClone: StyleSheetClone = {
    cssRules: [],
  };

  for (const rule of Array.from(sheet.cssRules)) {
    const ruleClone = cloneRule(rule);
    if (ruleClone) sheetClone.cssRules.push(ruleClone);
  }

  return sheetClone;
}

function cloneRule(rule: CSSRule): RuleClone | null {
  if (rule.type === 1) return cloneStyleRule(rule as CSSStyleRule);
  if (rule.type === 4) {
    const mediaRule = cloneMediaRule(rule as CSSMediaRule);
    if (mediaRule) return mediaRule;
  }
  return null;
}

function cloneStyleRule(rule: CSSStyleRule): StyleRuleClone {
  const style: Record<string, string> = {};

  for (let i = 0; i < rule.style.length; i++) {
    const property = rule.style.item(i);
    if (FLUID_PROPERTY_NAMES.has(property)) {
      style[property] = rule.style.getPropertyValue(property);
    }
  }
  return {
    type: 1,
    style,
    specialProps: {},
    selectorText: rule.selectorText,
  };
}

function cloneMediaRule(rule: CSSMediaRule): MediaRuleClone | null {
  // Regex explanation: matches (min-width: <number>px)
  const match = rule.media.mediaText.match(/\(min-width:\s*(\d+)px\)/);

  if (match) {
    return {
      type: 4,
      minWidth: Number(match[1]),
      cssRules: Array.from(rule.cssRules).map((rule) =>
        cloneStyleRule(rule as CSSStyleRule)
      ),
    };
  }
  return null;
}

export { cloneDocument };
