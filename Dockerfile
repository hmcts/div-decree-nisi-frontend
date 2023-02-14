FROM hmctspublic.azurecr.io/base/node:12-alpine as runtime
COPY --chown=hmcts:hmcts package.json yarn.lock ./
RUN yarn install --production && yarn cache clean

COPY . .
EXPOSE 3000
