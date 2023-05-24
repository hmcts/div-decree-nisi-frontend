# ---- Base image ----
FROM hmctspublic.azurecr.io/base/node:16-alpine as base
USER root
RUN corepack enable
RUN apk add git
USER hmcts
COPY --chown=hmcts:hmcts . .
RUN yarn install

# ---- Runtime image ----
FROM base as runtime
COPY . .
COPY /assets/main.* /opt/app/dist/
EXPOSE 3000
CMD ["yarn", "run", "start"]
