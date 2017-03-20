#!/usr/bin/env sh

git stash

git checkout master --force

git pull

git submodule init
git submodule update --remote

npm install --production

pm2 restart webvr-agent

git checkout -

git stash apply
