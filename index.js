import puppeteer from "puppeteer";
import fs from "fs";
import { scrapeBoycottIsrael } from "./scrapers/boycottIsrael.js";
import { scrapeLeaveRussia } from "./scrapers/leaveRussia.js";

const browser = await puppeteer.launch({
  headless: "new",
  defaultViewport: null,
});

const boycottIsrael = await scrapeBoycottIsrael(browser);
fs.writeFileSync("data/boycott-israel.json", JSON.stringify(boycottIsrael, null, 2));

const leaveRussia = await scrapeLeaveRussia(browser);
fs.writeFileSync("data/leave-russia.json", JSON.stringify(leaveRussia, null, 2));

await browser.close();