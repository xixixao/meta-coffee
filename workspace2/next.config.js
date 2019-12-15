const repoNameURIPrefix =
  process.env.NODE_ENV === 'production' ? '/meta-coffee' : '';

module.exports = {
  assetPrefix: repoNameURIPrefix,
  env: {
    linkPrefix: repoNameURIPrefix,
  },
  generateBuildId: async () => 'current',
  'react-monaco-editor': require.resolve('react-monaco-editor/lib'),
  webpack: (config, {buildId, dev, isServer, defaultLoaders, webpack}) => {
    console.log(config);
    config.plugins.push(new (require('monaco-editor-webpack-plugin'))({}));
    return config;
  },
};
