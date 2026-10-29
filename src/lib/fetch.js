// 数据采集层：当前从本地种子文件读取（保证离线可运行）。
// 接入真实联盟 API 时，在此处实现对应网络的拉取逻辑，返回相同结构即可，
// 其余渲染/构建代码无需改动。
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SEED = join(__dirname, "..", "data", "products.seed.json");

/**
 * 拉取商品数据。
 * 真实接入示例（伪代码，需你申请到 appkey 后填）：
 *
 *   if (process.env.JD_APPKEY && process.env.JD_APPSECRET) {
 *     const res = await fetch("https://api.jd.com/routerjson?method=jd.union.open.goods.query",
 *       { method: "POST", body: buildJdParams(...) });
 *     return normalizeJd(await res.json());
 *   }
 *
 * 京东联盟 / 拼多多多多进宝 / 淘宝客 均提供商品查询接口，
 * 返回后映射成下面的字段结构即可复用整套模板。
 */
export async function loadProducts() {
  const raw = await readFile(SEED, "utf8");
  const list = JSON.parse(raw);
  if (!Array.isArray(list) || list.length === 0) {
    throw new Error("种子数据为空，请检查 src/data/products.seed.json");
  }
  return list;
}
