import globals from "globals";
import js from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: { globals: { ...globals.node }, ecmaVersion: "latest" },
  },
  { ignores: ["dist/**", "build/**"] },
];
