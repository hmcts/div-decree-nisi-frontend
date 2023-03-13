FROM hmctspublic.azurecr.io/base/node:14-alpine as runtime
COPY --chown=hmcts:hmcts package.json yarn.lock ./
RUN yarn cache clean
RUN yarn install

COPY . .
EXPOSE 3000
