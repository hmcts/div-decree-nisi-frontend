# ---- Base image ----
FROM node:8.12.0-stretch as base
ENV WORKDIR /opt/app
WORKDIR ${WORKDIR}
COPY package.json yarn.lock ./
RUN yarn install --production \
    && yarn cache clean

# ---- Build image ----
# This images pulls the needed dev dependencies
# then builds the different bundles and finally
# Removes node dependencies for next images
# build convenience
FROM base as build
RUN yarn install \
    && yarn cache clean
COPY . .
RUN yarn setup && rm -rf node_modules/

# ---- Runtime image ----
FROM base as runtime
EXPOSE 3000
COPY --from=build $WORKDIR ./
CMD [ "yarn", "start" ]
