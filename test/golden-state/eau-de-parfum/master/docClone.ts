import {
  DocumentClone,
  MediaRuleClone,
  StyleRuleClone,
} from "../../../../src/parse/cloner/cloner.types";

const docClone: DocumentClone = {
  styleSheets: [
    {
      cssRules: [
        {
          type: 1,
          style: {},
          specialProps: {},
          selectorText: ":root",
        } as StyleRuleClone,
        {
          type: 1,
          style: {
            "font-size": "14px",
          },
          specialProps: {},
          selectorText: "html",
        } as StyleRuleClone,
        {
          type: 1,
          specialProps: {},
          selectorText: "body",
          style: {
            "margin-top": "0px",
            "margin-right": "0px",
            "margin-bottom": "0px",
            "margin-left": "0px",
            "padding-top": "0px",
            "padding-right": "0px",
            "padding-bottom": "0px",
            "padding-left": "0px",
            "min-height": "100vh",
          },
        } as StyleRuleClone,
        {
          type: 1,
          style: {
            "margin-top": "0px",
            "margin-right": "0px",
            "margin-bottom": "0px",
            "margin-left": "0px",
          },
          specialProps: {},
          selectorText: "*, ::before, ::after",
        } as StyleRuleClone,
        {
          type: 1,
          specialProps: {},
          selectorText: "img",
          style: {
            "max-width": "100%",
            height: "auto",
          },
        } as StyleRuleClone,
        {
          type: 4,
          minWidth: 375,
          cssRules: [],
        } as MediaRuleClone,
      ],
    },
    {
      cssRules: [
        {
          type: 1,
          selectorText: ".u-container",
          specialProps: {},
          style: {
            "padding-top": "0px",
            "padding-right": "1.14rem",
            "padding-bottom": "0px",
            "padding-left": "1.14rem",
          },
        } as StyleRuleClone,
      ],
    },
    {
      cssRules: [
        {
          type: 1,
          selectorText: ".product-card",
          specialProps: {},
          style: {
            "font-size": "1rem",
            "max-width": "24.5rem",
            "border-bottom-left-radius": "0.71rem",
            "border-bottom-right-radius": "0.71rem",
          },
        } as StyleRuleClone,
        {
          type: 1,
          selectorText: ".product-card__img--desktop",
          specialProps: {},
          style: {},
        } as StyleRuleClone,
        {
          type: 1,
          selectorText: ".product-card__img--mobile",
          specialProps: {},
          style: {
            "border-top-left-radius": "0.71rem",
            "border-top-right-radius": "0.71rem",
            width: "100%",
            "object-position": "0px -5rem",
            "max-height": "17.14rem",
          },
        } as StyleRuleClone,
        {
          type: 1,
          selectorText: ".product-card__content",
          specialProps: {},
          style: {
            "padding-top": "1.71rem",
            "padding-right": "1.71rem",
            "padding-bottom": "1.71rem",
            "padding-left": "1.71rem",
          },
        } as StyleRuleClone,
        {
          type: 1,
          selectorText: ".product-card__category",
          specialProps: {},
          style: {
            "font-size": "0.85em",
            "margin-bottom": "0.85rem",
            "letter-spacing": "0.41rem",
          },
        } as StyleRuleClone,
        {
          type: 1,
          selectorText: ".product-card__title",
          specialProps: {},
          style: {
            "font-size": "2.28em",
            "line-height": "1em",
            "margin-bottom": "1.14rem",
          },
        } as StyleRuleClone,
        {
          type: 1,
          selectorText: ".product-card__description",
          specialProps: {},
          style: {
            "line-height": "1.64em",
            "margin-bottom": "1.71rem",
            "font-size": "1em",
          },
        } as StyleRuleClone,
        {
          type: 1,
          selectorText: ".product-card__price",
          specialProps: {},
          style: {
            "column-gap": "1.35rem",
            "row-gap": "1.35rem",
            "margin-bottom": "0px",
          },
        } as StyleRuleClone,
        {
          type: 1,
          selectorText:
            ".product-card__price--actual, .product-card__price--original",
          specialProps: {},
          style: {},
        } as StyleRuleClone,
        {
          type: 1,
          selectorText: ".product-card__price--actual",
          specialProps: {},
          style: {
            "font-size": "2.28em",
          },
        } as StyleRuleClone,
        {
          type: 1,
          selectorText: ".product-card__price--original",
          specialProps: {},
          style: {
            "font-size": "0.92em",
          },
        } as StyleRuleClone,
        {
          type: 1,
          selectorText: ".product-card__button",
          specialProps: {},
          style: {
            width: "100%",
            "border-top-left-radius": "0.57rem",
            "border-top-right-radius": "0.57rem",
            "border-bottom-right-radius": "0.57rem",
            "border-bottom-left-radius": "0.57rem",
            "padding-top": "1.07rem",
            "padding-right": "1.07rem",
            "padding-bottom": "1.07rem",
            "padding-left": "1.07rem",
            "margin-top": "1.42rem",
            "column-gap": "0.85rem",
            "row-gap": "0.85rem",
          },
        } as StyleRuleClone,
        {
          type: 1,
          selectorText: ".product-card__button:hover",
          specialProps: {},
          style: {},
        },
        {
          type: 4,
          minWidth: 600,
          cssRules: [
            {
              type: 1,
              selectorText: ".product-card",
              specialProps: {},
              style: {
                "max-width": "42.85rem",
                "border-top-right-radius": "0.71rem",
                "border-bottom-right-radius": "0.71rem",
                "max-height": "32.14rem",
              },
            } as StyleRuleClone,
            {
              type: 1,
              selectorText: ".product-card__img--mobile",
              specialProps: {},
              style: {},
            } as StyleRuleClone,
            {
              type: 1,
              selectorText: ".product-card__img--desktop",
              specialProps: {},
              style: {
                "border-top-left-radius": "0.71rem",
                "border-bottom-left-radius": "0.71rem",
                height: "100%",
              },
            } as StyleRuleClone,
            {
              type: 1,
              selectorText: ".product-card__content",
              specialProps: {},
              style: {
                "padding-top": "2.28rem",
                "padding-right": "2.28rem",
                "padding-bottom": "2.28rem",
                "padding-left": "2.28rem",
              },
            } as StyleRuleClone,
            {
              type: 1,
              selectorText: ".product-card__category",
              specialProps: {},
              style: {
                "margin-bottom": "1.42rem",
              },
            } as StyleRuleClone,
            {
              type: 1,
              selectorText: ".product-card__title",
              specialProps: {},
              style: {
                "margin-bottom": "1.71rem",
              },
            } as StyleRuleClone,
            {
              type: 1,
              selectorText: ".product-card__description",
              specialProps: {},
              style: {
                "margin-bottom": "2.07rem",
              },
            } as StyleRuleClone,
            {
              type: 1,
              selectorText: ".product-card__button",
              specialProps: {},
              style: {
                "margin-top": "2.14rem",
              },
            } as StyleRuleClone,
          ],
        } as MediaRuleClone,
      ],
    },
  ],
};

export default docClone;
