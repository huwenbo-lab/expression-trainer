# 学术写作表达训练器 — 项目方案与技术规格

## 一、项目概述

### 1.1 背景与目标

面向中文母语的英语学术写作者（博士生、青年学者），解决一个核心问题：被动词汇丰富但主动输出表达单一。用户阅读论文时能理解多样化的英文表达，但写作时只会用最基础的几种说法。

本工具不是词典，不是翻译器，而是一个**表达训练系统**。核心理念：将同一个写作意图（中文概念）对应的多种英文表达组织成"意思族群"（Meaning Cluster），通过反复的列表式扫读训练，让用户将被动词汇转化为主动可调用的表达储备。

### 1.2 设计哲学

- **高信息密度，列表式扫读**：不用闪卡（低效），不用弹窗，所有表达以紧凑列表呈现，用户快速从上到下扫读
- **意思族群为核心单元**：一个中文写作意图 + 它的全部英文实现方式构成一个族群，训练时整个族群一起过
- **渐进聚焦机制**：用户标记已掌握的表达后，过滤器帮助缩短列表，注意力自动聚焦到薄弱点
- **AI 可扩展**：语料与代码分离，后续可通过 AI agent 从论文中提取新表达，追加到 JSON 数据文件中

### 1.3 参考产品

- **曼彻斯特大学 Academic Phrasebank**：按写作功能组织表达的经典参考，本项目借鉴其组织逻辑，但增加训练机制和 AI 扩展能力
- **不背单词（中文 App）**：强调多次曝光形成记忆的理念，本项目借鉴其渐进训练逻辑，但颗粒度从单词提升到意思族群

---

## 二、技术栈与部署

### 2.1 技术选型

- **框架**：React（Vite 脚手架）
- **样式**：Tailwind CSS（核心 utility classes）
- **数据存储**：语料数据为静态 JSON 文件，打包在项目内；用户进度存储在浏览器 localStorage
- **部署**：GitHub Pages（零服务器成本，commit push 后自动部署）
- **无需后端**：纯前端应用

### 2.2 部署配置

```
# vite.config.js
export default defineConfig({
  base: '/expression-trainer/',  // GitHub Pages 子路径
  plugins: [react()]
})
```

GitHub Actions 配置自动部署到 `gh-pages` 分支。

---

## 三、数据架构

### 3.1 层级结构

```
Domain（领域）: 学术写作
  └── Category（大类）: 因果与影响
        └── Meaning Cluster（意思族群）: X对Y有影响（动词）
              └── Expression（单条表达）: shape, drive, contribute to...
```

### 3.2 数据文件组织

所有语料存放在 `src/data/academic/` 目录下，每个 Category 一个 JSON 文件：

```
src/data/academic/
├── causality.json           # 因果与影响
├── contradiction.json       # 矛盾与张力
├── gaps.json                # 研究空白与问题
├── prior-literature.json    # 描述前人工作
├── statistics.json          # 统计与结果报告
├── methods.json             # 方法与数据
├── contributions.json       # 贡献与意义
├── degree-comparison.json   # 程度与比较
└── index.js                 # 统一导出
```

### 3.3 JSON Schema — Category 文件

```json
{
  "id": "causality",
  "name": "因果与影响",
  "nameEn": "Causality & Influence",
  "description": "表达变量之间因果关系、影响机制的各类表达",
  "clusters": [
    {
      "id": "influence-verb",
      "meaning": "X对Y有影响（动词用法）",
      "tags": ["影响", "作用", "因果"],
      "expressions": [
        {
          "id": "inf-v-01",
          "en": "shape",
          "note": "强调塑造、有方向性，暗示长期结构性影响",
          "example": "Parental education shapes children's educational aspirations.",
          "register": "formal"
        },
        {
          "id": "inf-v-02",
          "en": "drive",
          "note": "强调是主要推动力，语气强",
          "example": "Economic insecurity drives delayed marriage among urban youth.",
          "register": "formal"
        },
        {
          "id": "inf-v-03",
          "en": "contribute to",
          "note": "语气较弱，适合因果关系不确定时使用",
          "example": "Field of study contributes to wage disparities among graduates.",
          "register": "neutral"
        },
        {
          "id": "inf-v-04",
          "en": "bear on",
          "note": "较书面，常见于理论讨论，略带间接意味",
          "example": "These institutional arrangements bear on women's labor force participation.",
          "register": "literary"
        },
        {
          "id": "inf-v-05",
          "en": "give rise to",
          "note": "强调某事物导致新现象产生",
          "example": "Rapid expansion of higher education has given rise to new forms of stratification.",
          "register": "formal"
        },
        {
          "id": "inf-v-06",
          "en": "condition",
          "note": "作动词，表示'制约、限定条件'，较学术",
          "example": "Gender norms condition the translation of resources into bargaining power.",
          "register": "formal"
        }
      ]
    }
  ]
}
```

