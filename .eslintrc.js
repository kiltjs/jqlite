module.exports = {
    "env": {
      "browser": true,
      "es6": true,
    },
    "globals": {
      "module": true,
      "define": true,
      "angular": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
      "sourceType": "module",
    },
    "rules": {
      "linebreak-style": [
          "error",
          "unix"
      ],
      "quotes": [
          "error",
          "single"
      ],
      "semi": [
          "error",
          "always"
      ],
      "no-unused-vars": [
          "error",
          {
              "args": "after-used",
              "argsIgnorePattern": "^_\\w+"
          }
      ]
    }
};
