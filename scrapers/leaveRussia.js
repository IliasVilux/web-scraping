export async function scrapeLeaveRussia(browser) {
  const page = await browser.newPage();
  await page.goto("https://leave-russia.org/", {
    waitUntil: "domcontentloaded",
  });

  const brands = await page.$$eval(".companies.cards .card", (cards) => {
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
      category: brand.querySelector(".label.industry a")?.innerText.trim() ?? null
    });

    return cards.map(parseBrand);
  });

  await page.close();
  const results = {};

  for (const brand of brands) {
    const cat = brand.category || "Uncategorized";

    if (!results[cat]) results[cat] = [];

    results[cat].push({
      [brand.name]: {
        ...brand,
        category: undefined
      },
    });
  }

  return results;
}
