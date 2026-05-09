# 学术口语与日常交流表达训练器 — 项目方案与技术规格

## 一、项目概述

### 1.1 背景与目标

面向中文母语的在英语环境工作的博士生和青年学者，解决口语输出表达贫乏的问题。用户在学术会议、系里日常、社交活动中，经常遇到"知道要说什么意思但英文蹦不出来"或"只会最基础的一种说法"的困境。

本模块与学术写作训练器是同一个网站项目的两个平行部分，共享技术栈和交互逻辑，但数据结构有所不同。学术写作侧重"意思族群"（一个意图对应多种表达），口语交流侧重**"场景 + 对话 + 万能表达"三层结构**。

### 1.2 核心设计理念

- **场景驱动**：所有表达都锚定在具体的、用户真实会遇到的交际场景中，而不是抽象的语法分类
- **对话为骨架**：每个细分场景提供 2-3 段真实感的中英对照示范对话，用户通过反复阅读对话来感受表达的实际使用语境
- **万能表达为提取物**：从对话中提取出"不管具体聊什么内容，这个场景下都能用"的高频句式和表达，组织成意思族群，供用户重点训练
- **同样的渐进聚焦机制**：与学术写作模块一样，支持标记已掌握/收藏，过滤只看未掌握的内容

### 1.3 与学术写作模块的关系

```
expression-trainer/（同一个项目）
├── 学术写作（Tab 1）    → 意思族群列表 → 快速扫读训练
├── 口语交流（Tab 2）    → 场景 → 对话 + 万能表达 → 扫读训练
└── 共享：技术栈、进度系统、过滤逻辑、设计风格
```

顶部用 Tab 或导航栏切换两个模块。

---

## 二、技术栈与架构

### 2.1 与学术写作模块共享

- 同一个 React + Vite 项目
- 同一套 Tailwind CSS 样式体系
- 同一套 localStorage 进度管理（useProgress hook 复用）
- 同一个 GitHub Pages 部署

### 2.2 数据文件位置

```
src/data/
├── academic/          # 学术写作语料（已有）
│   ├── causality.json
│   └── ...
├── oral/              # 口语交流语料（本模块）
│   ├── giving-talks.json
│   ├── handling-qa.json
│   ├── asking-questions.json
│   ├── conference-networking.json
│   ├── hallway-elevator.json
│   ├── coffee-lunch.json
│   ├── advisor-informal.json
│   ├── visiting-scholars.json
│   ├── department-social.json
│   ├── conference-dinner.json
│   ├── casual-drinks.json
│   ├── followup-emails.json
│   ├── declining-invitations.json
│   └── index.js
└── index.js           # 统一导出 academic + oral
```

---

## 三、数据架构

### 3.1 层级结构

```
Domain（领域）: 口语交流
  └── Scene（大场景）: 会议与学术报告
        └── Sub-scene（细分场景）: 被提问 — Handling Q&A
              ├── Dialogues（示范对话）: 2-3段中英对照对话
              └── Universal Expressions（万能表达族群）:
                    └── Meaning Cluster: "买时间思考" → That's a great question / Let me think...
```

### 3.2 JSON Schema — Sub-scene 文件

每个细分场景一个 JSON 文件。结构如下：

