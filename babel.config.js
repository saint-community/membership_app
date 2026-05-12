module.exports = function (api) {
  api.cache(true);
  const plugins = [];
  // Must be listed last per Reanimated docs (required for release builds).
  plugins.push('react-native-reanimated/plugin');

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins,
  };
};
