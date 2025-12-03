export async function scrapeEthical(browser) {
  const page = await browser.newPage();
  await page.goto("https://thegoodshoppingguide.com/top-200-ethical-businesses/", {
    waitUntil: "domcontentloaded",
  });

  const brands = await page.$$eval(".block-wrapper .textarea li", (nodes) => {
    return nodes.map((node) => ({
        name: node.querySelector("a")?.innerText.trim() ?? null,
        link: node.querySelector("a")?.href ?? null,
    }));
  });

  await page.close();
  const results = {};

  for (const brand of brands) {
    const parsed = await parseBrandPage(browser, brand);
    const category = parsed.category || "Uncategorized";

    if (!results[category]) results[category] = [];

    results[category].push({
      [parsed.name]: {
        ...parsed,
        category: undefined,
      },
    });
  }

  return results;
}

async function parseBrandPage(browser, brand) {
    if (!brand.link) return { ...brand, description: null, category: null };

    const page = await browser.newPage();
    await page.goto(brand.link, {
        waitUntil: "domcontentloaded",
    });

    const data = await page.$$eval(".textarea.prose.text-black.min-w-full p", (paragraphs) => {
        return {
            description: paragraphs[1]?.innerText?.trim() ?? null,
        };
    });

    const headerData = await page.$eval(".single-prod__title + p", (header) => {
        const rawText = header.innerText;
        const match = rawText.match(/Category:\s*([^:\n]+):?/);

        return {
            category: match ? match[1].trim() : null,
        }
    }).catch(() => ({ category: null }));

    await page.close();
    return { ...brand, ...data, ...headerData };
}