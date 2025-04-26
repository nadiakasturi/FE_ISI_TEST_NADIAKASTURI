/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
      // Pastikan environment variable DATABASE_URL ada di Vercel
      DATABASE_URL: process.env.DATABASE_URL,
    },
  };
  
  export default nextConfig;
  