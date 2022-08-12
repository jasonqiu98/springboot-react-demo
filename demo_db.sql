-- create a database called 'demo_db' in the instance of PostgreSQL
-- and then run the SQL script

drop schema if exists client cascade;

create schema client;

drop table if exists client.client;

create table client.client
(
    id    bigint generated by default as identity
        constraint client_pk
            primary key,
    first_name  varchar(32) not null,
    last_name  varchar(32) not null,
    email varchar(32) not null,
    gender int2 not null,   -- 0: female, 1: male, 2: others
        constraint email
            unique (email)  -- multi-column  candidate key
);

insert into client.client (first_name, last_name, email, gender)
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