# Divorce Decree Nisi

## Getting started

####Install dependencies:

`yarn install`

####Start application:

`docker-compose up`

`yarn mocks`

`yarn dev`

The application will now be running on ```https://localhost:3000```.

Locally this will also create a new URL of ```"/session"``` where you can view and edit the current session
(Note: each time you login/logout of IDAM the session will be reset)

####Test application:

`yarn test`

####Run Functional tests locally

1. create local.yml file in config folder with the contents:
```
tests:
  functional:
    proxy:
    proxyByPass:
```

2. run `yarn test:functional`

####Run Functional tests locally againest AAT

Create remote-config.json file 
Copy SCM config
Add "TEST_URL" with AAT url
Run `yarn test:functional:remote