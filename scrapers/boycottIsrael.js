export async function scrapeBoycottIsrael(browser) {
  const page = await browser.newPage();
  await page.goto("https://boycott-israel.org/boycott.html", {
    waitUntil: "domcontentloaded",
  });

  const data = await page.$$eval(".boycott-category", (categories) => {
    const result = {};

    const parseBrand = (brand) => ({
      name:
        brand.querySelector("h4")?.childNodes[0]?.textContent.trim() ?? null,
      impact:
        brand.querySelector("span")?.innerText.trim().toLowerCase() ?? null,
      description: brand.querySelector("h4 + p")?.innerText.trim() ?? null,
      subbrands: Array.from(brand.querySelectorAll(".subbrands > div"), (sub) =>
        sub.textContent.trim()
      ),
      country: brand.querySelector(".country")?.innerText.trim() ?? null,
      alternative:
        brand.querySelector(".alternative")?.innerText.trim() ?? null,
      source: brand.querySelector("a")?.href ?? null,
    });

    for (const category of categories) {
      const categoryName = category.querySelector("h3")?.innerText.trim();

      const brands = Array.from(category.querySelectorAll("li"), parseBrand);

      result[categoryName] = brands;
    }
    return result;
  });

  await page.close();
  return data;
}
