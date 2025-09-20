/* We convert the CSSOM to a JSON object that can be tested outside of playwright*/

import {
  DocumentClone,
  MediaRuleClone,
  RuleClone,
  StyleRuleClone,
  StyleSheetClone,
} from "./cloner.types";

const FLUID_PROPERTY_NAMES = [
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
];

const SHORTHAND_PROPERTIES: {
  [shorthand: string]: Map<number, Map<number, string[]>>;
} = {
  padding: new Map([
    [
      1,
      new Map([
        [0, ["padding-top", "padding-right", "padding-bottom", "padding-left"]],
      ]),
    ],
    [
      2,
      new Map([
        [0, ["padding-top", "padding-bottom"]],
        [1, ["padding-right", "padding-left"]],
      ]),
    ],
    [
      3,
      new Map([
        [0, ["padding-top"]],
        [1, ["padding-right", "padding-left"]],
        [2, ["padding-bottom"]],
      ]),
    ],
    [
      4,
      new Map([
        [0, ["padding-top"]],
        [1, ["padding-right"]],
        [2, ["padding-bottom"]],
        [3, ["padding-left"]],
      ]),
    ],
  ]),
  margin: new Map([
    [
      1,
      new Map([
        [0, ["margin-top", "margin-right", "margin-bottom", "margin-left"]],
      ]),
    ],
    [
      2,
      new Map([
        [0, ["margin-top", "margin-bottom"]],
        [1, ["margin-right", "margin-left"]],
      ]),
    ],
    [
      3,
      new Map([
        [0, ["margin-top"]],
        [1, ["margin-right", "margin-left"]],
        [2, ["margin-bottom"]],
      ]),
    ],
    [
      4,
      new Map([
        [0, ["margin-top"]],
        [1, ["margin-right"]],
        [2, ["margin-bottom"]],
        [3, ["margin-left"]],
      ]),
    ],
  ]),
  "border-radius": new Map([
    [
      1,
      new Map([
        [
          0,
          [
            "border-top-left-radius",
            "border-top-right-radius",
            "border-bottom-right-radius",
            "border-bottom-left-radius",
          ],
        ],
      ]),
    ],
    [
      2,
      new Map([
        [0, ["border-top-left-radius", "border-bottom-right-radius"]],
        [1, ["border-top-right-radius", "border-bottom-left-radius"]],
      ]),
    ],
    [
      3,
      new Map([
        [0, ["border-top-left-radius"]],
        [1, ["border-top-right-radius", "border-bottom-left-radius"]],
        [2, ["border-bottom-right-radius"]],
      ]),
    ],
    [
      4,
      new Map([
        [0, ["border-top-left-radius"]],
        [1, ["border-top-right-radius"]],
        [2, ["border-bottom-right-radius"]],
        [3, ["border-bottom-left-radius"]],
      ]),
    ],
  ]),
  gap: new Map([[1, new Map([[0, ["column-gap", "row-gap"]]])]]),
  "background-position": new Map([
    [2, new Map([[0, ["background-position-x", "background-position-y"]]])],
  ]),
};

const explicitProps = new Map<string, string>([
  ["padding-top", "padding"],
  ["padding-right", "padding"],
  ["padding-bottom", "padding"],
  ["padding-left", "padding"],
  ["margin-top", "margin"],
  ["margin-right", "margin"],
  ["margin-bottom", "margin"],
  ["margin-left", "margin"],
  ["border-top-left-radius", "border-radius"],
  ["border-top-right-radius", "border-radius"],
  ["border-bottom-right-radius", "border-radius"],
  ["border-bottom-left-radius", "border-radius"],
  ["column-gap", "gap"],
  ["row-gap", "gap"],
  ["background-position-x", "background-position"],
  ["background-position-y", "background-position"],
]);

let cloneDocument = (doc: Document): DocumentClone => {
  const docClone: DocumentClone = {
    styleSheets: [],
  };

  for (const sheet of filterAccessibleStyleSheets(doc.styleSheets)) {
    docClone.styleSheets.push(cloneStyleSheet(sheet));
  }

  return docClone;
};

let filterAccessibleStyleSheets = (
  styleSheets: StyleSheetList
): CSSStyleSheet[] => {
  return Array.from(styleSheets).filter((styleSheet) => {
    try {
      const rules = styleSheet.cssRules;
      return rules ? true : false;
    } catch (error) {
      return false;
    }
  });
};

