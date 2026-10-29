// 页面渲染层：纯函数，输入数据返回 HTML 字符串。无第三方依赖。
import { config } from "../config.js";

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

// 分类名 -> URL slug（优先用 config 里定义的，否则退化为 ASCII）。
export function catSlug(name) {
  const hit = config.categories.find((c) => c.name === name);
  if (hit) return hit.slug;
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// 广告位：填入 AD_CODE（百度联盟 / AdSense 代码）才展示；零成本无备案方案下
// 广告变现基本不通，故未配置时完全不渲染，避免占位框误导用户。
function adSlot(adCode, label) {
  if (adCode && adCode.trim()) return `<div class="ad">${adCode}</div>`;
  return "";
}

function nav(baseUrl) {
  const cats = config.categories
    .map(
      (c) =>
        `<a href="${baseUrl}/cat/${esc(c.slug)}.html">${esc(c.name)}</a>`
    )
    .join("");
  return `<nav class="nav">
    <a class="brand" href="${baseUrl}/">${esc(config.site.name)}</a>
    <div class="nav-links">
      ${cats}
      <a href="${baseUrl}/tool/">工具</a>
    </div>
  </nav>`;
}

function footer(baseUrl, adCode) {
  return `<footer class="foot">
    <p>${esc(config.affiliate.disclaimer)}</p>
    <p class="muted">© ${new Date().getFullYear()} ${esc(config.site.name)} · 内容为自动化生成，价格以联盟实时为准</p>
  </footer>`;
}

function layout({ title, description, canonical, body, adCode, baseUrl, jsonLd }) {
  return `<!doctype html>
<html lang="${esc(config.site.lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
<link rel="alternate" type="application/rss+xml" title="${esc(config.site.name)} RSS" href="${esc(baseUrl)}/feed.xml">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="website">
${jsonLd ? `<script type="application/ld+json">${jsonLd}</script>` : ""}
${adCode && adCode.trim() ? adCode : ""}
<style>
:root{--bg:#fff;--fg:#1a1a1a;--mut:#6b7280;--bd:#e5e7eb;--acc:#2563eb;--acc2:#0ea5e9}
*{box-sizing:border-box}
body{margin:0;font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"PingFang SC","Microsoft YaHei",sans-serif;color:var(--fg);background:var(--bg)}
a{color:var(--acc);text-decoration:none}
a:hover{text-decoration:underline}
.nav{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.8rem 1.2rem;border-bottom:1px solid var(--bd);flex-wrap:wrap}
.brand{font-weight:800;font-size:1.15rem;color:var(--fg)}
.nav-links{display:flex;gap:1rem;flex-wrap:wrap}
.container{max-width:960px;margin:0 auto;padding:1.2rem}
.hero{padding:2.4rem 1.2rem;text-align:center;background:linear-gradient(135deg,#eff6ff,#f0f9ff)}
.hero h1{margin:.2rem 0;font-size:2rem}
.hero p{color:var(--mut);max-width:640px;margin:.4rem auto}
.btn{display:inline-block;background:var(--acc);color:#fff;padding:.6rem 1.1rem;border-radius:8px;font-weight:600}
.btn:hover{text-decoration:none;filter:brightness(1.05)}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1rem;margin:1rem 0}
.card{border:1px solid var(--bd);border-radius:12px;padding:1rem;background:#fff}
.card h3{margin:.2rem 0;font-size:1.05rem}
.price{font-size:1.25rem;font-weight:800;color:#dc2626}
.stars{color:#f59e0b}
.tag{display:inline-block;font-size:.75rem;color:var(--mut);border:1px solid var(--bd);border-radius:999px;padding:.1rem .5rem;margin:.2rem .2rem 0 0}
table{width:100%;border-collapse:collapse;margin:1rem 0}
th,td{border:1px solid var(--bd);padding:.5rem .7rem;text-align:left;vertical-align:top}
th{background:#f8fafc}
.ad{border:1px dashed var(--bd);border-radius:8px;padding:.6rem;margin:1rem 0;text-align:center;color:var(--mut);font-size:.85rem;background:#fafafa}
.ad--ph{opacity:.8}
.pros{color:#16a34a}.cons{color:#dc2626}
.muted{color:var(--mut);font-size:.85rem}
.foot{border-top:1px solid var(--bd);padding:1.4rem 1.2rem;margin-top:2rem;color:var(--mut);font-size:.85rem}
.tool-box{border:1px solid var(--bd);border-radius:12px;padding:1.2rem;margin:1rem 0;background:#f8fafc}
.tool-box label{display:block;margin:.6rem 0 .2rem;font-weight:600}
.tool-box input,.tool-box select{width:100%;padding:.5rem;border:1px solid var(--bd);border-radius:8px;font-size:1rem}
.result{margin-top:1rem;font-size:1.1rem;font-weight:700}
.news{margin:1rem 0;padding:1rem;border:1px solid var(--bd);border-radius:12px}
.news input{width:100%;padding:.5rem;margin:.4rem 0;border:1px solid var(--bd);border-radius:8px}
@media(max-width:600px){.hero h1{font-size:1.5rem}}
</style>
</head>
<body>
${nav(baseUrl)}
<main class="container">
${body}
</main>
${footer(baseUrl, adCode)}
</body>
</html>`;
}

function productCard(p, baseUrl) {
  const stars = "★".repeat(Math.round(p.rating)) + "☆".repeat(5 - Math.round(p.rating));
  return `<div class="card">
    <h3><a href="${baseUrl}/p/${esc(p.id)}.html">${esc(p.name)}</a></h3>
    <div class="stars">${stars} <span class="muted">${esc(p.rating)}</span></div>
    <div class="price">${esc(p.currency || "¥")}${esc(p.price)}</div>
    <div>${p.pros.slice(0, 2).map((x) => `<span class="tag">${esc(x)}</span>`).join("")}</div>
    <p class="muted">${esc(p.summary || "")}</p>
    <a class="btn" rel="sponsored nofollow" target="_blank" href="${esc(p.affUrl)}">去京东查看</a>
  </div>`;
}

export function renderHome({ products, cats, adCode, baseUrl }) {
  const featured = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const catSections = config.categories
    .map((c) => {
      const items = cats[c.name] || [];
      if (!items.length) return "";
      const cards = items.map((p) => productCard(p, baseUrl)).join("");
      return `<section>
        <h2>${esc(c.name)} <a class="muted" href="${baseUrl}/cat/${esc(c.slug)}.html">查看全部 →</a></h2>
        <p class="muted">${esc(c.desc)}</p>
        <div class="cards">${cards}</div>
      </section>`;
    })
    .join("");

  const newsletter = config.newsletter.enabled
    ? `<div class="news">
        <h3>订阅每周好价</h3>
        <form action="${esc(config.newsletter.postUrl)}" method="post">
          <input type="email" name="email" placeholder="你的邮箱" required>
          <button class="btn" type="submit">订阅</button>
        </form>
      </div>`
    : "";

  const body = `
    <section class="hero">
      <h1>${esc(config.site.name)}</h1>
      <p>${esc(config.site.tagline)}——${esc(config.site.description)}</p>
      <a class="btn" href="${baseUrl}/tool/">免费工具：观看距离计算器</a>
    </section>
    ${adSlot(adCode, "首页顶部")}
    ${catSections}
    <section>
      <h2>编辑推荐（高分款）</h2>
      <div class="cards">${featured.map((p) => productCard(p, baseUrl)).join("")}</div>
    </section>
    ${newsletter}
    ${adSlot(adCode, "首页底部")}
  `;
  return layout({
    title: `${config.site.name} · ${config.site.tagline}`,
    description: config.site.description,
    canonical: `${baseUrl}/`,
    body,
    adCode,
    baseUrl,
    jsonLd: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: config.site.name,
      url: `${baseUrl}/`,
      description: config.site.description,
    }),
  });
}

