// 站点核心配置。上线前把 baseUrl 改成你的域名。
// 联盟推广位 ID、广告代码通过环境变量注入（见 README），不写死在仓库里。
export const config = {
  site: {
    name: "智选助手",
    tagline: "电子产品与家电选购比价指南",
    // 零成本方案：用 GitHub Pages 免费二级域名（无需购买域名、无需备案）。
    // 你的实际仓库名为 "-"，故上线地址为 https://lyc0p.github.io/-。
    // 也可用环境变量 BASE_URL 覆盖，构建时注入（推荐在仓库 Secrets/Variables 里设）。
    baseUrl: "https://lyc0p.github.io/-",
    lang: "zh-CN",
    description:
      "客观、可对比的电子产品与家电选购指南：参数对比、价格跟踪、观看距离计算，帮你少花冤枉钱。",
    author: "智选助手",
  },

  // 内容垂直领域。可改成你选定的细分赛道（如"母婴用品""户外装备"）。
  niche: "电子产品 / 家电",

  // 联盟配置：network 仅作记录，真正生效的是 AFF_ID 环境变量与商品里的 affUrl 模板。
  affiliate: {
    network: "jd", // jd | pdd | taobao | amazon
    // 占位符 PLACEHOLDER 会在构建时被环境变量 AFF_ID 替换。
    defaultAffUrl: "https://u.jd.com/PLACEHOLDER",
    disclaimer:
      "本站为联盟推广伙伴，通过本站链接购买不会产生额外费用，商家会向本站支付少量佣金以支持运营。",
  },

  // 广告：把广告联盟给的 <script> 代码通过环境变量 AD_CODE 注入；留空则不显示。
  // 零成本 + GitHub Pages(海外) 场景下，AdSense 无需备案即可投放；百度联盟通常要求已备案域名。
  // 后续若升级到国内备案域名，再把 network 改为 baidu。
  ads: {
    network: "adsense", // adsense | baidu | none
    code: "",
  },

  // 分类定义（slug 用于 URL，保持 ASCII）。商品按 category 名称归组。
  categories: [
    { name: "电视", slug: "tv", desc: "高刷、Mini-LED、性价比之选，附观看距离建议。" },
    { name: "洗衣机", slug: "washer", desc: "滚筒/波轮/洗烘一体，按家庭人数选型。" },
    { name: "耳机", slug: "earphone", desc: "降噪、音质、佩戴，通勤与居家场景对比。" },
    { name: "空调", slug: "ac", desc: "按匹数、能效与房间面积选型，附安装注意。" },
    { name: "笔记本", slug: "laptop", desc: "轻薄本/游戏本/入门本，按用途与预算对比。" },
    { name: "路由器", slug: "router", desc: "WiFi6 与 Mesh 组网，覆盖与带机量对比。" },
    { name: "冰箱", slug: "fridge", desc: "容量、风冷无霜与分区，按家庭人数选型。" },
    { name: "扫地机器人", slug: "robot", desc: "扫拖一体与自动集尘，按户型与预算对比。" },
    { name: "手机", slug: "phone", desc: "旗舰与千元机，按性能、续航与预算对比。" }
  ],

  // 免费实用工具（纯前端，用于吸引直接流量与外链）。
  tool: {
    title: "显示器 / 电视 尺寸与最佳观看距离计算器",
    desc: "输入屏幕尺寸与分辨率，给出推荐的舒适观看距离，避免买大买小。",
  },

  // 邮件订阅（可选）：把表单提交地址通过环境变量 MAIL_POST_URL 注入；留空则隐藏表单。
  newsletter: {
    enabled: false,
    postUrl: "",
  },
};