```json
{
  "id": "handling-qa",
  "scene": "conference",
  "name": "被提问",
  "nameEn": "Handling Q&A",
  "description": "你刚做完报告，进入Q&A环节。有人举手提问，可能是友善的追问，也可能是尖锐的质疑。你需要接住问题、从容回应。",
  
  "dialogues": [
    {
      "id": "qa-friendly",
      "title": "友善的方法论追问",
      "context": "一位同领域的学者对你的识别策略感兴趣，语气友好地追问细节。",
      "lines": [
        {
          "speaker": "audience",
          "en": "Thanks for the presentation. I was curious about your identification strategy — have you considered using an instrumental variable approach instead?",
          "zh": "谢谢你的报告。我对你的识别策略很好奇——你有没有考虑过用工具变量方法？"
        },
        {
          "speaker": "you",
          "en": "That's a great question, thank you. We did consider IV estimation early on, but finding a valid instrument proved challenging given our data structure. What we opted for instead was a sensitivity analysis following Oster's approach, which I think gets at a similar concern.",
          "zh": "好问题，谢谢。我们早期确实考虑过IV估计，但受限于数据结构，找到有效的工具变量比较困难。我们最终选择了按照Oster方法做敏感性分析，我认为这回应了类似的顾虑。",
          "highlights": ["That's a great question", "We did consider", "What we opted for instead was", "which I think gets at a similar concern"]
        },
        {
          "speaker": "audience",
          "en": "That makes sense. And just a quick follow-up — does the pattern hold when you restrict the sample to urban residents?",
          "zh": "有道理。再追问一下——如果你把样本限定在城市居民，这个模式还成立吗？"
        },
        {
          "speaker": "you",
          "en": "Yes, actually, the results are quite robust to that restriction. I have it in the appendix — I'd be happy to walk you through it after the session.",
          "zh": "是的，结果在这个限定下相当稳健。我在附录里有，session结束后我很乐意跟你详细说。",
          "highlights": ["the results are quite robust to", "I'd be happy to walk you through it after the session"]
        }
      ]
    },
    {
      "id": "qa-challenging",
      "title": "带有质疑的提问",
      "context": "一位资深学者对你的核心发现提出质疑，语气虽然礼貌但明显不同意你的结论。",
      "lines": [
        {
          "speaker": "audience",
          "en": "I appreciate the ambitious scope of this paper. But I'm not entirely convinced that your measure of precarious work captures what you claim it does. Couldn't this simply reflect selection into certain occupations?",
          "zh": "我很欣赏这篇论文的雄心。但我不太确信你的不稳定工作测量真的能捕捉到你声称的东西。这难道不可能只是反映了某些职业的选择效应吗？"
        },
        {
          "speaker": "you",
          "en": "I think that's a really fair concern, and it's one we've thought about carefully. You're right that occupational selection is a potential confound. We address this in two ways: first, we control for a rich set of pre-labor-market characteristics, and second, we show in a supplementary analysis that the results hold within occupational categories. That said, I fully acknowledge this doesn't eliminate selection entirely — it's something we flag in the limitations.",
          "zh": "我觉得这个顾虑非常合理，也是我们仔细考虑过的。你说得对，职业选择是一个潜在的混淆因素。我们从两方面应对：首先，我们控制了丰富的劳动力市场前特征；其次，我们在补充分析中展示了结果在职业类别内仍然成立。话虽如此，我完全承认这并不能彻底消除选择效应——这一点我们在局限性中有提到。",
          "highlights": ["I think that's a really fair concern", "it's one we've thought about carefully", "You're right that", "We address this in two ways", "That said, I fully acknowledge", "it's something we flag in the limitations"]
        }
      ]
    }
  ],

  "universalExpressions": [
    {
      "id": "qa-acknowledge",
      "meaning": "接住问题、表示感谢",
      "expressions": [
        {
          "id": "qa-ack-01",
          "en": "That's a great question.",
          "note": "最通用、最安全的回应开场白",
          "register": "neutral"
        },
        {
          "id": "qa-ack-02",
          "en": "Thank you for raising that.",
          "note": "略正式，适合回应深思熟虑的问题",
          "register": "formal"
        },
        {
          "id": "qa-ack-03",
          "en": "I think that's a really fair concern.",
          "note": "对方提出质疑时用，承认其合理性",
          "register": "formal"
        },
        {
          "id": "qa-ack-04",
          "en": "I appreciate you bringing that up.",
          "note": "语气温和，适合敏感话题",
          "register": "formal"
        }
      ]
    },
    {
      "id": "qa-buytime",
      "meaning": "买时间思考",
      "expressions": [
        {
          "id": "qa-bt-01",
          "en": "Let me think about that for a moment.",
          "note": "直白坦诚，没有任何问题",
          "register": "neutral"
        },
        {
          "id": "qa-bt-02",
          "en": "That's an interesting angle — I haven't thought about it quite that way.",
          "note": "既买时间又夸对方，高情商回应",
          "register": "neutral"
        },
        {
          "id": "qa-bt-03",
          "en": "If I understand correctly, you're asking whether…",
          "note": "通过复述问题来争取思考时间",
          "register": "neutral"
        },
        {
          "id": "qa-bt-04",
          "en": "I think there are a couple of ways to approach that.",
          "note": "先抛出框架再逐步展开，给自己缓冲",
          "register": "neutral"
        }
      ]
    },
    {
      "id": "qa-admit-limitation",
      "meaning": "坦诚承认局限",
      "expressions": [
        {
          "id": "qa-al-01",
          "en": "That's a limitation I fully acknowledge.",
          "note": "直接承认，不遮掩",
          "register": "formal"
        },
        {
          "id": "qa-al-02",
          "en": "You're right, and it's something we flag in the paper.",
          "note": "承认对方正确 + 表明你已经意识到",
          "register": "neutral"
        },
        {
          "id": "qa-al-03",
          "en": "That's beyond the scope of what we could address with these data, but it's a great direction for future work.",
          "note": "承认局限但转化为积极方向",
          "register": "formal"
        },
        {
          "id": "qa-al-04",
          "en": "I think that's an empirical question we can't fully resolve here, but we try to get at it through…",
          "note": "承认无法完全解决但展示你做了努力",
          "register": "formal"
        }
      ]
    },
    {
      "id": "qa-defer",
      "meaning": "延后处理 / 邀请会后详谈",
      "expressions": [
        {
          "id": "qa-df-01",
          "en": "I'd love to discuss this in more detail after the session.",
          "note": "最自然的会后邀约",
          "register": "neutral"
        },
        {
          "id": "qa-df-02",
          "en": "That's a bigger question than I can do justice to in two minutes — can we continue over coffee?",
          "note": "带一点幽默，不显得在逃避",
          "register": "casual"
        },
        {
          "id": "qa-df-03",
          "en": "I have some supplementary results that speak to that — happy to share them with you afterward.",
          "note": "暗示你有准备，增强可信度",
          "register": "neutral"
        }
      ]
    }
  ]
}
```

