import globals from "globals";
import pluginJs from "@eslint/js";
import pluginNode from "eslint-plugin-node";
import pluginJest from "eslint-plugin-jest";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        Buffer: "readonly",
        process: "readonly",
        jest: "readonly",
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      node: pluginNode.configs.recommended,
      jest: pluginJest.configs.recommended,
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": "warn",
      "no-useless-escape": "error",
    },
    ignores: 
    [
      '**/node_modules/**',
      '**/coverage/**'
    ]
  },
];
