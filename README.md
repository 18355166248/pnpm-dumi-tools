# monorepo 工具库

## 配置

### 删除node_modules

安装或删除全局依赖包跟所有子项目依赖包，配置pnpm scripts指令

应开发有需要一键安装(或删除)全部子项目以及全局的node_modules，特此配置pnpm scripts指令

```js
arduino复制代码npm install rimraf -g
// 指令需要用rimraf来快速删除node_modules包，所以需要安装
```

```js
{
  "scripts":{
    "installAllNm:command": "安装全局依赖以及的所有子项目的依赖",
    "installAllNm": "pnpm install",
    "clearAllNm:command": "删除全局依赖以及的所有子项目的依赖",
    "clearAllNm": "rimraf node_modules && rimraf \*/\*\*/node_modules"
  }
}
```

### eslint 使用了 eslint-config-alloy

[文档](https://alloyteam.github.io/eslint-config-alloy/)

## 本地调试

```shell
pnpm dev
```

## 更新版本号

请看 `changesets.md` 发布流程

## 发布

请看 `changesets.md` 发布流程

## 新增组件库

需要在 apps/docs/package.json 下的 dependencies 添加新组件库的依赖，不然无法拿到最新的代码
# checkstand-tools
