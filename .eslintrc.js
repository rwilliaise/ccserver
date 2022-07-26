module.exports = {
  extends: 'standard-with-typescript',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: [
      './src/**/tsconfig.json',
      'tsconfig.eslint.json'
    ]
  }
}
