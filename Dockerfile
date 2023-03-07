FROM hmctspublic.azurecr.io/base/node:16-alpine as runtime
COPY --chown=hmcts:hmcts package.json yarn.lock yarn-audit-known-issues ./
RUN yarn install && yarn cache clean

COPY . .
EXPOSE 3000
