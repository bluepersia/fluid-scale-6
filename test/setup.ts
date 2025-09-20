import { Browser, chromium, Page } from "playwright";
import path from "path";
import { fileURLToPath } from "url";
import { PlaywrightPage } from "./index.types";
import * as clonerAssertions from "./golden-state/assertions/cloner";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type PlaywrightBlueprint = {
  htmlFilePath: string;
  addCss: string[];
};

const realProjectsData: PlaywrightBlueprint[] = [
  {
    htmlFilePath: "golden-state/eau-de-parfum",
    addCss: ["css/global.css", "css/utils.css", "css/product-card.css"],
  },
];

async function initPlaywrightPages(): Promise<PlaywrightPage[]> {
  return await Promise.all(
    realProjectsData.map(async ({ htmlFilePath, addCss }) => {
      const finalPath = path.resolve(__dirname, htmlFilePath, "index.html");
      const browser = await chromium.launch();
      const page = await browser.newPage();
      await page.goto(`file://${finalPath}`);

      for (const css of addCss) {
        const cssPath = path.resolve(__dirname, htmlFilePath, css);
        await page.addStyleTag({ path: cssPath });
      }

      // Inject the IIFE bundle and expose cloneDocument on window for tests
      const clonerBundlePath = path.resolve(__dirname, "../dist/bundle.js");
      await page.addScriptTag({ path: clonerBundlePath });
      await page.evaluate(() => {
        // @ts-expect-error global from IIFE bundle
        window.cloneDocument = window.FluidScale.cloneDocument;

        // @ts-expect-error global from IIFE bundle
        window.clonerWrapReset = window.FluidScale.clonerWrapReset;
      });

      return { page, browser };
    })
  );
}

async function teardownPlaywrightPages(
  playwrightPages: { page: Page; browser: Browser }[]
) {
  for (const { page, browser } of playwrightPages) {
    await page.close(); // close page first
    await browser.close(); // then close browser
  }
}

export { initPlaywrightPages, teardownPlaywrightPages };
