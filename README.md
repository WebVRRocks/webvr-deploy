# WebVR Deploy

Tools for managing server deployment of WebVR services.


## Local development

First, clone this repo:

```bash
mkdir -p webvrrocks && git clone git@github.com:webvrrocks/webvr-deploy.git webvrrocks/webvr-deploy && cd webvrrocks/webvr-deploy
```

To install the [Node](https://nodejs.org/en/download/) dependencies:

```bash
npm install
```

To start the server:

```bash
npm start
```


## Deployment

Run these commands locally to set up on the server the process manager, [`pm2`](https://github.com/Unitech/pm2), which is used to run the Node web services:

```bash
export WEBVR_DEPLOY_USER="nodeuser"
export WEBVR_DEPLOY_IP="138.197.120.12"

ssh $WEBVR_DEPLOY_USER@$WEBVR_DEPLOY_IP "npm install pm2 -g && mkdir -p /var/www/node/webvrrocks && git clone git@github.com:webvrrocks/webvr-deploy.git /var/www/node/webvrrocks/webvr-deploy && pushd /var/www/node/webvrrocks/webvr-deploy && npm install --production && popd"
echo 'WEBVR_DEPLOY_SECRET_WEBVR_AGENT="SECRET_GOES_HERE"' > .env
scp .env $WEBVR_DEPLOY_USER@$WEBVR_DEPLOY_IP:/var/www/node/webvrrocks/webvr-deploy/.env
scp pm2-ecosystem.json $WEBVR_DEPLOY_USER@$WEBVR_DEPLOY_IP:/var/www/node/webvrrocks/webvr-deploy/pm2-ecosystem.json
ssh $WEBVR_DEPLOY_USER@$WEBVR_DEPLOY_IP "pm2 update && pm2 startup && pm2 startOrGracefulReload /var/www/node/webvrrocks/webvr-deploy/pm2-ecosystem.json"
```


## License

All code and content within this source-code repository is licensed under the [**Creative Commons Zero v1.0 Universal** license (CC0 1.0 Universal; Public Domain Dedication)](LICENSE.md).

You can copy, modify, distribute and perform this work, even for commercial purposes, all without asking permission.

For more information, refer to these following links:

* a copy of the [license](LICENSE.md) in [this source-code repository](https://github.com/webvrrocks/webvr-deploy)
* the [human-readable summary](https://creativecommons.org/publicdomain/zero/1.0/) of the [full text of the legal code](https://creativecommons.org/publicdomain/zero/1.0/legalcode)
* the [full text of the legal code](https://creativecommons.org/publicdomain/zero/1.0/legalcode)