### 3.3 字段说明

**Dialogue 相关字段：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `dialogue.id` | string | 是 | 对话唯一标识 |
| `dialogue.title` | string | 是 | 对话标题，描述情境类型 |
| `dialogue.context` | string | 是 | 中文情景描述，2-3句话说清楚场景 |
| `line.speaker` | string | 是 | `"you"` 或 `"audience"` / `"colleague"` / `"advisor"` 等 |
| `line.en` | string | 是 | 英文对话内容 |
| `line.zh` | string | 条件 | 中文翻译，仅 speaker 为 `"you"` 时必填（这是你要学会说的） |
| `line.highlights` | string[] | 否 | 对话中值得特别注意的表达片段，UI 中加粗或高亮显示 |

**Universal Expression 相关字段：**

与学术写作模块的 Meaning Cluster 结构完全一致（复用同一套组件和 schema），包含 `id`, `meaning`, `expressions[]`，每条表达含 `en`, `note`, `register`。唯一区别是口语模块一般不需要 `example` 字段（因为对话本身就是例句）。

### 3.4 用户进度存储

与学术写作共用同一个 localStorage 对象。表达的 ID 全局唯一（如 `qa-ack-01`），mastered 和 starred 集合不区分来自哪个模块。

---

## 四、场景分类体系与内容规划

### 4.1 总览

```
口语交流
├── 一、会议与学术报告 (Conference & Presentations)
│   ├── 1.1 做报告 (Giving a Talk)
│   ├── 1.2 被提问 (Handling Q&A)
│   ├── 1.3 向别人提问 (Asking Questions)
│   └── 1.4 会议间隙社交 (Conference Networking)
│
├── 二、系里日常 (Department Daily Life)
│   ├── 2.1 走廊/电梯偶遇 (Hallway & Elevator)
│   ├── 2.2 午饭/Coffee break (Lunch & Coffee)
│   ├── 2.3 和导师非正式交流 (Informal Chat with Advisor)
│   └── 2.4 和来访学者交流 (Talking to Visiting Scholars)
│
├── 三、社交活动 (Social Events)
│   ├── 3.1 系里聚餐/聚会 (Department Gatherings)
│   ├── 3.2 会议晚宴 (Conference Dinner)
│   └── 3.3 非正式聚会/喝酒 (Casual Drinks)
│
└── 四、高频书面输出 (Frequent Written Output)
    ├── 4.1 会后跟进邮件 (Follow-up Emails)
    └── 4.2 婉拒邀请 (Declining Invitations)
```

