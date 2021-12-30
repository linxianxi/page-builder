

module.exports = {
  images: {
    domains: ["zos.alipayobjects.com", "cdn.hotishop.com"],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://asset33.hotishop.com/api/:path*',
      },
    ]
  },
};
