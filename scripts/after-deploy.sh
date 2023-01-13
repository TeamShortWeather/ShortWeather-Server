#!/bin/bash
REPOSITORY=/home/ubuntu/build

cd $REPOSITORY
sudo apt install git
sudo yarn

npm i -g pm2
sudo pm2 start dist
