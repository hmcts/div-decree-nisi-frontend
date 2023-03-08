FROM hmctspublic.azurecr.io/base/node:14-alpine as base
COPY --chown=hmcts:hmcts package.json yarn.lock yarn-audit-known-issues ./
RUN yarn cache clean
RUN yarn set version berry
RUN yarn install

COPY . .
EXPOSE 3000
