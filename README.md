# Divorce Decree Nisi [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This repo is for the Decree Nisi Frontend and forms part of the online Divorce Application.

## Setup

**Install dependencies**

```shell
yarn install
```

**Start application**

Then you can use the following commands in different terminal sessions:

```shell
docker-compose up redis
```

```shell
yarn mocks
```

```shell
yarn dev
```

The application will now be running on ```https://localhost:3000```.

When the application is up and running, a new endpoint will be exposed called ```"/session"``` where you can view and edit the current session.
This is only be available locally and on AAT environment and is useful for debugging and testing.


## Testing

```shell
yarn test
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

Connect to the VPN

* Make a copy of `config/example-local-aat.yml` as `config/local-aat.yml` (which is ignored by git)

* Substitute any secret values in ***local-aat.yml*** from SCM - Do not add/commit secrets to the example file!

* If you want to point to a PR, modify `tests.functional.url` accordingly.

* Run ``` yarn test:functional:local```. This would your tests to pick up the new `local-aat.yml`.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
