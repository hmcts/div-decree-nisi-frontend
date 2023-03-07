# ---- Base image ----

FROM hmctspublic.azurecr.io/base/node:14-alpine as base

ENV WORKDIR /opt/app
WORKDIR ${WORKDIR}

COPY --chown=hmcts:hmcts package.json yarn.lock yarn-audit-known-issues ./
RUN yarn config set proxy "$http_proxy" && yarn config set https-proxy "$https_proxy"
RUN yarn install --production  \
    && yarn cache clean

# ---- Build image ----
FROM base as build
COPY --chown=hmcts:hmcts . ./

USER root
RUN apk add git
USER hmcts

RUN PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true yarn install \
    && yarn setup \
    && rm -rf /opt/app/.git

# ---- Runtime image ----
FROM base as runtime
COPY --from=build ${WORKDIR}/app app/
COPY --from=build ${WORKDIR}/config config/
COPY --from=build ${WORKDIR}/public public/
COPY --from=build ${WORKDIR}/.yarn .yarn/
COPY --from=build ${WORKDIR}/server.js ${WORKDIR}/app.js ./
COPY --from=build ${WORKDIR}/package.json ${WORKDIR}/yarn.lock ${WORKDIR}/.yarnrc.yml ./


EXPOSE 3000
CMD ["yarn", "start" ]
