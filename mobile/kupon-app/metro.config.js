const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Web için MIME type düzeltmeleri
config.server = {
  ...config.server,
  rewriteRequestUrl: (url) => {
    if (!url.endsWith('.bundle')) {
      return url;
    }
    // .bundle uzantılı dosyalar için doğru content-type ayarla
    return url;
  },
};

// Web resolver ayarları
config.resolver = {
  ...config.resolver,
  alias: {
    'react-native': 'react-native-web',
  },
  platforms: ['ios', 'android', 'native', 'web'],
};

// Transformer ayarları
config.transformer = {
  ...config.transformer,
  // Web için ek dönüşümler
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

module.exports = config;
