FROM hmctspublic.azurecr.io/base/node:14-alpine as runtime
COPY --chown=hmcts:hmcts package.json yarn.lock yarn-audit-known-issues ./
RUN yarn cache clean
RUN yarn set version berry
RUN yarn install --ignore-scripts

COPY . .
EXPOSE 3000
