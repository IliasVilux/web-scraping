import puppeteer from "puppeteer-extra";
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from "fs";
import { scrapeBoycottIsrael } from "./scrapers/boycottIsrael.js";
import { scrapeLeaveRussia } from "./scrapers/leaveRussia.js";
import { scrapePeta } from "./scrapers/peta.js";
import { scrapeEthical } from "./scrapers/ethical.js";

puppeteer.use(StealthPlugin());
const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: null,
});

const boycottIsrael = await scrapeBoycottIsrael(browser);
fs.writeFileSync("data/boycott-israel.json", JSON.stringify(boycottIsrael, null, 2));

const leaveRussia = await scrapeLeaveRussia(browser);
fs.writeFileSync("data/leave-russia.json", JSON.stringify(leaveRussia, null, 2));

const ethical = await scrapeEthical(browser);
fs.writeFileSync("data/ethical.json", JSON.stringify(ethical, null, 2));

const peta = await scrapePeta(browser);
fs.writeFileSync("data/peta.json", JSON.stringify(peta, null, 2));

await browser.close();