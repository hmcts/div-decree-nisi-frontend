FROM hmctspublic.azurecr.io/base/node:16-alpine as runtime
USER hmcts
COPY --chown=hmcts:hmcts package.json yarn.lock ./
RUN yarn install && yarn cache clean

COPY . .
EXPOSE 3000
