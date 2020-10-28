#!/bin/sh
echo "running yarn"
yarn
if [ $? -eq 0 ]; then
  echo "running yarn build..."
  yarn build
  while [ $? != 0 ]
  do
    echo "failed to build toolbox-landing-ui website files. trying again..."
    yarn build
  done
  echo "yarn build successful. copying dist files to www folder..."
  mkdir -p /var/www/toolbox/landing
  cp -rf dist/* /var/www/toolbox/landing/
  if [ $? -eq 0 ]; then
    echo "successfully installed toolbox-landing-ui website files"
  else
    echo "failed to install toolbox-landing-ui website files"
  fi
else
  echo "yarn failed"
fi
