module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { chrome: '80' } }],
    ['@babel/preset-react', { runtime: 'classic' }]
  ],
  plugins: ['@babel/plugin-transform-class-properties']
};
