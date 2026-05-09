# 口语对话场景生成指令

请为以下场景生成真实自然的英文学术对话，并提取该场景下可复用的万能表达。

## 场景信息

- 场景名称：[填入]
- 具体情境：[填入，如"会议 Q&A 环节，有人礼貌地质疑你的变量测量"]
- 对话参与者：[填入，如"你（社会学博士生）和一位资深人口学教授"]

## 对话要求

1. 对话要自然真实，不要教科书腔
2. `speaker: "you"` 的每条对话必须附 `zh` 中文翻译
3. 标注 `highlights`：值得学习的表达片段
4. 每段对话长度为 4-8 轮，每人说 2-4 次
5. 体现该场景的典型交际策略，例如先承认再回应、争取思考时间、礼貌转向、邀请会后详谈
6. 中文字段用中文，英文表达本身用英文

## 万能表达要求

1. 按意思分组，每组是一个 Meaning Cluster
2. 每条表达标注与同组其他表达的差异，写在 `note` 字段
3. `note` 不要写翻译或定义
4. 标注 `register`：`formal | neutral | casual`
5. 每组 3-6 条表达

## 输出格式

严格按照以下 JSON 结构输出：

```json
{
  "id": "scene-id",
  "scene": "conference | department | daily",
  "name": "中文场景名",
  "nameEn": "English Scene Name",
  "description": "中文场景描述，2-3句话说清楚使用情境",
  "dialogues": [
    {
      "id": "dialogue-id",
      "title": "中文对话标题",
      "context": "中文情境描述",
      "lines": [
        {
          "speaker": "audience",
          "en": "English line."
        },
        {
          "speaker": "you",
          "en": "English response.",
          "zh": "中文翻译。",
          "highlights": ["useful phrase", "another useful phrase"]
        }
      ]
    }
  ],
  "universalExpressions": [
    {
      "id": "cluster-id",
      "meaning": "中文意思族群",
      "expressions": [
        {
          "id": "expression-id",
          "en": "Reusable English expression.",
          "note": "与同族其他表达的差异说明，不能写翻译",
          "register": "formal | neutral | casual"
        }
      ]
    }
  ]
}
```

## Review 要点

- 检查对话是否像真实会议或日常学术交流，而不是课堂范文
- 检查所有 `you` 的 line 是否都有 `zh`
- 检查 `highlights` 是否确实出现在对应英文句子中
- 检查 `universalExpressions` 是否足够通用，能迁移到同类场景
- 检查每条 `note` 是否说明差异、语气、使用边界或策略功能