### 3.4 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `cluster.id` | string | 是 | 族群唯一标识，建议语义化命名如 `influence-verb` |
| `cluster.meaning` | string | 是 | 中文写作意图描述，是用户看到的核心信息 |
| `cluster.tags` | string[] | 否 | 中文关键词标签，用于未来搜索/交叉索引功能 |
| `expression.id` | string | 是 | 单条表达唯一标识 |
| `expression.en` | string | 是 | 英文表达（短语或句式） |
| `expression.note` | string | 是 | **与同族其他表达的差异说明**，不是翻译，而是帮助用户选择的决策信息 |
| `expression.example` | string | 是 | 完整例句，最好来自社会学/人口学语境 |
| `expression.register` | string | 否 | 正式程度标记：`formal` / `neutral` / `literary` / `colloquial` |
| `expression.source` | string | 否 | 表达出处，如 `"Demography 2023"` |

### 3.5 用户进度存储（localStorage）

```json
{
  "mastered": ["inf-v-01", "inf-v-03", "contra-n-02"],
  "starred": ["inf-v-04", "gap-q-03"],
  "lastVisited": {
    "category": "causality",
    "timestamp": "2026-05-09T10:30:00Z"
  }
}
```

`mastered` 和 `starred` 都是 expression ID 的数组，全局唯一，不按 Category 分组（简化逻辑）。

---

## 四、Category 分类体系与内容规划

以下是第一期需要填充的 8 个 Category，每个列出其下的 Meaning Cluster。每个 Cluster 填充 4-8 条表达，第一期总计约 300-500 条表达。

### 4.1 因果与影响 (causality.json)

| Cluster ID | 中文意思 |
|------------|----------|
| influence-verb | X对Y有影响（动词用法） |
| influence-noun | X对Y有影响（名词用法：the effect/impact of） |
| cause-direct | X导致了Y / X是Y的原因 |
| mechanism | X是通过Z机制影响Y的（中介路径） |
| moderate | X调节/缓冲了Z对Y的影响（调节效应） |
| consequence | X的后果/结果是 |
| amplify | X放大/加剧了Y |
| attenuate | X削弱/减缓了Y |

### 4.2 矛盾与张力 (contradiction.json)

| Cluster ID | 中文意思 |
|------------|----------|
| inconsistent | X与Y不一致/矛盾 |
| challenge | X挑战了Y的观点/发现 |
| concession | 虽然X，但是Y（让步转折） |
| contrary-expectation | 与预期相反 |
| tension | X和Y之间存在张力 |
| complicate | X使得问题更加复杂 |
| nuance | 实际情况比X更复杂/微妙 |
| paradox | 一个悖论是：X的同时Y |

### 4.3 研究空白与问题 (gaps.json)

| Cluster ID | 中文意思 |
|------------|----------|
| under-explored | 目前对X关注/研究不足 |
| open-question | 一个未解答的问题是 |
| limitation-prior | 现有研究的局限在于 |
| aim | 本文旨在考察/探讨 |
| specific-questions | 具体研究问题是 |
| address-gap | 为了回应这一空白 |
| extend | 本文拓展了X的研究 |
| puzzle | 一个令人困惑的现象是 |

### 4.4 描述前人工作 (prior-literature.json)

| Cluster ID | 中文意思 |
|------------|----------|
| established | 前人研究已经表明/证实 |
| growing-evidence | 越来越多的证据表明 |
| scholars-argue | 有学者指出/提出 |
| focused-on | 现有文献主要集中在 |
| mixed-findings | 研究结果并不一致 |
| dominant-view | 主流观点认为 |
| theoretical-framework | X理论认为 |
| distinction | X区分了A和B |

### 4.5 统计与结果报告 (statistics.json)

