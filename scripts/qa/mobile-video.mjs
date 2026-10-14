// Plays the Module 1 video on emulated phones against the live site and records what happens.
import { chromium, webkit, devices } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
const B = process.env.SITE ?? "https://lms-bay-rho.vercel.app";
const out = "assets-pipeline/mobile-qa";
mkdirSync(out, { recursive: true });
const report = [];
for (const [name, engine, dev] of [["iphone", webkit, devices["iPhone 13"]], ["android", chromium, devices["Pixel 7"]]]) {
  const log = [];
  const b = await engine.launch();
  const ctx = await b.newContext({ ...dev });
  const p = await ctx.newPage();
  p.on("console", (m) => log.push(`console.${m.type()}: ${m.text()}`));
  p.on("pageerror", (e) => log.push(`PAGE ERROR: ${e.message}`));
  p.on("requestfailed", (r) => log.push(`REQUEST FAILED: ${r.url()} ${r.failure()?.errorText}`));
  p.on("response", (r) => { if (r.status() >= 400) log.push(`HTTP ${r.status()}: ${r.url()}`); if (r.url().includes("/audio/")) log.push(`audio ${r.status()} ${r.url().split("/").pop()}`); });
  try {
    const t0 = Date.now();
    await p.goto(`${B}/courses/forklift-licence-theory`, { waitUntil: "networkidle", timeout: 60000 });
    await p.screenshot({ path: `${out}/${name}-1-course.png`, fullPage: false });
    const link = p.locator('a[href*="/modules/1/watch"]').first();
    log.push(`watch link visible: ${await link.isVisible().catch(() => false)}`);
    await link.scrollIntoViewIfNeeded();
    await p.screenshot({ path: `${out}/${name}-2-link.png` });
    await link.click();
    await p.waitForURL(/watch/, { timeout: 30000 });
    await p.waitForLoadState("networkidle");
    log.push(`watch page loaded in ${Date.now() - t0} ms: ${p.url()}`);
    await p.screenshot({ path: `${out}/${name}-3-watch.png`, fullPage: true });
    const play = p.getByRole("button", { name: /play video/i });
    log.push(`big play button visible: ${await play.isVisible().catch(() => false)}`);
    await play.click({ timeout: 10000 });
    await p.waitForTimeout(6000);
    await p.screenshot({ path: `${out}/${name}-4-playing.png`, fullPage: true });
    const state = await p.evaluate(() => {
      const a = [...document.querySelectorAll("audio")];
      return { captions: document.querySelector("[aria-live]")?.textContent?.slice(0, 120), audioEls: a.length, btn: [...document.querySelectorAll("button")].map((x) => x.textContent?.trim()).filter(Boolean).slice(0, 8) };
    });
    log.push(`after 6s: ${JSON.stringify(state)}`);
    await p.waitForTimeout(12000);
    await p.screenshot({ path: `${out}/${name}-5-later.png`, fullPage: false });
    log.push(`after 18s caption: ${await p.locator("[aria-live]").first().textContent()}`);
  } catch (e) {
    log.push(`STEP FAILED: ${e.message.split("\n")[0]}`);
    await p.screenshot({ path: `${out}/${name}-error.png`, fullPage: true }).catch(() => {});
  }
  await b.close();
  report.push(`## ${name}\n` + log.map((l) => `- ${l}`).join("\n"));
}
writeFileSync(`${out}/report.md`, report.join("\n\n") + "\n");
console.log(report.join("\n\n"));
