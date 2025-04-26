export default {
  webpack: (config) => {
    config.module.exprContextCritical = false;
    return config;
  },
};