| Cluster ID | 中文意思 |
|------------|----------|
| significant-positive | X与Y显著正相关 |
| significant-negative | X与Y显著负相关 |
| not-significant | 系数不显著/无统计学意义 |
| coefficient-size | 系数的大小/效应量 |
| after-controlling | 控制了Z之后 |
| interaction | 交互效应/调节效应 |
| model-fit | 模型拟合度 |
| robustness | 稳健性检验表明 |
| magnitude | 效应的幅度/大小 |
| attenuation | 效应被削弱/中介掉了 |
| pattern | 呈现出某种模式/趋势 |
| subgroup | 在某子群体中 |

### 4.6 方法与数据 (methods.json)

| Cluster ID | 中文意思 |
|------------|----------|
| data-source | 本文使用了X数据 |
| sample-restriction | 样本限定为 |
| method-choice | 我们采用了X方法 |
| endogeneity | 为了解决内生性/选择偏误 |
| operationalize | 我们将X操作化为 |
| measure | X的测量方式是 |
| coding | 变量编码方式 |
| analytic-strategy | 分析策略概述 |

### 4.7 贡献与意义 (contributions.json)

| Cluster ID | 中文意思 |
|------------|----------|
| contribute-literature | 本文的贡献在于/推进了X文献 |
| methodological | 本文在方法上的创新 |
| empirical | 本文提供了新的经验证据 |
| policy-implication | 对政策的启示 |
| broaden | 本文拓宽了对X的理解 |
| first-to | 本文首次尝试 |
| bridge | 本文桥接了A和B两个文献 |

### 4.8 程度与比较 (degree-comparison.json)

| Cluster ID | 中文意思 |
|------------|----------|
| substantially | 显著地/大幅度地 |
| marginally | 略微地/边际地 |
| in-comparison | 相比之下 |
| more-than | X比Y更加 |
| to-some-extent | 在某种程度上 |
| disproportionately | 不成比例地/格外地 |
| uniformly-vs-varied | 一致地 vs 差异化地 |
| over-time | 随时间变化的趋势描述 |

---

## 五、界面与交互设计

### 5.1 总体布局

```
┌──────────────────────────────────────────────────────┐
│  Expression Trainer — 学术写作                    [⚙] │
├──────────┬───────────────────────────────────────────┤
│          │  [全部] [未掌握] [已收藏]     进度: 127/342 │
│ 因果与影响│───────────────────────────────────────────│
│  32/60 ██│  ┌─ X对Y有影响（动词用法）                 │
│          │  │                                         │
│ 矛盾与张力│  │  ● shape                                │
│  18/45 █░│  │    强调塑造、有方向性              [✓][★]│
│          │  │    Parental education shapes...          │
│ 研究空白  │  │                                         │
│   5/38 ░░│  │  ● drive                                │
│          │  │    强调是主要推动力                  [✓][★]│
│ 描述前人  │  │    Economic insecurity drives...         │
│  22/40 ██│  │                                         │
│          │  │  ● contribute to                         │
│ 统计报告  │  │    语气较弱，因果不确定时用         [✓][★]│
│  10/55 █░│  │    Field of study contributes to...      │
│          │  │                                         │
│ 方法数据  │  ├─ X对Y有影响（名词用法）                 │
│   8/32 ░░│  │                                         │
│          │  │  ● the effect of ... on                  │
│ 贡献意义  │  │    最通用，不暗示方向              [✓][★]│
│  15/28 █░│  │    ...                                  │
│          │  │                                         │
│ 程度比较  │  │  ● the ramifications of                 │
│  12/34 █░│  │    强调广泛深远的后果              [✓][★]│
│          │  │    ...                                  │
│          │  │                                         │
└──────────┴───────────────────────────────────────────┘
```

### 5.2 左侧栏：Category 导航

- 纵向列出所有 Category，每个显示中文名称 + 掌握进度（如 `32/60`）
- 进度用小型进度条可视化（颜色渐变：红→黄→绿）
- 点击切换主区域内容
- 当前选中的 Category 高亮
- 全部掌握的 Category 显示完成标记（✓）

### 5.3 主区域：Meaning Cluster 列表