### 4.2 详细内容规划

以下为每个细分场景的对话设计指引和万能表达族群规划。

---

#### 1.1 做报告 (giving-talks.json)

**对话设计：**

| 对话 ID | 情境 | 描述 |
|---------|------|------|
| talk-opening | 开场 | 你站在台上，投影已经打开，主持人刚介绍完你。你需要做自我介绍、说明报告标题和结构。 |
| talk-transition | 中间过渡 | 你讲完了文献综述部分，需要过渡到数据和方法。 |
| talk-figure | 解释图表 | 你翻到一页有柱状图的幻灯片，需要引导听众看关键数字。 |
| talk-closing | 收尾总结 | 你讲到最后一页，需要总结要点、说明贡献、邀请提问。 |

**万能表达族群：**

| Cluster ID | 中文意思 |
|------------|----------|
| talk-selfintro | 开场自我介绍 |
| talk-outline | 说明报告结构 |
| talk-signpost | 引导听众注意力 / 过渡到下一部分 |
| talk-figure-intro | 引导看图表 |
| talk-figure-describe | 描述图表趋势/数字 |
| talk-emphasize | 强调关键发现 |
| talk-summarize | 总结要点 |
| talk-invite-qa | 邀请提问 |

---

#### 1.2 被提问 (handling-qa.json)

**对话设计：**

| 对话 ID | 情境 | 描述 |
|---------|------|------|
| qa-friendly | 友善的方法论追问 | 同领域学者友好地追问识别策略细节。 |
| qa-challenging | 带有质疑的提问 | 资深学者质疑你的核心测量是否有效。 |
| qa-tangential | 离题的提问 | 有人问了一个跟你论文关系不大的问题。 |

**万能表达族群：**

| Cluster ID | 中文意思 |
|------------|----------|
| qa-acknowledge | 接住问题、表示感谢 |
| qa-buytime | 买时间思考 |
| qa-reframe | 重新框定问题 |
| qa-answer-direct | 直接回答 |
| qa-admit-limitation | 坦诚承认局限 |
| qa-defer | 延后处理 / 邀请会后详谈 |
| qa-redirect | 把离题问题拉回来 |

---

#### 1.3 向别人提问 (asking-questions.json)

**对话设计：**

| 对话 ID | 情境 | 描述 |
|---------|------|------|
| ask-method | 追问方法细节 | 你对报告人的样本选择或分析策略有疑问。 |
| ask-polite-challenge | 礼貌地质疑 | 你觉得报告人的某个结论推得太远了。 |
| ask-extension | 追问拓展可能 | 你觉得对方的研究可以延伸到你关注的领域。 |

**万能表达族群：**

| Cluster ID | 中文意思 |
|------------|----------|
| ask-compliment-first | 先肯定再提问 |
| ask-clarification | 请求澄清某个点 |
| ask-methodology | 追问方法论 |
| ask-challenge-polite | 礼貌地表达不同意 |
| ask-counterfactual | "如果X的话会怎样"式追问 |
| ask-connection | 把对方的研究和你的联系起来 |

---

#### 1.4 会议间隙社交 (conference-networking.json)

**对话设计：**

| 对话 ID | 情境 | 描述 |
|---------|------|------|
| net-intro | 主动自我介绍 | 你在茶歇时走向一个你读过论文的学者。 |
| net-approached | 被别人搭话 | 有人听了你的报告后走过来跟你聊。 |
| net-goodbye | 告别换人 | 你聊了几分钟，想得体地结束对话去跟别人聊。 |

**万能表达族群：**

| Cluster ID | 中文意思 |
|------------|----------|
| net-introduce | 自我介绍 + 说自己做什么 |
| net-ask-research | 问对方在做什么研究 |
| net-find-common | 找共同兴趣/联系点 |
| net-exchange-contact | 交换联系方式 |
| net-wrap-up | 得体地结束对话 |
| net-follow-up-intent | 表达"保持联系"的意愿 |

---

#### 2.1 走廊/电梯偶遇 (hallway-elevator.json)

**对话设计：**

