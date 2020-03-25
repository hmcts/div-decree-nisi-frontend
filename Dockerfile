FROM hmctspublic.azurecr.io/base/node:12-alpine as runtime
COPY --chown=hmcts:hmcts package.json yarn.lock ./
RUN yarn install --production && rm -r ~/.cache/yarn

COPY . .
EXPOSE 3000
