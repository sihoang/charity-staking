module.exports = {
  "extends": "airbnb-base",
  "globals": {
    "embark": true,
    "config": true,
    "contract": true,
    "it": true,
    "before": true,
    "web3": true,
    "assert": true
  },
  "rules": {
    "no-console": "off",
    "no-restricted-syntax": "off",
    "no-await-in-loop": "off",
    "import/no-dynamic-require": "off",
    "global-require": "off"
  }
};
