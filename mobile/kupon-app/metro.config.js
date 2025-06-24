const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Web için resolver ayarları
config.resolver = {
  ...config.resolver,
  alias: {
    'react-native': 'react-native-web',
  },
  platforms: ['ios', 'android', 'native', 'web'],
  assetExts: [
    ...config.resolver.assetExts,
    // Web için ek asset uzantıları
    'svg', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'ico', 'woff', 'woff2', 'ttf', 'otf',
  ],
};

// Transformer ayarları
config.transformer = {
  ...config.transformer,
  // Web için ek dönüşümler
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: false,
    },
  }),
  assetPlugins: ['expo-asset/tools/hashAssetFiles'],
};

// Web için server ayarları
if (process.env.EXPO_PLATFORM === 'web') {
  config.server = {
    ...config.server,
    enhanceMiddleware: (middleware) => {
      return (req, res, next) => {
        // Bundle dosyaları için doğru MIME type ayarla
        if (req.url) {
          if (req.url.includes('.bundle') || req.url.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
          } else if (req.url.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css; charset=utf-8');
          } else if (req.url.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
          } else if (req.url.endsWith('.json')) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
          } else if (req.url.endsWith('.map')) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
          }
        }
        return middleware(req, res, next);
      };
    },
  };
}

// React Native Web için özel ayarlar
config.webpack = {
  ...config.webpack,
  resolve: {
    alias: {
      'react-native$': 'react-native-web',
    },
  },
};

module.exports = config;
