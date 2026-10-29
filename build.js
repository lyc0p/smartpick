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
const baseUrl = (process.env.BASE_URL || config.site.baseUrl).replace(/\/$/, "");

// 把商品里的购买链接解析为“永远可用”的链接：
// 1) 若种子里给了有效真实链接（已含你的推广位/带佣短链），原样保留；
// 2) 否则用京东搜索兜底（按产品名搜），保证用户点得开、不死链、且指向具体商品。
function resolveAffUrl(p) {
  const url = (p.affUrl && p.affUrl.trim()) || "";
  if (url && !url.includes("PLACEHOLDER") && /^https?:\/\//i.test(url)) {
    return url;
  }
  return `https://search.jd.com/Search?keyword=${encodeURIComponent(p.name)}`;
}

// IndexNow：构建时把全站 URL 推送给 Bing/必应等搜索引擎，加速收录（零成本、自动）。
// 注意：GitHub Pages 项目页（*.github.io/仓库名 子路径）无法把验证文件放在域名根，
// 搜索引擎所有权验证必然失败，IndexNow 实际无效，故在 github.io 下静默跳过。
// 自有已备案域名（host 不是 github.io）时才真正生效。
async function submitIndexNow(urls) {
  const key = config.indexNow?.key;
  if (!config.indexNow?.enabled || !key) return;
  const host = new URL(baseUrl).host;
  if (host.endsWith("github.io")) return;
  try {
    const host = new URL(baseUrl).host;
    const payload = JSON.stringify({
      host,
      key,
      keyLocation: `${baseUrl}/${key}.txt`,
      urlList: urls,
    });
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    });
    console.log(`IndexNow 提交：${res.status}（${urls.length} 个 URL）`);
  } catch (e) {
    console.log("IndexNow 提交跳过（网络问题，不影响构建）：", e.message);
  }
}

async function main() {
  const products = await loadProducts();
  products.forEach((p) => {
    p.affUrl = resolveAffUrl(p);
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
  const urls = [
    `${baseUrl}/`,
    `${baseUrl}/tool/`,
    ...config.categories.map((c) => `${baseUrl}/cat/${c.slug}.html`),
    ...products.map((p) => `${baseUrl}/p/${p.id}.html`),
  ];
  await writeFile(join(DIST, "sitemap.xml"), renderSitemap({ urls }));
  await writeFile(join(DIST, "feed.xml"), renderFeed({ products, baseUrl }));
  await writeFile(join(DIST, "robots.txt"), renderRobots({ baseUrl }));

  // 发布 IndexNow 密钥文件（供搜索引擎验证），并提交全站 URL 加速收录。
  const key = config.indexNow?.key;
  if (config.indexNow?.enabled && key) {
    await writeFile(join(DIST, `${key}.txt`), key);
    await submitIndexNow(urls);
  }

  console.log(
    `✅ 构建完成：${products.length} 个商品，${Object.keys(cats).length} 个分类 -> dist/`
  );
}

main().catch((e) => {
  console.error("❌ 构建失败：", e);
  process.exit(1);
});
