import puppeteer from "puppeteer";
import fs from "fs";
import { scrapeBoycottIsrael } from "./scrapers/boycottIsrael.js";

const browser = await puppeteer.launch({
  headless: "new",
  defaultViewport: null,
});

const boycottIsrael = await scrapeBoycottIsrael(browser);
fs.writeFileSync("data/boycott-israel.json", JSON.stringify(boycottIsrael, null, 2));

await browser.close();