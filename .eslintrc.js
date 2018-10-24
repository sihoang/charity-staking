module.exports = {
  "extends": ["airbnb-base", "plugin:react/recommended"],
  "env": {
    "browser": true,
    "node": true,
  },
  "settings": {
    "react": {
      "version": "^16.5.2",
    },
  },
  "globals": {
    "embark": true,
    "config": true,
    "contract": true,
    "it": true,
    "before": true,
    "web3": true,
    "assert": true,
  },
  "rules": {
    "no-console": "off",
    "no-restricted-syntax": "off",
    "no-await-in-loop": "off",
    "import/no-dynamic-require": "off",
    "global-require": "off",
    "class-methods-use-this": "off",
    "react/prop-types": "off",
  }
};
