#!/bin/sh
echo "removing toolbox-landing-ui website files..."
rm -rf /var/www/toolbox/landing/*
if [ $? -eq 0 ]; then
  echo "successfully removed toolbox-landing-ui website files."
else
  echo "failed to remove toolbox-landing-ui website files."
fi