| 对话 ID | 情境 | 描述 |
|---------|------|------|
| hall-quick-hi | 快速打招呼 | 走廊里擦肩而过，只有几秒钟。 |
| hall-elevator | 电梯里聊两句 | 和同事一起等电梯/在电梯里，有30秒到1分钟。 |
| hall-catch-up | 好久没见 | 好几周没见的同事，多聊几句近况。 |

**万能表达族群：**

| Cluster ID | 中文意思 |
|------------|----------|
| hall-greet-beyond-howareyou | 比 "How are you" 更自然的招呼 |
| hall-quick-status | 简短近况交流 |
| hall-graceful-exit | 得体地快速结束对话 |

---

#### 2.2 午饭/Coffee break (coffee-lunch.json)

**对话设计：**

| 对话 ID | 情境 | 描述 |
|---------|------|------|
| lunch-invite | 约同事吃饭 | 快到中午了，你想约旁边的同事一起出去吃。 |
| lunch-food-chat | 聊食物 | 在餐厅吃饭时聊菜好不好吃、推荐餐厅。 |
| lunch-weekend | 聊周末计划 | 周五午饭时聊周末打算做什么。 |
| coffee-workload | 吐槽工作量 | Coffee break 时跟同事吐槽最近很忙。 |

**万能表达族群：**

| Cluster ID | 中文意思 |
|------------|----------|
| lunch-invite-casual | 随意地约吃饭 |
| lunch-food-comment | 评价食物/推荐餐厅 |
| lunch-weekend-ask | 问/聊周末计划 |
| lunch-complain-light | 轻松地吐槽（忙、累、天气、交通）|
| lunch-react-news | 回应别人分享的消息 |

---

#### 2.3 和导师非正式交流 (advisor-informal.json)

**对话设计：**

| 对话 ID | 情境 | 描述 |
|---------|------|------|
| adv-hallway-update | 走廊偶遇简短汇报 | 导师在走廊碰到你，随口问你进展。 |
| adv-paper-discuss | 随口聊一篇论文 | 你们都看了一篇新出的论文，非正式地交流看法。 |
| adv-ask-advice | 随口请教 | 你遇到一个方法问题，趁导师有空随口问一下。 |

**万能表达族群：**

| Cluster ID | 中文意思 |
|------------|----------|
| adv-casual-update | 非正式地汇报进展 |
| adv-ask-casually | 随口请教一个问题 |
| adv-react-to-question | 导师问你近况时怎么自然回应 |
| adv-discuss-paper | 聊一篇论文的看法 |

---

#### 2.4 和来访学者交流 (visiting-scholars.json)

**对话设计：**

| 对话 ID | 情境 | 描述 |
|---------|------|------|
| visit-welcome | 接待来访学者 | 来访学者第一天到系里，你被安排带他/她转一转。 |
| visit-research | 聊研究交集 | 午饭时跟来访学者聊各自的研究。 |
| visit-city-tips | 推荐本地生活 | 来访学者问你这个城市有什么好吃好玩的。 |

**万能表达族群：**

| Cluster ID | 中文意思 |
|------------|----------|
| visit-welcome | 欢迎 + 带人参观 |
| visit-ask-background | 问对方学校和研究背景 |
| visit-find-overlap | 找研究交集 |
| visit-recommend-local | 推荐本地吃喝玩乐 |

---

#### 3.1 系里聚餐/聚会 (department-social.json)

**对话设计：**

| 对话 ID | 情境 | 描述 |
|---------|------|------|
| dept-introduce-others | 介绍人认识 | 你的两个朋友/同事不认识彼此，你来引荐。 |
| dept-compliment | 夸赞场合 | 夸食物好吃、夸活动组织得好、夸某人的报告讲得好。 |
| dept-exit-conversation | 从一段对话中抽身 | 你跟一个人聊了一会儿，想去跟别人也聊聊。 |

**万能表达族群：**

| Cluster ID | 中文意思 |
|------------|----------|
| social-introduce-people | 介绍两个人互相认识 |
| social-compliment | 夸赞（食物、场地、活动、别人的工作）|
| social-exit-gracefully | 得体地从对话中抽身 |
| social-keep-going | 维持对话不冷场 |

---

#### 3.2 会议晚宴 (conference-dinner.json)

**对话设计：**

