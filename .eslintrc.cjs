/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "plugin:astro/recommended",
    "plugin:astro/jsx-a11y-recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier",
  ],
  plugins: ["@typescript-eslint", "import", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    sourceType: "module",
    ecmaVersion: "latest",
  },
  rules: {
    "import/no-unresolved": "off", // Disable globally
  },
  overrides: [
    {
      files: ["*.astro"],
      parser: "astro-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"],
      },

      rules: {
        "import/no-unresolved": "off", // Disable for .astro files only
        "astro/no-conflict-set-directives": "error",
        "astro/no-unused-define-vars-in-style": "error",
        "@typescript-eslint/no-unused-vars": "warn",
        "prettier/prettier": "error",
        // override/add rules settings here, such as:
        // "astro/no-set-html-directive": "error"
      },
    },
  ],
};
