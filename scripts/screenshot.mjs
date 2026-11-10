import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = "http://localhost:5183";
const OUT = "/tmp/shots";
mkdirSync(OUT, { recursive: true });

const widths = [1440, 1024, 360];
const scenarios = [
  { name: "completed", path: "/" },
  { name: "terminated", path: "/?scenario=terminated" },
];

const browser = await chromium.launch();
const errors = [];

for (const width of widths) {
  for (const scenario of scenarios) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(`[${scenario.name} @${width}] ${msg.text()}`);
      }
    });
    page.on("pageerror", (err) => {
      errors.push(`[${scenario.name} @${width}] pageerror: ${err.message}`);
    });

    await page.goto(`${BASE}${scenario.path}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    if (scrollWidth > clientWidth) {
      errors.push(
        `[${scenario.name} @${width}] HORIZONTAL SCROLL: scrollWidth=${scrollWidth} clientWidth=${clientWidth}`,
      );
    }

    await page.screenshot({
      path: `${OUT}/${scenario.name}-${width}.png`,
      fullPage: true,
    });

    // Hover + select first rating option on completed/desktop to capture states.
    if (scenario.name === "completed") {
      const options = page.locator('[role="radio"]');
      await options.nth(0).hover();
      await page.waitForTimeout(300);
      await page.screenshot({ path: `${OUT}/${scenario.name}-${width}-hover.png` });

      await options.nth(0).click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: `${OUT}/${scenario.name}-${width}-selected-rating1.png` });

      // reason badge select
      const badge = page.getByRole("button", { name: "Time Pressure" });
      if (await badge.count()) {
        await badge.click();
        await page.waitForTimeout(200);
        await page.screenshot({
          path: `${OUT}/${scenario.name}-${width}-reason-selected.png`,
        });

        // submit
        const submit = page.getByRole("button", { name: "Submit" });
        await submit.click();
        await page.waitForTimeout(300);
        await page.screenshot({ path: `${OUT}/${scenario.name}-${width}-thankyou.png` });
      }
    }

    await page.close();
  }
}

await browser.close();

if (errors.length) {
  console.log("ERRORS:");
  for (const e of errors) console.log(" -", e);
} else {
  console.log("No console errors or horizontal scroll detected.");
}
