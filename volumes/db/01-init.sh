#!/bin/bash
set -e
export PGPASSWORD=$POSTGRES_PASSWORD;
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  CREATE USER $APP_DB_USER WITH PASSWORD '$APP_DB_PASS';
  CREATE DATABASE $APP_DB_NAME;
  GRANT ALL PRIVILEGES ON DATABASE $APP_DB_NAME TO $APP_DB_USER;
  \connect $APP_DB_NAME $APP_DB_USER
  BEGIN;
    drop schema if exists client cascade;

    create schema client;

    create table client.client
    (
        "id"    bigint generated by default as identity
            constraint client_pk
                primary key,
        "first_name"  varchar(32) not null,
        "last_name"  varchar(32) not null,
        "email" varchar(32) not null,
        "gender" int2 not null,   -- 0: female, 1: male, 2: others
            constraint email
                unique (email)  -- multi-column  candidate key
    );

    insert into client.client ("first_name", "last_name", "email", "gender")
        values ('Clyde', 'Burris', 'cburris0@mapquest.com', 1),
            ('Aline', 'Abela', 'aabela1@php.net', 0),
            ('Deina', 'Potte', 'dpotte2@flickr.com', 0),
            ('Malia', 'McGreil', 'mmcgreil3@hibu.com', 0),
            ('Terence', 'Crampin', 'tcrampin4@tripod.com', 1),
            ('Karissa', 'MacElane', 'kmacelane5@guardian.co.uk', 0),
            ('Margi', 'Newby', 'mnewby6@harvard.edu', 2),
            ('Dom', 'Sinclair', 'dsinclair7@g.co', 1),
            ('Gordie', 'Sperling', 'gsperling8@biblegateway.com', 1),
            ('Elysha', 'Shillum', 'eshillum9@prweb.com', 0),
            ('Benton', 'Slator', 'bslatora@so-net.ne.jp', 1),
            ('Clare', 'Rigts', 'crigtsb@elpais.com', 1),
            ('Winnie', 'Ramsdell', 'wramsdellc@bloomberg.com', 0),
            ('Dionne', 'Lomasna', 'dlomasnad@posterous.com', 2),
            ('Adorne', 'Goundrill', 'agoundrille@nih.gov', 0),
            ('Cesare', 'MacAnespie', 'cmacanespief@nasa.gov', 1),
            ('Leodora', 'Thatcham', 'lthatchamg@prnewswire.com', 0),
            ('Ahmad', 'Simmings', 'asimmingsh@is.gd', 1),
            ('Cchaddie', 'Twigley', 'ctwigleyi@about.com', 1),
            ('Jacquelyn', 'Robbey', 'jrobbeyj@wikispaces.com', 2);

    drop schema if exists user_info cascade;

    create schema user_info;

    create table user_info.user
    (
        "id"    bigint generated by default as identity
            constraint user_pk
                primary key,
        "username"  varchar(32) not null default 'null',
        "password" varchar(64) not null default 'null',
        "email" varchar(32) default null,
        "first_name" varchar(32) default null,
        "last_name" varchar(32) default null,
        "role" int2 not null default 1,    -- 0: admin, 1: user, 2: client
        "enabled" int2 not null default 0, -- 0: init, 1: enabled, -1: disabled (by admin)
        "created_at" timestamp with time zone default null,
        "modified_at" timestamp with time zone default null,
        "delete_flag" int2 default 0,      -- 0: not deleted, 1: deleted
            constraint unique_username
                unique (username),         -- candidate key: username
            constraint unique_email
                unique (email)             -- candidate key: email
    );

    -- (admin, helloworld)
    -- (jasonqiu, helloworld)

    insert into user_info.user ("username", "email", "password", "role", "enabled")
        values ('admin', 'admin@admin.com', '\$2a\$12\$cWMf3YAlgSRpRXOZpbM9deltDLX4iocL3Aw2ydfhaKNJP1yR20JBS', 0, 1),
            ('jasonqiu', 'jingxuan.qiu@outlook.com', '\$2a\$12\$Gh65O.mpRMvyPTSIbZh/duEaPUFM7vpXIznyGD8FA953NxZVq1Hzy', 1, 1);
  COMMIT;
EOSQL