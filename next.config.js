/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // API রিকোয়েস্ট করতে হলে Vercel এ CORS সমস্যা এড়াতে নিচের মতো সেটিং দিতে পারো
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `https://apis.davidcyriltech.my.id/:path*`
      }
    ];
  },
};

export default nextConfig;
