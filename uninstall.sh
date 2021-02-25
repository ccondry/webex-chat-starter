#!/bin/sh
echo "removing webex-links-homepage website files..."
rm -rf /var/www/html/static/webex/v4prod
if [ $? -eq 0 ]; then
  echo "successfully removed webex-links-homepage website files."
else
  echo "failed to remove webex-links-homepage website files."
fi
