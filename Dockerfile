# ---- Base image ----
FROM hmctspublic.azurecr.io/base/node:16-alpine as base

USER root
RUN corepack enable
USER hmcts

ENV WORKDIR /opt/app
WORKDIR ${WORKDIR}

# ---- Build image ----
FROM base as build

COPY --chown=hmcts:hmcts . ./

RUN yarn setup

# ---- Runtime image ----
FROM base as runtime

COPY --from=build ${WORKDIR}/app app/
COPY --from=build ${WORKDIR}/.yarn .yarn/
COPY --from=build ${WORKDIR}/config config/
COPY --from=build ${WORKDIR}/public public/
COPY --from=build ${WORKDIR}/server.js ${WORKDIR}/app.js ${WORKDIR}/version ./
COPY --from=build ${WORKDIR}/package.json ${WORKDIR}/yarn.lock ${WORKDIR}/.yarnrc.yml ${WORKDIR}/.pnp.cjs ${WORKDIR}/.pnp.loader.mjs ./

EXPOSE 3000
CMD ["yarn", "start" ]
