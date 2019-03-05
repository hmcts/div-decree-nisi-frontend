FROM hmcts.azurecr.io/hmcts/base/node/stretch-slim-lts-8 as base
USER root
RUN apt-get update && apt-get install -y bzip2 git
USER hmcts
COPY --chown=hmcts:hmcts package.json yarn.lock ./
RUN yarn install --production

FROM base as runtime
COPY . .
EXPOSE 3000
