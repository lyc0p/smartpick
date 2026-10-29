// 构建编排：拉数据 -> 替换推广位 -> 渲染所有页面 -> 写出 dist/。
import { config } from "./src/config.js";
import { loadProducts } from "./src/lib/fetch.js";
import {
  renderHome,
  renderCategory,
  renderProduct,
  renderTool,
  renderSitemap,
  renderFeed,
  renderRobots,
  catSlug,
} from "./src/lib/render.js";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

const DIST = "dist";
const adCode = process.env.AD_CODE || config.ads.code || "";
const affId = process.env.AFF_ID || config.affiliate.tag || "PLACEHOLDER";
const baseUrl = (process.env.BASE_URL || config.site.baseUrl).replace(/\/$/, "");

async function main() {
  const products = await loadProducts();
  // 把商品里的占位符替换成真实推广位 ID。
  products.forEach((p) => {
    p.affUrl = (p.affUrl || config.affiliate.defaultAffUrl).replace(
      "PLACEHOLDER",
      affId
    );
  });

  const cats = {};
  for (const p of products) (cats[p.category] ||= []).push(p);

  await mkdir(DIST, { recursive: true });
  await mkdir(join(DIST, "cat"), { recursive: true });
  await mkdir(join(DIST, "p"), { recursive: true });
  await mkdir(join(DIST, "tool"), { recursive: true });

  await writeFile(
    join(DIST, "index.html"),
    renderHome({ products, cats, adCode, baseUrl })
  );

  for (const c of config.categories) {
    const items = cats[c.name] || [];
    if (!items.length) continue;
    await writeFile(
      join(DIST, "cat", `${c.slug}.html`),
      renderCategory({ cat: c.name, items, adCode, baseUrl })
    );
  }

  for (const p of products) {
    await writeFile(
      join(DIST, "p", `${p.id}.html`),
      renderProduct({ p, adCode, baseUrl })
    );
  }

  await writeFile(
    join(DIST, "tool", "index.html"),
    renderTool({ adCode, baseUrl })
  );
  await writeFile(join(DIST, "sitemap.xml"), renderSitemap({ products, cats, baseUrl }));
  await writeFile(join(DIST, "feed.xml"), renderFeed({ products, baseUrl }));
  await writeFile(join(DIST, "robots.txt"), renderRobots({ baseUrl }));

  console.log(
    `✅ 构建完成：${products.length} 个商品，${Object.keys(cats).length} 个分类 -> dist/`
  );
}

main().catch((e) => {
  console.error("❌ 构建失败：", e);
  process.exit(1);
});
