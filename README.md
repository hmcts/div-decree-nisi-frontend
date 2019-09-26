# Divorce Decree Nisi [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This is the frontend application for the Decree Nisi journey, Once the respondent has responded the petitioner can then apply for a Decree Nisi, and this repo builds the frontend for that journey.

## Setup

**Install dependencies**

```shell
$ yarn install
```


**Start application**

Then you can use the following commands in different terminal sessions:

```shell
`docker-compose up`
```

```shell
$ yarn mocks
```

```shell
$ yarn dev
```

The application will now be running on ```https://localhost:3000```.

Locally this will also create a new endpoint ```"/session"``` where you can view and edit the current session
(Note: each time you login/logout of IDAM the session will be reset)

## Testing

```shell
$ yarn test
```

**Run Functional tests locally**

1. create local.yml file in config folder with the contents:
```yml
tests:
  functional:
    proxy:
    proxyByPass:
```

2. run
```shell
yarn test:functional
```

**Run Functional tests locally against AAT**

1. Create remote-config.json file
2. Copy SCM config
3. Add "TEST_URL" with AAT url
4. Run `yarn test:functional:remote`

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
