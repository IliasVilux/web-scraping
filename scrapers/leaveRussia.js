export async function scrapeLeaveRussia(browser) {
  const page = await browser.newPage();
  await page.goto("https://leave-russia.org/", {
    waitUntil: "domcontentloaded",
  });

  const data = await page.$$eval(".companies.cards .card", (cards) => {
    const parseBrand = (brand) => ({
      name:
        brand.querySelector(".annotation > div > div")?.innerText.trim() ?? null,
      impact:
        brand.querySelector(".cstatus .status span")?.innerText.trim().toLowerCase() ?? null,
      description: brand.querySelector(".decision p")?.innerText.trim() ?? null,
      subbrands: [],
      country: brand.querySelector(".label.country a")?.innerText.trim() ?? null,
      alternative: null,
      source: brand.querySelector(".decision .date a")?.href ?? null,
    });

    return cards.map(parseBrand);
  });

  await page.close();
  return data;
}