export function renderCategory({ cat, items, adCode, baseUrl }) {
  const slug = catSlug(cat);
  const rows = items
    .map(
      (p) => `<tr>
        <td><a href="${baseUrl}/p/${esc(p.id)}.html">${esc(p.name)}</a></td>
        <td>${esc(p.currency || "¥")}${esc(p.price)}</td>
        <td>${esc(p.rating)}</td>
        <td>${esc((p.summary || "").slice(0, 60))}</td>
        <td><a class="btn" rel="sponsored nofollow" target="_blank" href="${esc(p.affUrl)}">去京东</a></td>
      </tr>`
    )
    .join("");
  const body = `
    <h1>${esc(cat)} 选购指南</h1>
    <p class="muted">${esc((config.categories.find((c) => c.name === cat) || {}).desc || "")}</p>
    ${adSlot(adCode, cat + " 列表顶部")}
    <table><thead><tr><th>产品</th><th>价格</th><th>评分</th><th>简评</th><th></th></tr></thead>
    <tbody>${rows}</tbody></table>
    <div class="cards">${items.map((p) => productCard(p, baseUrl)).join("")}</div>
    ${adSlot(adCode, cat + " 列表底部")}
  `;
  return layout({
    title: `${cat} 选购指南 · ${config.site.name}`,
    description: `${cat}参数对比与购买建议，客观中立。`,
    canonical: `${baseUrl}/cat/${slug}.html`,
    body,
    adCode,
    baseUrl,
  });
}

