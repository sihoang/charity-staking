module.exports = {
  "extends": ["airbnb"],
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
    "EmbarkJS": true,
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
    "import/no-unresolved": ["error", { "ignore": ["Embark/EmbarkJS"] }],
    "global-require": "off",
    "class-methods-use-this": "off",
    "react/prop-types": "off",
    "react/jsx-filename-extension": "off",
    "react/prefer-stateless-function": "off",
  }
};
