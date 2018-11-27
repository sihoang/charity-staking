[![Build Status](https://travis-ci.org/WeTrustPlatform/charity-tcr.svg?branch=master)](https://travis-ci.org/WeTrustPlatform/charity-tcr)

# Charity TCR
Work-in-progress

### Overview
Token Curated Registries for Non-profit Organizations

> As the digital world is overtaken by the mob, a solution may be found in the wisdom of the crowd.
> -[George Li](https://hackernoon.com/curating-a-virtuous-digital-world-b89363e8ab15)


### Getting started
- Install [geth](https://geth.ethereum.org/).
- (Optional) Install [ipfs](https://ipfs.io/) if you would like to push your build there.
- Set up [charity-management-serv](https://github.com/WeTrustPlatform/charity-management-serv). Three options:
    * On local: [docker](https://github.com/WeTrustPlatform/charity-management-serv#docker) might be easier than setting up the whole go-lang dev environment
    * Shared instance: https://tcr.wetrust.info/api/v0/charities
    * Set up your own AWS instance using [terraform](https://www.terraform.io/): https://github.com/WeTrustPlatform/charity-management-serv/blob/master/staging.tf
- Install dependencies:
```
npm install
```

- Configure the `CMS_URL` pointing to `charity-management-serv` in `webpack.config.js`. The URL should end with `/api/v0`, no trailing slash.
```
new webpack.DefinePlugin({
  CMS_URL: JSON.stringify(process.env.CMS_URL || 'http://localhost:8001/api/v0'),
}),
```

- Start the dApp:
    * Local network: `npm run dev` It will launch a private local testnet on your machine and deploy new set of contracts if this is your first time. Accounts are loaded with free test ETH so you can interact with the dApp.
    * Rinkeby: `npm run dev -- testnet` The contracts already deployed and specified in `config/contract.js`. If you want to deploy your own, make sure your `account[0]` has Rinkeby ETH and remove the contract addresses in the `testnet` config.


### Docker
Checkout the latest release:
```
docker pull sihoang/charity-tcr:testnet-latest
```

Checkout the latest code on local:
```
docker build -t charity-tcr .
```

These images are built with these args:
```
ARG ENVIRONMENT=testnet
ARG CMS_URL=https://tcr.wetrust.info/api/v0
```
Feel free to overwrite them as you please.

Launch the container:
```
docker run -i --rm -p 8000:80 sihoang/charity-tcr
```
The webserver is at http://localhost:8000


### License
[GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.txt) &copy; WeTrustPlatform
