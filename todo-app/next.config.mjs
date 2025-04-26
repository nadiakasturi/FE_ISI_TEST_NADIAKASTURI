// next.config.mjs
export default {
  reactStrictMode: true,
  experimental: {
    appDir: true,  // Aktifkan App Router
  },
  webpack(config) {
    config.module.exprContextCritical = false; // Hapus peringatan yang tidak diperlukan
    return config;
  },
};
