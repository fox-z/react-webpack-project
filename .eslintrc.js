module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "parser": "babel-eslint",
    "extends": "airbnb",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2017,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "jsx-a11y/no-noninteractive-element-interactions": "off",
        "react/sort-comp": "off",
        "react/no-array-index-key": "off",
        "func-names": "off",
        "no-confusing-arrow": "off",
        "class-methods-use-this": "off",
        "no-nested-ternary": "off",
        "jsx-a11y/anchor-is-valid": "off",
        "jsx-a11y/anchor-has-content": "off",
        "react/jsx-no-target-blank": "off",
        "react/no-string-refs": "off",
        "react/destructuring-assignment": "off",
        "camelcase": "off",
        "no-underscore-dangle": "off",
        "no-param-reassign": "off",
        "react/jsx-wrap-multilines": "off",
        "lines-between-class-members": "off",
        "react/jsx-first-prop-new-line": "off",
        "jsx-a11y/click-events-have-key-events": "off",
        "jsx-a11y/no-static-element-interactions": "off",
        "react/prop-types": "off",
        "prefer-destructuring": "off",
        "no-useless-escape": "off",
        "import/no-extraneous-dependencies": "off",
        "arrow-parens": "off",
        "max-len": ["error", 150],
        "no-console": "off",
        "no-plusplus": 0,
        "linebreak-style": "off",
        "comma-dangle": "off",
        "react/jsx-filename-extension": "off",
        "react/jsx-uses-react":2,
        "react/jsx-uses-vars":2,
        "react/react-in-jsx-scope":2,
        "arrow-body-style": "off",
        "indent": "off",
        "import/no-unresolved": "off",
        "quotes": [
            "warn",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "react/jsx-indent": [ // 解决react里面的缩进问题
            "warn",
            2
        ],
        "react/jsx-indent-props": [ //
            "warn",
            2
        ],
        "no-tabs": "off", // 禁止缩进错误
        // 允许使用 for in
        "no-restricted-syntax": 0,
        "guard-for-in": 0,
        // 允许在 .js 和 .jsx 文件中使用 jsx
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        // 不区分是否是 无状态组件
        "react/prefer-stateless-function": 0,
        "react/self-closing-comp": "off",
    }
}