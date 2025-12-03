export async function scrapePeta(browser) {
  const page = await browser.newPage();
  await page.goto("https://crueltyfree.peta.org/companies-do-test/", {
    waitUntil: "networkidle2",
  });

  const brands = await page.$$eval("ul.search-results li", (nodes) => {
    return nodes.map((node) => ({
        name: node.querySelector("a")?.innerText.trim() ?? null,
        link: node.querySelector("a")?.href ?? null,
    }));
  });

  await page.close();
  const results = {};

  for (const brand of brands) {
    await sleep();

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
    if (!brand.link) return { ...brand, description: null };

    const page = await browser.newPage();
    await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );
    await page.goto(brand.link, {
        waitUntil: "domcontentloaded",
    });

    const description = await page.$eval(
      ".single-company__hero-social-copy > p",
      el => el.innerText.trim()
    ).catch(() => null);

    await page.close();

    return { 
      ...brand, 
      description 
    };
}

function sleep(min = 1000, max = 3000) {
  return new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));
}