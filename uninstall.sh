#!/bin/sh
echo "removing cloud-config-toolbox-ui website files..."
rm -rf /var/www/toolbox/cloud-config/*
if [ $? -eq 0 ]; then
  echo "successfully removed cloud-config-toolbox-ui website files."
else
  echo "failed to remove cloud-config-toolbox-ui website files."
fi
