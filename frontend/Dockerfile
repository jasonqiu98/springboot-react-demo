FROM node:16.16 AS build

COPY public /home/node/frontend/public
COPY src /home/node/frontend/src
COPY package-lock.json /home/node/frontend
COPY package.json /home/node/frontend

WORKDIR /home/node/frontend
RUN npm i
RUN npm run build

FROM node:16.16
RUN mkdir build
COPY --from=build /home/node/frontend/build/ ./build
RUN npm install -g serve

ENTRYPOINT [ "serve", "-s", "./build" ]

# https://segmentfault.com/a/1190000021828209