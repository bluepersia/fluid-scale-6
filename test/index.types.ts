import { Browser, Page } from "playwright";
import {
  DocumentClone,
  StyleRuleClone,
} from "../src/parse/cloner/cloner.types";

type Master = {
  docClone: DocumentClone;
  breakpoints: number[];
  globalBaselineWidth: number;
  batchedDoc: BatchedDoc;
};
type BatchedDoc = {
  styleSheets: {
    batches: {
      isMediaQuery: boolean;
      width: number;
      rules: StyleRuleClone[];
    }[];
  }[];
};
type PlaywrightPage = {
  page: Page;
  browser: Browser;
};

export type { PlaywrightPage, Master };
