import {
  MediaRuleClone,
  StyleRuleClone,
} from "../../../../src/parse/cloner/cloner.types";
import docClone from "./docClone";

const batchedDoc = {
  styleSheets: [
    {
      batches: [
        {
          isMediaQuery: false,
          width: 375,
          rules: docClone.styleSheets[0].cssRules.filter(
            (rule) => rule.type === 1
          ) as StyleRuleClone[],
        },
      ],
    },
    {
      batches: [
        {
          isMediaQuery: false,
          width: 375,
          rules: docClone.styleSheets[1].cssRules as StyleRuleClone[],
        },
      ],
    },
    {
      batches: [
        {
          isMediaQuery: false,
          width: 375,
          rules: docClone.styleSheets[2].cssRules.filter(
            (rule) => rule.type === 1
          ) as StyleRuleClone[],
        },
        {
          isMediaQuery: true,
          width: 600,
          rules: (
            docClone.styleSheets[2].cssRules.find(
              (rule) =>
                rule.type === 4 && (rule as MediaRuleClone).minWidth === 600
            ) as MediaRuleClone
          ).cssRules as StyleRuleClone[],
        },
      ],
    },
  ],
};

export default batchedDoc;
