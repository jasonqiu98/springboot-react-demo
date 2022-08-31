FROM node:16.16.0

RUN [ "mkdir", "build" ]

COPY build/ ./build

RUN [ "npm", "install", "-g", "serve" ]

ENTRYPOINT [ "serve", "-s", "./build" ]

# https://segmentfault.com/a/1190000021828209