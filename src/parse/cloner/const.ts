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

export { FLUID_PROPERTY_NAMES, SHORTHAND_PROPERTIES, explicitProps };
