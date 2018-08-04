module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 7,
    sourceType: 'module',
    ecmaFeatures: { implicitStrict: true }
  },
  plugins: ['standard', 'prettier'],
  extends: ['standard', 'prettier', 'plugin:import/errors'],
  rules: {
    'prettier/prettier': [
      2,
      {
        semi: false,
        singleQuote: true,
        trailingComma: 'none'
      }
    ],
    'no-process-env': 0,
    'no-unused-vars': [
      2,
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }
    ],
    'prefer-arrow-callback': 2,
    'prefer-const': 2,
    'standard/computed-property-even-spacing': 0
  }
}
