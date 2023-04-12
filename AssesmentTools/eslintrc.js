// eslint-disable-next-line no-undef
module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  //"overrides": [],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "semi": ["error", "always"], //never, always
    "eqeqeq": "error",
    "complexity": ["error", 3],
    "array-bracket-newline": "error",
    "array-bracket-spacing": "error",
    "block-scoped-var": "error",
    "no-mixed-spaces-and-tabs": "error",
    "dot-notation": "error", // access array properties using dot notation
    "no-shadow": "error", // if already used
    "no-sequences": "error"
  }
};