const { join } = require("path");
const path = require("path");
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    /*config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });*/
    
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@common': path.resolve(__dirname, 'src/components/common'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    }

    return config;
  },
  sassOptions: {
    includePaths: [join(__dirname, "styles")],
  },
  swcMinify: true,
  basePath: "",
  // reactStrictMode: true, // 打开后会render2次
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    APP_ENV: process.env.APP_ENV,
    FEISHU_APP_ID: process.env.FEISHU_APP_ID,
    FEISHU_APP_SECRET: process.env.FEISHU_APP_SECRET,
  },
  // 重定向
  async redirects() {
    return [
      {
        source: "/",
        destination: "/",
        permanent: true,
      },
    ];
  },
  // 代理
  /*async rewrites() {
    return {
      fallback: [
        {
          source: '/bannedword/:path*',
          destination: `http://op-platform-svc:5000/bannedword/:path*`,
        },
      ],
    }
  },*/
  // 打包目录
  distDir: "dist",
};

module.exports = nextConfig;
