module.exports = {
  parser: "babel-eslint",
  env: {
    es6: true,
    node: true,
    browser: true
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ["react"],
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:react/recommended"
  ],
  overrides: [
    Object.assign(
      {
        files: ['**/__tests__/*.jsx'],
        env: { jest: true },
        plugins: [ 'jest' ],
      },
      require('eslint-plugin-jest').configs.recommended
    )
  ]
};
