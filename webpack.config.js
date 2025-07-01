const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    mode: env.mode || 'development',
  }, argv);

  // React Native Web için alias ayarları
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native$': 'react-native-web',
    'react-native/Libraries/EventEmitter/RCTDeviceEventEmitter$': 'react-native-web/dist/vendor/react-native/NativeEventEmitter/RCTDeviceEventEmitter',
    'react-native/Libraries/vendor/emitter/EventEmitter$': 'react-native-web/dist/vendor/react-native/emitter/EventEmitter',
    'react-native/Libraries/EventEmitter/NativeEventEmitter$': 'react-native-web/dist/vendor/react-native/NativeEventEmitter',
  };

  // MIME type sorunlarını düzelt
  config.devServer = {
    ...config.devServer,
    historyApiFallback: {
      disableDotRule: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
    setupMiddlewares: (middlewares, devServer) => {
      devServer.app.use((req, res, next) => {
        if (req.url.endsWith('.js') || req.url.includes('.bundle')) {
          res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        } else if (req.url.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css; charset=utf-8');
        } else if (req.url.endsWith('.html')) {
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
        } else if (req.url.endsWith('.json')) {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
        }
        next();
      });
      return middlewares;
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

  // Platform ayarları
  config.resolve.extensions = [
    '.web.tsx', '.web.ts', '.web.jsx', '.web.js',
    '.tsx', '.ts', '.jsx', '.js', '.json'
  ];

  return config;
};
