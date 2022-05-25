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

1. Create remote-config.json file
2. Copy SCM config
3. Add "TEST_URL" with AAT url
4. Run `yarn test:functional:remote`

### Running additional tests in the Jenkins PR Pipeline

1. Add one or more appropriate labels to your PR in GitHub. Valid labels are:

- ```enable_html_test```
- ```enable_full_functional_test```
- ```enable_fortify_scan```
- ```enable_all```

2. Trigger a build of your PR in Jenkins.  Once the regular pipeline completes, the nightly pipeline will trigger to execute your chosen test(s).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
