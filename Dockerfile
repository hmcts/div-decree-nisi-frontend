# ---- Base image ----
FROM hmctspublic.azurecr.io/base/node:16-alpine as base
USER hmcts
COPY --chown=hmcts:hmcts package.json yarn.lock ./
RUN yarn install --production && rm -r ~/.cache/yarn

COPY . .
EXPOSE 3000
