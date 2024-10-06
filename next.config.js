/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Remove the experimental.appDir option
  env: {
    GROQ_API_KEY: process.env.GROQ_API_KEY,
  },

};

module.exports = nextConfig;