FROM hmctspublic.azurecr.io/base/node/alpine-lts-10:10-alpine as runtime
COPY --chown=hmcts:hmcts package.json yarn.lock ./
RUN yarn install --production && rm -r ~/.cache/yarn

COPY . .
EXPOSE 3000
