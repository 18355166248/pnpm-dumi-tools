import { defineConfig } from 'dumi';

const version = '1.0';

// const path =
//   process.env.NODE_ENV === 'production'
//     ? 'https://static2.test.ximalaya.com/yx/checkstand-tools/last/dist'
//     : '';
const path = process.env.DUMI_PUBLIC_PATH || '/';

export default defineConfig({
  outputPath: '../../dist',
  publicPath: path,
  themeConfig: {
    name: '',
    socialLinks: {
      gitlab: 'https://gitlab.ximalaya.com/cft/checkstand-tools',
      yuque:
        'https://yunxiao.xmly.work/titan/appcenter/13055/pipeline/56537/publish',
    },
    hd: { rules: [] }, // 禁用hd 使用px的情况下移动端访问字体变小
    footer: 'Powered by XMLY',
  },
  history: { type: 'hash' },
  favicons: [
    'https://static2.test.ximalaya.com/yx/my-order-h5/last/build/favicon.ico?version=20230810',
  ],
  logo: path + 'checkstand-logo.jpg',
  // 在 monorepo 中使用 dumi 时，你可能需要引入其他子包的组件、工具方法等，通过开启此选项来重定向这些子包的导入到他们的源码位置（默认为 src 文件夹），这也可以解决 MFSU 场景改动子包不热更新的问题。
  // 这种重定向的好处是：支持热更新，无需预构建其他子包即可进行开发。
  monorepoRedirect: {},
  scripts: [
    '//s1.xmcdn.com/yx/jssdk/1.1.2/build/ly.js',
    path + 'vconsole.min.js',
    `
    (function() {
      // 检测是否为移动设备
      var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      console.log('isMobile', isMobile);
      if (isMobile) {
        var vConsole = new window.VConsole();
      }
    })();
    `,
    `${path}tailwindcss.js`,
  ],
  links: [{ rel: 'stylesheet', href: path + `common.css?v=${version}` }],
  resolve: {
    atomDirs: [
      {
        type: 'document',
        dir: '../document',
      },
      {
        type: 'basicelement',
        dir: '../../packages/basic-element/src/components',
      },
      {
        type: 'base-utils',
        dir: '../../packages/base-utils/src/Demo',
      },
    ],
  },
  define: { 'process.env.DUMI_PUBLIC_PATH': process.env.DUMI_PUBLIC_PATH },
  proxy: {
    '/trade-v3': {
      target: 'https://m.test.ximalaya.com',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
    '/pay-trade-gateway-web': {
      target: 'https://m.test.ximalaya.com',
      changeOrigin: true,
      pathRewrite: {},
    },
    '/pay-cashier-gateway-web': {
      target: 'https://m.test.ximalaya.com',
      changeOrigin: true,
      pathRewrite: {},
    },
    '/business-user-subscription-mobile-web': {
      target: 'https://m.test.ximalaya.com',
      changeOrigin: true,
      pathRewrite: {},
    },
    '/business-cashier-notify-web': {
      target: 'https://m.test.ximalaya.com',
      changeOrigin: true,
      pathRewrite: {},
    },
    '/common-recharge': {
      target: 'https://m.test.ximalaya.com',
      changeOrigin: true,
      pathRewrite: {},
    },
  },
  extraBabelPlugins: [
    // [
    //   '../../plugins/babel-plugin-import/lib/index',
    //   {
    //     libraryName: 'base-utils',
    //     libraryDirectory: 'es',
    //     camel2DashComponentName: false, // 避免 customName 和拼接参数格式化成驼峰
    //     customName: (name: string) => {
    //       return `base-utils/es/${name}`;
    //     },
    //   },
    //   'base-utils',
    // ],
  ],
});
