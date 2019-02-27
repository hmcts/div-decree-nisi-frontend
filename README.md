# Divorce Decree Nisi

## Getting started

#### Install dependencies

```shell
$ yarn install
```

#### Start application

Then you can use the following commands in different terminal sessions:

```shell
$ yarn mocks
```

```shell
$ yarn dev
```

The application will now be running on ```https://localhost:3000```.

Locally this will also create a new URL of ```"/session"``` where you can view and edit the current session
(Note: each time you login/logout of IDAM the session will be reset)

#### Test application

```shell
$ yarn test
```

#### Run Functional tests locally

1. create local.yml file in config folder with the contents:
```yml
tests:
  functional:
    proxy:
    proxyByPass:
```

2. run
```shell
$ yarn test:functional
```

#### Run Functional tests locally against AAT

1. Create remote-config.json file 
2. Copy SCM config
3. Add "TEST_URL" with AAT url
4. Run `yarn test:functional:remote`

#### Using docker

##### Prerequisites: base image

This projects uses a base image you may need to pull or locally build.

If you do not have access to the `hmcts` registry (as it is not publicly available), here is [the project](https://github.com/hmcts/cnp-node-base#building-images-locally) giving the source code and instructions on how to build these base images.

Otherwise just login to ACR as described in the project linked above.

##### Instructions

```shell
$ docker build -t <image name> .

#...Once the build has finished ...

$ docker run -it -p 3000:3000 <image name>
```

Create remote-config.json file 
Copy SCM config
Add "TEST_URL" with AAT url
Run `yarn test:functional:remote

Again, the project will listen to the port 3000 as per the local application start described above.

