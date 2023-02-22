FROM hmctspublic.azurecr.io/base/node:16-alpine as base
COPY --chown=hmcts:hmcts package.json yarn.lock ./
RUN yarn install --production

# ---- Runtime imge ----
FROM base as runtime
COPY . .
EXPOSE 3000
