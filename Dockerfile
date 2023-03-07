FROM hmctspublic.azurecr.io/base/node:14-alpine as runtime
COPY --chown=hmcts:hmcts package.json yarn.lock yarn-audit-known-issues ./
RUN yarn install --production  \
    && yarn cache clean
COPY . .
EXPOSE 3000
