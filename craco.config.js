module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Ignorar los warnings de source-map para react-datepicker
      webpackConfig.ignoreWarnings = [
        {
          module: /react-datepicker/,
        },
        // Ignorar todos los warnings de source-map-loader
        (warning) => {
          return (
            warning.module &&
            warning.module.resource &&
            warning.module.resource.includes('node_modules') &&
            warning.details &&
            warning.details.includes('source-map-loader')
          );
        },
      ];
      return webpackConfig;
    },
  },
}; 