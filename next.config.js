/** @type {import('next').NextConfig} */
const nextConfig = {
  // 确保没有特殊的路由配置
  typescript: {
    // !! 警告 !!
    // 危险区域，仅在你明确知道自己在做什么时使用
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig; 