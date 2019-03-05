# dCloud Collaboration Toolbox Landing UI
This is the website UI code for the dCloud Collaboration Toolbox landing page.
It lists the portals you can go to from here while remaining authenticated.

## Installation
```sh
git clone https://gitlab.com/dcloud-collab/toolbox-landing-ui.git
cd toolbox-landing-ui
npm install
```

## Build/Run in Development
```sh
npm run dev
```

## Build/Run in Production
Copy files to your www/html folder (or wherever you have your web server pointing to).
```sh
npm run build
cp toolbox-landing-ui/dist/* /var/www/html/
```
