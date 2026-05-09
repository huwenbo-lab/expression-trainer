# Expression Trainer

一个部署在 GitHub Pages 的纯前端 React 应用，用于训练英文表达：

- 学术写作表达训练
- 口语交流场景训练

应用不需要后端、登录或数据库。语料以静态 JSON 文件保存，学习进度保存在浏览器 `localStorage`，key 为 `expression-trainer-progress`。

## 项目结构

```text
expression-trainer/
├── .github/workflows/deploy.yml     # GitHub Pages 自动部署
├── public/
├── scripts/
│   ├── extract-expressions-prompt.md # 学术写作语料提取模板
│   ├── generate-dialogue-prompt.md   # 口语对话生成模板
│   ├── validate-data.mjs             # 语料结构校验
│   └── test-*.mjs                    # 轻量结构测试
├── src/
│   ├── components/                   # React 组件
│   ├── data/
│   │   ├── academic/                 # 学术写作语料
│   │   └── oral/                     # 口语场景语料
│   ├── hooks/                        # useProgress / useFilter
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── academic-writing-trainer-spec.md
├── oral-communication-trainer-spec.md
├── package.json
└── vite.config.js
```

## 本地运行

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

默认访问：

```text
http://127.0.0.1:5173/expression-trainer/
```

构建生产版本：

```bash
npm run build
```

常用检查：

```bash
npm run validate:data
npm run test:hooks
npm run test:academic-ui
npm run test:oral-ui
npm run test:integration-ui
npm run lint
```

## GitHub Pages 部署

本项目按 GitHub 项目页配置，`vite.config.js` 中的 `base` 为：

```js
base: '/expression-trainer/'
```

因此 GitHub 仓库名应为 `expression-trainer`。如果仓库名不同，需要同步修改 `vite.config.js` 的 `base`。

推送到 GitHub 后，在仓库设置中启用：

```text
Settings -> Pages -> Build and deployment -> Source -> GitHub Actions
```

之后每次 push 到 `main`，`.github/workflows/deploy.yml` 会自动构建并发布 `dist/`。

## 用 AI Agent 扩展语料

学术写作表达：

1. 打开 `scripts/extract-expressions-prompt.md`
2. 将论文文本粘贴到模板末尾
3. 让 AI agent 输出结构化 JSON
4. 人工 review：检查表达质量、Category/Cluster 归属、note 是否是差异说明
5. 追加到 `src/data/academic/*.json`
6. 运行 `npm run validate:data`

口语交流场景：

1. 打开 `scripts/generate-dialogue-prompt.md`
2. 填入场景名称、具体情境、对话参与者
3. 让 AI agent 生成 `dialogues` 和 `universalExpressions`
4. 人工 review：确保 `speaker: "you"` 的每条 line 都有 `zh`，note 都是差异说明
5. 追加到 `src/data/oral/*.json`
6. 运行 `npm run validate:data`

新增语料时注意：

- 英文表达本身用英文
- `meaning`、`note`、`context` 和中文翻译使用中文
- `note` 写同族表达之间的差异，不写翻译或定义
- 避免重复的 `expression.id` 和重复的 `en` 表达
