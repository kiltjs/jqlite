module.exports = {
    "parser": "babel-eslint",
    "parserOptions" : {
        "ecmaVersion": 7,
        "sourceType" : "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },

    "env": {
        "amd": false,
        "jasmine": false,
        "node": false,
        "mocha": true,
        "browser": true,
        "builtin": true,
        "es6": true
    }
};

