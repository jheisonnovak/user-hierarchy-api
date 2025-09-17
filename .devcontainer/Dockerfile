FROM node:23-alpine3.20


RUN apk update && apk add --no-cache \
    sudo \
    git \
    postgresql-client \
    && rm -rf /var/cache/apk/*

RUN yarn global add @nestjs/cli

USER node

WORKDIR /var/api

EXPOSE 3000 9229

CMD ["sleep", "infinity"]