export function renderProduct({ p, adCode, baseUrl }) {
  const specs = Object.entries(p.specs || {})
    .map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`)
    .join("");
  const pros = (p.pros || []).map((x) => `<li class="pros">✓ ${esc(x)}</li>`).join("");
  const cons = (p.cons || []).map((x) => `<li class="cons">✗ ${esc(x)}</li>`).join("");
  const body = `
    <h1>${esc(p.name)}</h1>
    <p class="muted">更新于 ${esc(p.updated || "")} · 评分 ${esc(p.rating)}</p>
    <div class="price">${esc(p.currency || "¥")}${esc(p.price)}</div>
    ${adSlot(adCode, "商品顶部")}
    <p>${esc(p.summary || "")}</p>
    <h2>参数</h2>
    <table><tbody>${specs}</tbody></table>
    <h2>优缺点</h2>
    <ul>${pros}${cons}</ul>
    <p><a class="btn" rel="sponsored nofollow" target="_blank" href="${esc(p.affUrl)}">去京东查看</a></p>
    ${adSlot(adCode, "商品底部")}
    <p class="muted"><a href="${baseUrl}/">← 返回首页</a></p>
  `;
  return layout({
    title: `${p.name} 评测与购买 · ${config.site.name}`,
    description: `${p.name}：${esc((p.summary || "").slice(0, 80))}`,
    canonical: `${baseUrl}/p/${esc(p.id)}.html`,
    body,
    adCode,
    baseUrl,
    jsonLd: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.name,
      description: p.summary || "",
      offers: {
        "@type": "Offer",
        price: p.price,
        priceCurrency: (p.currency || "¥") === "¥" ? "CNY" : p.currency,
        availability: "https://schema.org/InStock",
      },
    }),
  });
}

export function renderTool({ adCode, baseUrl }) {
  const body = `
    <h1>${esc(config.tool.title)}</h1>
    <p class="muted">${esc(config.tool.desc)}</p>
    <div class="tool-box">
      <label>屏幕尺寸（英寸，对角线）</label>
      <input id="size" type="number" value="55" min="10" max="120">
      <label>分辨率</label>
      <select id="res">
        <option value="2.5">1080P（全高清）</option>
        <option value="2.0">2K（1440P）</option>
        <option value="1.5" selected>4K（超高清）</option>
        <option value="1.0">8K</option>
      </select>
      <label>使用场景</label>
      <select id="use">
        <option value="1">标准（电影/游戏）</option>
        <option value="0.8">沉浸（尽量近）</option>
        <option value="1.2">保守（护眼）</option>
      </select>
      <div class="result" id="out">—</div>
      <p class="muted">公式：推荐距离(英寸) = 尺寸 × 分辨率系数 × 场景系数。仅供参考，实际以个人视力与习惯为准。</p>
    </div>
    ${adSlot(adCode, "工具页底部")}
    <script>
      function calc(){
        var s=parseFloat(document.getElementById('size').value)||0;
        var r=parseFloat(document.getElementById('res').value)||1.5;
        var u=parseFloat(document.getElementById('use').value)||1;
        var inch=s*r*u;
        var cm=inch*2.54;
        var m=(cm/100).toFixed(2);
        document.getElementById('out').textContent='推荐观看距离：约 '+inch.toFixed(0)+' 英寸 / '+cm.toFixed(0)+' cm / '+m+' m';
      }
      document.getElementById('size').addEventListener('input',calc);
      document.getElementById('res').addEventListener('change',calc);
      document.getElementById('use').addEventListener('change',calc);
      calc();
    </script>
  `;
  return layout({
    title: `${config.tool.title} · ${config.site.name}`,
    description: config.tool.desc,
    canonical: `${baseUrl}/tool/`,
    body,
    adCode,
    baseUrl,
  });
}

export function renderSitemap({ urls }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${esc(u)}</loc></url>`).join("\n")}
</urlset>`;
}

export function renderFeed({ products, baseUrl }) {
  const items = products
    .map(
      (p) => `  <item>
    <title>${esc(p.name)}</title>
    <link>${esc(baseUrl)}/p/${esc(p.id)}.html</link>
    <guid>${esc(baseUrl)}/p/${esc(p.id)}.html</guid>
    <description>${esc(p.summary || "")} 价格 ${esc(p.currency || "¥")}${esc(p.price)}</description>
  </item>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${esc(config.site.name)}</title>
  <link>${esc(baseUrl)}/</link>
  <description>${esc(config.site.description)}</description>
${items}
</channel>
</rss>`;
}

export function renderRobots({ baseUrl }) {
  return `User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml\n`;
}
