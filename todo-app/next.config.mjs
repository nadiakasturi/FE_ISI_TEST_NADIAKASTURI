export default {
  reactStrictMode: true,
  webpack(config) {
    config.module.exprContextCritical = false; // Hapus peringatan yang tidak diperlukan
    return config;
  },
};
