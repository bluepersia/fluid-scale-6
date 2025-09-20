import { Browser, Page } from "playwright";

type PlaywrightPage = {
  page: Page;
  browser: Browser;
};

export type { PlaywrightPage };