let cloneStyleSheet = (sheet: CSSStyleSheet): StyleSheetClone => {
  const sheetClone: StyleSheetClone = {
    cssRules: [],
  };

  for (const rule of Array.from(sheet.cssRules)) {
    const ruleClone = cloneRule(rule);
    if (ruleClone) sheetClone.cssRules.push(ruleClone);
  }

  return sheetClone;
};

let cloneRule = (rule: CSSRule): RuleClone | null => {
  if (rule.type === 1) return cloneStyleRule(rule as CSSStyleRule);
  if (rule.type === 4) {
    const mediaRule = cloneMediaRule(rule as CSSMediaRule);
    if (mediaRule) return mediaRule;
  }
  return null;
};

let cloneStyleRule = (rule: CSSStyleRule): StyleRuleClone => {
  const style: Record<string, string> = {};
  let handledShorthandCache = new Map<string, Record<string, string>>();
  for (const property of FLUID_PROPERTY_NAMES) {
    const value = rule.style.getPropertyValue(property);
    if (value) style[property] = normalizeZero(value);
    else {
      if (explicitProps.has(property)) {
        const shorthandName = explicitProps.get(property)!;

        const shorthandValue = rule.style.getPropertyValue(shorthandName);

        if (!shorthandValue) continue;

        let handledShorthand = handledShorthandCache.get(shorthandName);
        if (!handledShorthand) {
          handledShorthand = handleShorthand(shorthandName, shorthandValue);
          handledShorthandCache.set(shorthandName, handledShorthand);
        }
        style[property] = handledShorthand[property];
      }
    }
  }
  return {
    type: 1,
    style,
    specialProps: {},
    selectorText: normalizeSelector(rule.selectorText),
  };
};

function normalizeZero(input: string): string {
  return input.replace(
    /(?<![\d.])0+(?:\.0+)?(?![\d.])(?!(px|em|rem|%|vh|vw|vmin|vmax|ch|ex|cm|mm|in|pt|pc)\b)/g,
    "0px"
  );
}

function normalizeSelector(selector: string): string {
  return selector
    .replace(/\*::(before|after)\b/g, "::$1")
    .replace(/\s*,\s*/g, ", ")
    .replace(/\s+/g, " ")
    .trim();
}

let cloneMediaRule = (rule: CSSMediaRule): MediaRuleClone | null => {
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
};

let handleShorthand = (
  shorthandName: string,
  shorthandValue: string
): Record<string, string> => {
  const style: Record<string, string> = {};

  let depth = 0;
  let currentValue = "";
  const values: string[] = [];

  for (const char of shorthandValue) {
    if (char === "(") depth++;
    else if (char === ")") depth--;
    else if (char === " " && depth === 0) {
      values.push(currentValue);
      currentValue = "";
    } else {
      currentValue += char;
    }
  }

  values.push(currentValue);

  const explicitData = SHORTHAND_PROPERTIES[shorthandName].get(values.length);
  if (explicitData) {
    for (const [index, explicitProps] of explicitData.entries()) {
      for (const explicitProp of explicitProps) {
        style[explicitProp] = normalizeZero(values[index]);
      }
    }
  }
  return style;
};

//---------//
//TEST WRAPPING//
//--------//
function wrap(
  cloneDocWrapped: (doc: Document) => DocumentClone,
  cloneStyleSheetWrapped: (sheet: CSSStyleSheet) => StyleSheetClone,
  cloneRuleWrapped: (rule: CSSRule) => RuleClone | null,
  cloneStyleRuleWrapped: (styleRule: CSSStyleRule) => StyleRuleClone,
  cloneMediaRuleWrapped: (mediaRule: CSSMediaRule) => MediaRuleClone | null,
  handleShorthandWrapped: (
    shorthandName: string,
    shorthandValue: string
  ) => Record<string, string>
) {
  cloneDocument = cloneDocWrapped;
  cloneStyleSheet = cloneStyleSheetWrapped;
  cloneRule = cloneRuleWrapped;
  cloneStyleRule = cloneStyleRuleWrapped;
  cloneMediaRule = cloneMediaRuleWrapped;
  handleShorthand = handleShorthandWrapped;
}

export {
  cloneDocument,
  cloneStyleSheet,
  cloneRule,
  cloneStyleRule,
  cloneMediaRule,
  handleShorthand,
  normalizeZero,
  normalizeSelector,
  wrap,
};
