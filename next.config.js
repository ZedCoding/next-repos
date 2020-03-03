const webpack = require('webpack')
const withCss = require("@zeit/next-css");
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const config = require("./config");

if (typeof require !== "undefined") {
  require.extensions[".css"] = file => {};
}

// 基本config
const configs = {
  // 编译文件的输出目录
  distDir: "dest",
  // 是否给每个路由生成Etag
  generateEtags: true,
  // 页面内容缓存配置
  onDemandEntries: {
    // 内容在内存中缓存的时长（ms）
    maxInactiveAge: 25 * 1000,
    // 同时缓存多少个页面
    pagesBufferLength: 2
  },
  // 在pages目录下哪种后缀的文件会被认为是页面
  pageExtensions: ["jsx", "js"],
  // 配置buildId
  generateBuildId: async () => {
    if (process.env.YOUR_BUILD_ID) {
      return process.env.YOUR_BUILD_ID;
    }
    // 默认返回unique id
    return null;
  },
  // 修改webpack config
  webpack(config, options) {
    return config;
  },
  // 修改webpackDevMiddleware配置
  webpackDevMiddleware: config => {
    return config;
  },
  // 可以通过process.env.customKey 获取value
  env: {
    customKey: "value"
  },
  // 下面两个需通过next/config读取
  // 只有在服务端渲染时才获取的参数
  serverRuntimeConfig: {
    mySecret: "secret",
    secondSecret: process.env.SECOND_SECRET
  },
  // 在服务端和客户端渲染时都可以获取的参数
  publicRuntimeConfig: {
    staticFolder: "/static"
  }
};

const { GITHUB_OAUTH_URL, OAUTH_URL } = config.github;

module.exports = withBundleAnalyzer(withCss({
  webpack(config) {
    config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))
    return config
  },
  publicRuntimeConfig: {
    GITHUB_OAUTH_URL,
    OAUTH_URL
  },
  analyzeBrowser: ['browser','both'].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: "static",
      reportFilename: "../bundles/server.html"
    },
    browser: {
      analyzerMode: "static",
      reportFilename: "../bundles/client.html"
    }
  }
}));