- 顶部固定过滤栏：三个切换按钮「全部」「未掌握」「已收藏」+ 当前 Category 总进度
- 下方纵向排列所有 Meaning Cluster
- 每个 Cluster 的结构：
  - 标题行：中文意思（加粗显示），如"X对Y有影响（动词用法）"
  - 下方紧跟该族群的所有表达，每条表达一行
- 每条表达显示：
  - 英文表达（主要信息，字号略大）
  - note（差异说明，灰色小字）
  - 例句（浅色斜体，可折叠，默认显示）
  - 右侧两个小按钮：[✓] 标记已掌握、[★] 收藏

### 5.4 表达状态的视觉反馈

| 状态 | 视觉表现 |
|------|----------|
| 未掌握（默认）| 正常显示，全色 |
| 已掌握 | 文字变为浅灰色，降低透明度（opacity: 0.35），但不消失 |
| 已收藏 | 左侧显示黄色星标 |
| 已掌握 + 已收藏 | 浅灰 + 星标同时显示 |

### 5.5 过滤逻辑

| 过滤模式 | 显示规则 |
|----------|----------|
| 全部 | 显示所有 Cluster 和所有表达（已掌握的显示为灰色） |
| 未掌握 | 隐藏已掌握的表达；如果一个 Cluster 内所有表达都已掌握，隐藏整个 Cluster |
| 已收藏 | 只显示被收藏的表达；只显示含有收藏表达的 Cluster |

### 5.6 响应式设计

- 桌面端：左侧栏固定 + 主区域滚动（如上图布局）
- 移动端（可选）：左侧栏收起为顶部下拉菜单，主区域全屏

### 5.7 设计风格

- 整体走干净、editorial、书卷气的方向
- 背景使用暖色调（米色/暖白），避免纯白
- 英文表达用 serif 字体（如 Crimson Pro, Source Serif 4），增加阅读质感
- 中文用系统默认字体即可
- 不要花哨的动画，强调信息密度和阅读效率
- 颜色体系：深棕/深灰为主色调，星标用暖黄色，已掌握用浅灰，进度条用从暖红到暖绿的渐变

---

## 六、组件架构

```
App.jsx
├── Sidebar                    // 左侧 Category 导航
│   └── CategoryItem           // 单个 Category（名称 + 进度条）
├── MainArea
│   ├── FilterBar              // 顶部过滤器 + 进度统计
│   ├── ClusterList            // Cluster 列表容器
│   │   └── ClusterItem        // 单个意思族群
│   │       └── ExpressionRow  // 单条表达（含掌握/收藏按钮）
│   └── EmptyState             // 当过滤后无内容时的提示
└── hooks/
    ├── useProgress.js         // 读写 localStorage 的掌握/收藏状态
    └── useFilter.js           // 过滤逻辑
```

### 6.1 关键 Hook：useProgress

```javascript
// useProgress.js
// 管理 mastered 和 starred 两个 Set

export function useProgress() {
  // 从 localStorage 读取初始状态
  // 返回：
  //   mastered: Set<string>        — 已掌握的 expression ID 集合
  //   starred: Set<string>         — 已收藏的 expression ID 集合
  //   toggleMastered(id: string)   — 切换掌握状态
  //   toggleStarred(id: string)    — 切换收藏状态
  //   getMasteredCount(category)   — 获取某 Category 已掌握数
  //   getTotalCount(category)      — 获取某 Category 总表达数
  //
  // 每次变更自动写入 localStorage
}
```

### 6.2 关键 Hook：useFilter

```javascript
// useFilter.js

export function useFilter() {
  // 状态：'all' | 'unmastered' | 'starred'
  // 返回：
  //   filter: string
  //   setFilter(f: string)
  //   filterClusters(clusters, mastered, starred) → 过滤后的 clusters
  //     - 'all': 返回所有 clusters，不过滤表达
  //     - 'unmastered': 每个 cluster 只保留未掌握的表达，全掌握的 cluster 移除
  //     - 'starred': 每个 cluster 只保留已收藏的表达，无收藏的 cluster 移除
}
```

---

## 七、项目文件结构

