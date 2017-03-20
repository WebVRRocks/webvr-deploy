/* jshint node:true */
/* eslint-env es6 */

const execFile = require('child_process').execFile;

require('dotenv').config();

const hapi = require('hapi');
const githubWebhooksPlugin = require('hapi-github-webhooks');

const NODE_ENV = process.env.NODE_ENV || 'production';
const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 4041;
const APPS = {
  'webvr-agent': process.env.WEBVR_DEPLOY_SECRET_WEBVR_AGENT
};

const server = new hapi.Server();

server.connection({
  host: HOST,
  port: PORT
});

server.register(githubWebhooksPlugin, err => {
  if (err) {
    console.error(err);
    throw err;
  }

  let appSecret;

  Object.keys(APPS).forEach(appSlug => {
    appSecret = APPS[appSlug];

    server.auth.strategy('githubwebhook', 'githubwebhook', {
      secret: appSecret
    });

    server.route([
      {
        method: 'POST',
        path: `/hooks/${appSlug}`,
        config: {
          auth: {
            strategies: [
              'githubwebhook'
            ],
            payload: 'required'
          }
        },
        handler: (request, reply) => {
          execFile(path.join(__dirname, 'scripts', 'hooks', `${appSlug}.sh`), (err, stdout, stderr) => {
            if (stdout) {
              console.log(stdout);
            }

            if (stderr) {
              console.error(stderr);
            }

            if (err) {
              reply({
                success: false,
                error: err
              });
            } else {
              reply({
                success: true
              });
            }
          });
        }
      }
    ]);
  });
});

// Do not start the server when this script is required by another script.
server.start(() => {
  console.log('[%s] Listening on %s', NODE_ENV, server.info.uri);
});
