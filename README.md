# Next.js & Netlify 部署模板

如何在 Netlify for Next.js v14 中集成常用的功能参考，以及部署中的注意点

## 目录

- [开始](#getting-started)
- [Deploy to Netlify](#部署到-netlify)：一键部署，cli 部署，本地预览
- [Forms](#表单)：自定义提交，阻止垃圾邮件
- [Netlify Functions](#netlify-函数)
- [Redirects](#重定向-redirects)
- [Next.js Toolbox Template Video Walkthrough](#nextjs-toolbox-template-video-walkthrough)
- [Testing](#测试-testing)

## Getting Started

```bash
# clone this repo
git clone https://github.com/balac2015/next-netlify-starter.git
# 安装依赖
npm install
# 在浏览器打开 `http://localhost:3000` 查看结果
npm run dev
```

## 部署到 Netlify

[一键部署](https://app.netlify.com/start/deploy?repository=https://github.com/balac2015/next-netlify-starter) - 指定 repo 部署到 netlify

### 通过 Netlify CLI 部署

```bash
# 安装 cli
npm install -g netlify-cli

# 初始化一个新的 Netlify 项目，在代码推送到 repo 时触发自动部署（手动修改 Site Settings/Build & deploy/Continuous Deployment）
netlify init

# 手动部署，
netlify deploy (--prod)

# 打开项目仪表盘
netlify open
```

通过配置文件 `netlify.toml` 设置构建命令

### 本地预览

`netlify dev` 查看项目信息，环境变量以及：
- test functions
- test redirects
- 通过 url 共享：`netlify dev --live`
- [更多](https://cli.netlify.com/netlify-dev/)

### 部署资源

- [cli 文档](https://docs.netlify.com/cli/get-started/)
- [netlify.toml 配置](https://docs.netlify.com/configure-builds/file-based-configuration/)
- [Netlify Edge, CDN 部署](https://www.netlify.com/products/edge/)

## 表单

1. form 标签添加额外属性，将使 Netlify 在加载页面时知道，需要通过它提交内容
    
    `<form data-netlify="true"></form>`

2. 表单项中的隐藏，将 name 传递给 Netlify 并在页面中隐藏此表单项

    `<input type="hidden" name="form-name" value="feedback" />`

[Netlify 启用表单检测](https://docs.netlify.com/forms/setup/#enable-form-detection)

### 添加自定义提交页面

`components/FeedbackForm.js` 中的表单属性 `action="/success"` 将跳到 `pages/success.js` 下创建的路由 `/success` 页面

### 阻止垃圾邮件

许多机器人扫描网页去尝试发送表单，可以用视觉隐藏表单字段过滤掉无关的提交

```html
<!-- 配合 <form data-netlify-honeypot="bot-field"> 属性 -->
<p class="hidden">
    <label>
        Don’t fill this out if you’re human: <input name="bot-field" />
    </label>
</p>
```

例子：`components/FeedbackForm.js` 第 8 行

### 表单资源

- [Netlify 表单设置](https://docs.netlify.com/forms/setup/)
- [Netlify Forms](https://www.netlify.com/products/forms/#main)
- [Netlify 表单触发函数](https://docs.netlify.com/functions/trigger-on-events/)
- [Netlify 使用 reCAPTCHA 2](https://docs.netlify.com/forms/spam-filters/#recaptcha-2-challenge)

## Netlify 函数

使用 Netlify 可构建服务器端代码（无需专用服务器）

例子 `netlify/functions/joke.js` 文件的 JavaScript 函数格式，

### 函数资源


- [Netlify 函数格式](https://docs.netlify.com/functions/build-with-javascript/#synchronous-function-format)
- [使用 TypeScript 构建 Netlify 函数](https://docs.netlify.com/functions/build-with-typescript/)
- [事件触发函数](https://docs.netlify.com/functions/trigger-on-events/)
- [什么是背景函数](https://www.netlify.com/blog/2021/01/07/what-are-background-functions/)
- [函数示例](https://functions.netlify.com/examples/)
- [使用 esbuild 作为构建工具](https://www.netlify.com/blog/2021/04/02/modern-faster-netlify-functions/)

## 重定向 Redirects

例子 `netlify.toml` 的 `redirects` 配置实现重定向

重定向需要 [分布式持久渲染 Distributed Persistant Rendering](https://www.netlify.com/blog/2021/04/14/distributed-persistent-rendering-a-new-jamstack-approach-for-faster-builds/)

```shell
# Netlify 重定向启动（按从上到下顺序执行）
[[redirects]]
from = "/api/*" # 简化所有 serverless 的调用
to = "/.netlify/functions/:splat"   # 所有的函数调用路径
status = 200    # ok 状态码 200
force = true    # 确保始终重定向
```

配置 `form` 和 `to` 让 [CDN](https://www.netlify.com/blog/edge-cdn-serverless-cloud-meaaning) 知道何时请求

### 重定向资源


- [重定向语法和配置](https://docs.netlify.com/routing/redirects/#syntax-for-the-netlify-configuration-file)
- [重定向选项](https://docs.netlify.com/routing/redirects/redirect-options/)
- [为 SPA 创建更好、更可预测的重定向规则](https://www.netlify.com/blog/2020/04/07/creating-better-more-predictable-redirect-rules-for-spas/)
- [按语言重定向](https://docs.netlify.com/routing/redirects/redirect-options/#redirect-by-country-or-language)
- [按需构建](https://docs.netlify.com/configure-builds/on-demand-builders/)

## 测试 Testing

使用的工具：

- [Renovate](https://www.mend.io/free-developer-tools/renovate/) - 定期更新依赖关系
- [Cypress](https://www.cypress.io/) - 端到端测试，确保按预期在浏览器中显示
- [Cypress Netlify Build Plugin](https://github.com/cypress-io/netlify-plugin-cypress) - 在构建过程中运行测试

依赖：
```bash
npm i --save-dev cypress@13.4.0 netlify-plugin-cypress@2.2.1
```

配置文件：`netlify.toml 中 plugins` 字段配置，`cypress.config.js` 配置，`./cypress` 目录中写测试代码
```shell
# Cypress 配置，如果测试没有通过，Cypress 不会生成部署链接
[[plugins]]
  package = "netlify-plugin-cypress"

  [plugins.inputs.postBuild]
    enable = true

  [plugins.inputs]
    enable = false
```

```js
// cypress.config.js
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8888',
    supportFile: false,
  },
});
```

---

fork 自: https://github.com/netlify-templates/nextjs-toolbox
    
