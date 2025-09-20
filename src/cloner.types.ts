type DocumentClone = {
  styleSheets: StyleSheetClone[];
};

type StyleSheetClone = {
  cssRules: RuleClone[];
};

type RuleClone = {
  type: 1 | 4;
};

type StyleRuleClone = RuleClone & {
  type: 1;
  style: Record<string, string>;
  specialProps: Record<string, string>;
  selectorText: string;
};

type MediaRuleClone = RuleClone & {
  type: 4;
  minWidth: number;
  cssRules: StyleRuleClone[];
};

export type {
  DocumentClone,
  StyleSheetClone,
  RuleClone,
  StyleRuleClone,
  MediaRuleClone,
};
