import { defineConfig } from "father";
export default defineConfig({
  // more father config: https://github.com/umijs/father/blob/master/docs/config.md
  esm: { output: "es" },
  cjs: { output: "lib" },
  extraBabelPlugins: ["@babel/plugin-transform-runtime"],
});