| 对话 ID | 情境 | 描述 |
|---------|------|------|
| dinner-icebreak | 跟陌生人破冰 | 你被安排在一桌不认识的人旁边，需要开始聊天。 |
| dinner-city-travel | 聊城市和旅行 | 你们开始聊这次来开会的城市，聊旅行经历。 |
| dinner-dietary | 饮食沟通 | 服务员来点餐，你需要沟通饮食偏好/过敏。 |

**万能表达族群：**

| Cluster ID | 中文意思 |
|------------|----------|
| dinner-icebreak | 跟陌生人破冰开场 |
| dinner-travel-chat | 聊旅行/这个城市 |
| dinner-dietary | 沟通饮食偏好 |
| dinner-sustain | 维持对话的万能问题和回应 |

---

#### 3.3 非正式聚会/喝酒 (casual-drinks.json)

**对话设计：**

| 对话 ID | 情境 | 描述 |
|---------|------|------|
| drinks-casual | 轻松聊天 | 会后或周五晚上跟同事喝酒，聊非学术话题。 |
| drinks-humor | 玩笑和幽默 | 有人开了个玩笑，你需要接住或者也来一个。 |

**万能表达族群：**

| Cluster ID | 中文意思 |
|------------|----------|
| drinks-non-academic | 聊非学术话题的开场和话题 |
| drinks-react-humor | 回应幽默 / 轻松的应和 |
| drinks-order | 点酒/饮料的表达 |
| drinks-toast | 敬酒/祝福 |

---

#### 4.1 会后跟进邮件 (followup-emails.json)

**对话设计：**（此场景用邮件示范代替对话）

| 对话 ID | 情境 | 描述 |
|---------|------|------|
| email-nice-meeting | 认识新人后跟进 | 会上认识了一位学者，回去后写邮件保持联系。 |
| email-request-paper | 要论文/数据 | 听了一个好报告，想问对方要 working paper 或数据。 |

**万能表达族群：**

| Cluster ID | 中文意思 |
|------------|----------|
| email-opening | 邮件开头（"很高兴认识你"的多种说法）|
| email-reference-meeting | 提及你们在哪认识的 |
| email-request-polite | 礼貌地提出请求 |
| email-closing | 邮件结尾（期待回复的多种说法）|

---

#### 4.2 婉拒邀请 (declining-invitations.json)

**对话设计：**

| 对话 ID | 情境 | 描述 |
|---------|------|------|
| decline-review | 婉拒审稿邀请 | 期刊编辑邀请你审稿，但你时间不够。 |
| decline-event | 婉拒参加活动 | 有人邀请你参加一个workshop但你去不了。 |

**万能表达族群：**

| Cluster ID | 中文意思 |
|------------|----------|
| decline-appreciate | 先表示感谢/荣幸 |
| decline-reason | 给出得体的理由 |
| decline-alternative | 提供替代方案 |
| decline-future | 表达未来合作意愿 |

---

## 五、界面与交互设计

### 5.1 总体布局

与学术写作模块保持一致的框架，但内容区分为两个板块：

```
┌────────────────────────────────────────────────────────┐
│  Expression Trainer    [学术写作] [口语交流]        [⚙]  │
├──────────┬─────────────────────────────────────────────┤
│          │  [全部] [未掌握] [已收藏]                     │
│ ◆ 会议报告│─────────────────────────────────────────────│
│          │                                              │
│ 1.1 做报告│  ◼ 被提问 Handling Q&A                      │
│ 1.2 被提问│  ─────────────────────────                  │
│ 1.3 提问  │  你刚做完报告，进入Q&A环节。有人举手提问，     │
│ 1.4 社交  │  可能是友善的追问，也可能是尖锐的质疑。       │
│          │                                              │
│ ◆ 系里日常│  ▸ 对话：友善的方法论追问                     │
│          │  ┌──────────────────────────────────┐       │
│ 2.1 走廊  │  │ 🎓 Thanks for the presentation.  │       │
│ 2.2 午饭  │  │    I was curious about your...   │       │
│ 2.3 导师  │  │                                  │       │
│ 2.4 来访  │  │ 🙋 That's a great question,     │       │
│          │  │    thank you. We did consider...  │       │
│ ◆ 社交活动│  │    那是个好问题。我们确实考虑过…  │       │
│          │  └──────────────────────────────────┘       │
│ 3.1 聚餐  │                                              │
│ 3.2 晚宴  │  ▸ 对话：带有质疑的提问                      │
│ 3.3 喝酒  │  [折叠状态，点击展开]                         │
│          │                                              │
│ ◆ 书面输出│  ═══ 万能表达 ═══                            │
│          │                                              │
│ 4.1 跟进  │  ┌─ 接住问题、表示感谢                       │
│ 4.2 婉拒  │  │  ● That's a great question.              │
│          │  │    最通用最安全的开场白           [✓][★]   │
│          │  │  ● Thank you for raising that.             │
│          │  │    略正式，回应深思熟虑的问题     [✓][★]   │
│          │  │  ● I think that's a fair concern.          │
│          │  │    对方质疑时用，承认其合理性     [✓][★]   │
│          │  │                                            │
│          │  ├─ 买时间思考                                │
│          │  │  ● Let me think about that...              │
│          │  │  ● That's an interesting angle...          │
│          │  │  ...                                       │
└──────────┴──────────────────────────────────────────────┘
```

