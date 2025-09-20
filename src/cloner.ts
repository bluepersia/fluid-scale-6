/* We convert the CSSOM to a JSON object that can be tested outside of playwright*/

import {
  DocumentClone,
  MediaRuleClone,
  RuleClone,
  StyleRuleClone,
  StyleSheetClone,
} from "./cloner.types";

const FLUID_PROPERTY_NAMES = new Set<string>([
  "fontSize",
  "lineHeight",
  "letterSpacing",
  "wordSpacing",
  "textIndent",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  "borderTopWidth",
  "borderRightWidth",
  "borderBottomWidth",
  "borderLeftWidth",
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderBottomRightRadius",
  "borderBottomLeftRadius",
  "width",
  "minWidth",
  "maxWidth",
  "height",
  "minHeight",
  "maxHeight",
  "gridTemplateColumns",
  "gridTemplateRows",
  "backgroundPositionX",
  "backgroundPositionY",
  "--fluid-bg-size",
  "top",
  "left",
  "right",
  "bottom",
  "columnGap",
  "rowGap",
]);

function cloneDocument(doc: Document): DocumentClone {
  const docClone: DocumentClone = {
    styleSheets: [],
  };

  for (const sheet of Array.from(doc.styleSheets)) {
    docClone.styleSheets.push(cloneStyleSheet(sheet));
  }

  return docClone;
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
