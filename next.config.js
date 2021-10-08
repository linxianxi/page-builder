

module.exports = {
  images: {
    domains: ["zos.alipayobjects.com"],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://x139.hotishop.com/api/:path*',
      },
    ]
  },
};