### 5.2 内容区结构（每个细分场景页面）

从上到下依次是：

1. **场景标题 + 英文名**（如"被提问 Handling Q&A"）
2. **情景描述**（灰色斜体，中文，2-3句话）
3. **示范对话区**
   - 每段对话可折叠/展开，默认第一段展开
   - 对话标题 + 情境描述
   - 对话内容以聊天气泡形式呈现（不是 table，而是类似 iMessage 的气泡排列）
   - `speaker: "you"` 的气泡显示在右侧，附带中文翻译（灰色小字，在英文下方）
   - `speaker: "audience/colleague/..."` 的气泡显示在左侧，不需要翻译
   - `highlights` 中的表达在气泡内加粗或用底色标出
4. **分隔线**
5. **万能表达区**
   - 标题"万能表达"
   - 与学术写作模块完全相同的 Meaning Cluster 列表格式
   - 每个 Cluster：中文意思 → 下列所有表达 → [✓][★] 按钮
   - 支持同样的过滤逻辑（全部/未掌握/已收藏）

### 5.3 过滤逻辑（与学术写作的差异）

| 过滤模式 | 对话区 | 万能表达区 |
|----------|--------|------------|
| 全部 | 正常显示所有对话 | 显示所有表达（已掌握的灰色）|
| 未掌握 | 正常显示（对话不受过滤影响）| 只显示未掌握的表达和含未掌握表达的 Cluster |
| 已收藏 | 正常显示 | 只显示已收藏的表达 |

注意：对话区不参与过滤，因为对话是完整的上下文，不应被拆散。过滤只影响下方的万能表达区。

### 5.4 对话气泡设计

```
┌──────────────────────────────────────┐
│                                      │
│              ┌──────────────────────┐│
│              │ Thanks for the       ││  ← 左侧：对方说的
│              │ presentation. I was  ││
│              │ curious about...     ││
│              └──────────────────────┘│
│                                      │
│ ┌──────────────────────┐             │
│ │ **That's a great     │             │  ← 右侧：你说的
│ │ question**, thank    │             │     highlights 加粗
│ │ you. We did consider │             │
│ │ IV estimation...     │             │
│ │                      │             │
│ │ 好问题，谢谢。我们   │             │  ← 中文翻译，灰色小字
│ │ 早期确实考虑过…      │             │
│ └──────────────────────┘             │
│                                      │
└──────────────────────────────────────┘
```

---

## 六、组件架构

```
App.jsx
├── TopNav                        // 顶部导航：[学术写作] [口语交流]
├── AcademicModule                // 学术写作模块（已有）
└── OralModule                    // 口语交流模块
    ├── SceneSidebar              // 左侧场景导航（大场景 > 细分场景）
    │   ├── SceneGroup            // 大场景分组（可折叠）
    │   └── SubSceneItem          // 细分场景条目（含进度）
    ├── SubSceneContent           // 主内容区
    │   ├── SceneHeader           // 标题 + 情景描述
    │   ├── DialogueSection       // 对话区
    │   │   └── DialogueCard      // 单段对话（可折叠）
    │   │       └── ChatBubble    // 单条对话气泡
    │   ├── Divider
    │   └── UniversalExpressions  // 万能表达区（复用 ClusterList + ClusterItem）
    └── FilterBar                 // 复用学术写作的过滤栏
```

