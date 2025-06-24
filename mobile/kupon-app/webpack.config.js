const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    mode: env.mode || 'development',
  }, argv);

  // MIME type sorunlarını düzelt
  config.devServer = {
    ...config.devServer,
    historyApiFallback: {
      disableDotRule: true,
    },
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
    },
  };

  // Module rules için ek ayarlar
  config.module.rules.push({
    test: /\.js$/,
    type: 'javascript/auto',
    resolve: {
      fullySpecified: false,
    },
  });

  return config;
};