```
expression-trainer/
├── public/
│   └── index.html
├── src/
│   ├── data/
│   │   └── academic/
│   │       ├── causality.json
│   │       ├── contradiction.json
│   │       ├── gaps.json
│   │       ├── prior-literature.json
│   │       ├── statistics.json
│   │       ├── methods.json
│   │       ├── contributions.json
│   │       ├── degree-comparison.json
│   │       └── index.js
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── CategoryItem.jsx
│   │   ├── FilterBar.jsx
│   │   ├── ClusterList.jsx
│   │   ├── ClusterItem.jsx
│   │   ├── ExpressionRow.jsx
│   │   └── EmptyState.jsx
│   ├── hooks/
│   │   ├── useProgress.js
│   │   └── useFilter.js
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── scripts/
│   └── extract-expressions-prompt.md
├── .github/
│   └── workflows/
│       └── deploy.yml
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## 八、AI 语料扩展工作流

### 8.1 提取 Prompt 模板

保存在 `scripts/extract-expressions-prompt.md`，AI agent 用此模板从论文中提取表达：

```markdown
# 学术表达提取指令

请阅读以下论文，提取值得中文母语学术写作者学习的英文表达。

## 提取标准
- 只提取**非平庸**的表达。忽略 "This paper examines"、"The results show" 这类过于基础的说法
- 优先提取：
  - 同一个意思的不常见但地道的说法
  - 精确的动词选择（如用 condition 代替 influence）
  - 有力的学术短语和搭配
  - 优雅的句式结构
- 每条表达必须标注与常见说法的差异（note 字段）

## 输出格式
严格按以下 JSON 格式输出，每条表达归入对应的 Category：

```json
{
  "source": "论文标题, 期刊, 年份",
  "extractions": [
    {
      "category": "causality | contradiction | gaps | prior-literature | statistics | methods | contributions | degree-comparison",
      "cluster_meaning": "中文意思描述（如果匹配已有 cluster 则使用已有描述）",
      "expression": {
        "en": "英文表达",
        "note": "与同义表达的差异/使用场景",
        "example": "论文中的原始例句",
        "register": "formal | neutral | literary"
      }
    }
  ]
}
```

## 论文内容
[在此粘贴论文文本]
```

### 8.2 扩展流程

1. 将论文文本 + 上述 prompt 喂给 Claude Code
2. AI 输出结构化 JSON
3. 人工 review：确认表达质量、检查 category 归属、补充 note
4. 将新表达追加到对应的 `src/data/academic/xxx.json` 文件中
5. `git commit && git push`，GitHub Pages 自动重新部署

### 8.3 去重逻辑

追加新表达前，检查 `en` 字段是否已存在于对应 Category 的任何 Cluster 中。如果已存在则跳过，避免重复。

---

## 九、第一期内容填充指引

### 9.1 每个 Cluster 的表达数量

- 目标：每个 Cluster 4-8 条表达
- 必须包含 1-2 条"基础但必须会的"表达（如 affect, influence）
- 必须包含 2-3 条"进阶可替换"表达（如 shape, condition）
- 可选包含 1-2 条"高级/文雅"表达（如 bear on, give rise to）

### 9.2 note 字段的写作要求

note 不是翻译，不是定义，而是**差异说明**：
- ✅ "强调塑造、有方向性，暗示长期结构性影响"
- ✅ "语气较弱，适合因果关系不确定时使用"
- ✅ "较书面，常见于理论讨论"
- ❌ "意思是影响"（这是翻译，没有区分度）
- ❌ "a word meaning to influence"（废话）

### 9.3 例句的选取要求

- 优先使用社会学、人口学语境的例句
- 例句要完整（不是片段），让用户看到表达在句子中的位置和搭配
- 例句长度控制在一行以内（不超过 20 词为佳）

### 9.4 第一期填充优先级

1. **statistics.json** — 每篇论文都要用，训练价值最高，优先填充
2. **causality.json** — 社会科学核心逻辑，高频使用
3. **contradiction.json** — 文献综述和讨论部分高频使用
4. **gaps.json** — 引言部分核心
5. 其余按需填充

---

## 十、后续迭代方向（不在第一期范围内）

- **搜索功能**：输入中文关键词（如"影响"），跨 Category 检索所有相关族群
- **数据导出**：将已收藏的表达导出为 Markdown/CSV，方便打印或导入其他工具
- **训练统计**：记录每天训练时长、新掌握表达数，可视化学习曲线
- **多领域支持**：除学术写作外，增加日常口语交流模块（独立数据集和交互逻辑）
- **Anki 导出**：将未掌握的表达自动生成 Anki 卡片导出