### 6.1 可复用组件（与学术写作模块共享）

- `FilterBar` — 过滤器（全部/未掌握/已收藏）
- `ClusterItem` — 意思族群显示
- `ExpressionRow` — 单条表达（含 [✓][★] 按钮）
- `useProgress` hook — 进度管理
- `useFilter` hook — 过滤逻辑

### 6.2 新增组件（口语模块独有）

- `SceneSidebar` — 带分组的场景导航
- `DialogueCard` — 对话卡片（可折叠，含上下文描述）
- `ChatBubble` — 对话气泡（区分 you/other，支持 highlights 高亮和中文翻译）

---

## 七、AI 语料扩展工作流

### 7.1 对话生成 Prompt 模板

保存在 `scripts/generate-dialogue-prompt.md`：

```markdown
# 口语对话场景生成指令

请为以下场景生成真实自然的英文学术对话。

## 场景信息
- 场景名称：[填入]
- 具体情境：[填入，如"会议Q&A环节，有人礼貌地质疑你的变量测量"]
- 对话参与者：[如"你（社会学博士生）和一位资深人口学教授"]

## 要求
1. 对话要自然真实，不要教科书腔
2. 你（speaker: "you"）的对话必须附中文翻译
3. 标注 highlights：值得学习的表达片段
4. 对话长度：4-8 轮（每人说 2-4 次）
5. 体现该场景的典型交际策略（如 Q&A 中的"先承认再反驳"策略）

## 输出格式
严格按照以下 JSON 格式输出：
[提供 dialogue JSON schema]
```

### 7.2 万能表达提取 Prompt 模板

```markdown
# 万能表达提取指令

请基于以下对话场景，提取该场景下的"万能表达"——即不管具体聊什么内容，在这个场景下都能用的高频句式和表达。

## 场景：[填入]
## 已有对话：[粘贴对话]

## 要求
1. 按意思分组，每组是一个 Meaning Cluster
2. 每条表达标注与同组其他表达的差异（note 字段）
3. 标注 register（formal / neutral / casual）
4. 每组 3-6 条表达

## 输出格式
[提供 universalExpressions JSON schema]
```

---

## 八、第一期内容填充指引

### 8.1 优先级

1. **1.2 被提问 (handling-qa.json)** — 博士生最焦虑、最需要练习的场景
2. **1.1 做报告 (giving-talks.json)** — 高频刚需
3. **1.3 向别人提问 (asking-questions.json)** — 学术社交的核心技能
4. **2.2 午饭/Coffee break** — 日常高频
5. **1.4 会议间隙社交** — 会议场景的补充
6. 其余按需填充

### 8.2 每个场景的内容量

- 对话：2-3 段，每段 4-8 轮
- 万能表达族群：4-8 个 Cluster，每个 Cluster 3-6 条表达
- 第一期总计约 15 个场景 × 平均 5 个 Cluster × 平均 4 条表达 ≈ 300 条口语表达

### 8.3 对话写作原则

- **真实感**：对话应该像真人说的，有停顿词（well, I mean, actually）、有不完美的句子结构
- **策略性**：每段对话要体现一种交际策略（如"先肯定再质疑"、"买时间再回答"），而不是单纯展示词汇
- **中文翻译风格**：口语化的中文，不要翻译腔。"好问题，谢谢" 而不是"那是一个好问题，谢谢你"
- **highlights 的选取**：只标注真正值得学的表达，不要标注 "Thank you" 这种基础表达

---

## 九、后续迭代方向（不在第一期范围内）

- **语音朗读**：集成 Web Speech API，让用户可以听万能表达的发音和语调
- **角色扮演模式**：对话区变成交互模式，隐藏 "you" 的台词让用户自己说/打字，然后对比
- **录音回放**：用户录下自己的口语练习，与原文对比
- **场景随机抽取**：随机展示一个场景 + 对应的万能表达，模拟"突然被搭话"的临场感
- **跨场景万能表达汇总**：提取所有场景中重复出现的高频表达（如 "I'd love to" / "That makes sense"），做一个"终极万能表达"列表
