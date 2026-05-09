# 学术表达提取指令

请阅读以下论文，提取值得中文母语学术写作者学习的英文表达。

## 提取标准

- 只提取非平庸表达。忽略 "This paper examines"、"The results show" 这类过于基础的说法
- 优先提取同一个意思的不常见但地道的说法
- 优先提取精确的动词选择，例如用 condition、shape、mediate、attenuate 等表达更细的逻辑关系
- 优先提取有力的学术短语、搭配和优雅句式
- 每条表达必须标注与同族其他表达或常见说法的差异，写在 `note` 字段
- 不要把 `note` 写成翻译或定义

## 可用 Category

- `statistics`：统计与结果报告
- `causality`：因果机制与影响
- `methods`：研究设计与方法
- `prior-literature`：文献回顾
- `gaps`：研究空白
- `contradiction`：转折、限制与反驳
- `contributions`：贡献与理论推进
- `degree-comparison`：程度、比较与变化

## 输出格式

严格按以下 JSON 格式输出，每条表达归入对应 Category：

```json
{
  "source": "论文标题, 期刊, 年份",
  "extractions": [
    {
      "category": "causality | contradiction | gaps | prior-literature | statistics | methods | contributions | degree-comparison",
      "cluster_meaning": "中文意思描述；如果匹配已有 cluster，则使用已有描述",
      "expression": {
        "en": "英文表达",
        "note": "与同族其他表达的差异说明，不能写翻译",
        "example": "论文中的原始例句",
        "register": "formal | neutral | literary"
      }
    }
  ]
}
```

## Review 要点

- 删除过于普通、可替代性不强的表达
- 检查 `category` 是否合理
- 检查 `cluster_meaning` 是否能与现有 cluster 合并
- 检查 `note` 是否说明了适用场景、语气强弱、逻辑细节或与同族表达的差异
- 追加到数据文件前，先检查同一 Category 中是否已有相同 `en`

## 论文内容

[在此粘贴论文文本]
