FROM node:8.12.0-stretch
ENV WORKDIR=/opt/app \
    APP_USER=hmcts
WORKDIR ${WORKDIR}
RUN mkdir -p $WORKDIR \
    && addgroup --system --gid 1001 $APP_USER \
    && adduser --system --gid 1001 -uid 1001 --disabled-password --disabled-login $APP_USER \
    && chown -R $APP_USER:$APP_USER $WORKDIR \
    && chgrp -R $APP_USER $WORKDIR \
    && chmod -R g+s $WORKDIR
COPY package.json yarn.lock ./
RUN yarn install --production
COPY . .
USER $APP_USER
EXPOSE 3000
CMD [ "yarn", "start" ]
