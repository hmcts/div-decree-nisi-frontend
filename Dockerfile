# ---- Base image ----
FROM hmctspublic.azurecr.io/base/node:16-alpine as base
USER root
USER hmcts
COPY --chown=hmcts:hmcts . .
RUN yarn install && yarn cache clean


# ---- Build image ----
FROM base as build
COPY --chown=hmcts:hmcts . ./

USER root
RUN corepack enable
RUN apk add git
USER hmcts

RUN PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true yarn install \
    && yarn setup \
    && rm -rf /opt/app/.git


# ---- Runtime image ----
FROM base as runtime
COPY . .
EXPOSE 3000
CMD ["node", "server.js" ]
