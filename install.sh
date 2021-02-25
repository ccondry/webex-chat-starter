#!/bin/sh
echo "running yarn"
yarn
if [ $? -eq 0 ]; then
  echo "running yarn build..."
  yarn build
  while [ $? != 0 ]
  do
    echo "failed to build webex-links-homepage website files. trying again..."
    yarn build
  done
  echo "yarn build successful. copying dist files to www folder..."
  mkdir -p /var/www/html/static/webex/v4prod
  cp -rf dist/* /var/www/html/static/webex/v4prod/
  if [ $? -eq 0 ]; then
    echo "successfully installed webex-links-homepage website files"
  else
    echo "failed to install webex-links-homepage website files"
  fi
else
  echo "yarn failed"
fi
