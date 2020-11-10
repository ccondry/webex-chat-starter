#!/bin/sh
echo "removing webex-v4-toolbox-ui website files..."
rm -rf /var/www/toolbox/webex-v4/*
if [ $? -eq 0 ]; then
  echo "successfully removed webex-v4-toolbox-ui website files."
else
  echo "failed to remove webex-v4-toolbox-ui website files."
fi
