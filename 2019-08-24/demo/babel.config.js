module.exports = (api) => {
  api.cache.using(() => process.env.NODE_ENV === 'development');


  return {
    presets: [
      require('@babel/preset-env'),
      require('@babel/preset-react'),
    ],
    plugins: [
      [require('@babel/plugin-proposal-class-properties'), { loose: true }],
      require('@babel/plugin-syntax-dynamic-import'),
    ],
  };
};
