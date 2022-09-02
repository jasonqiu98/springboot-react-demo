#!/bin/bash

# -----------------------------
# ------ BUILD BACKEND --------
# -----------------------------

mvn clean package

# -----------------------------
# ------ BUILD FRONTEND -------
# -----------------------------

cd frontend
npm i
npm run build
cd ..

# -----------------------------
# ------ DOCKER VOLUMES -------
# -----------------------------

cd volumes

[ ! -d pgdata ] && mkdir pgdata

[ ! -d redis-master-config ] && mkdir redis-master-config
[ ! -d redis-master-config/data ] && mkdir redis-master-config/data

[ ! -d redis-replica-config ] && mkdir redis-replica-config
[ ! -d redis-replica-config/data ] && mkdir redis-replica-config/data

cd ..

# -----------------------------
# ---- DOCKER COMPOSE UP ------
# -----------------------------

docker compose up

# if you want to run the applications on the backend, uncomment the following line

# docker compose up -d
