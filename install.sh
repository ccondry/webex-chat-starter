#!/bin/sh
echo "running yarn"
yarn
if [ $? -eq 0 ]; then
  echo "running yarn build..."
  yarn build
  while [ $? != 0 ]
  do
    echo "failed to build webex-v4-toolbox-ui website files. trying again..."
    yarn build
  done
  echo "yarn build successful. copying dist files to www folder..."
  mkdir -p /var/www/toolbox/webex-v4prod
  cp -rf dist/* /var/www/toolbox/webex-v4prod/
  if [ $? -eq 0 ]; then
    echo "successfully installed webex-v4-toolbox-ui website files"
  else
    echo "failed to install webex-v4-toolbox-ui website files"
  fi
else
  echo "yarn failed"
fi
