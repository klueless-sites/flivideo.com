---
layout: ~/layouts/BaseLayout.astro
title: Docker
---

## Overview

Setup Dockers on Mac

### Docker Settings

If you have a big database to restore, you may need to play around with your docker settings.

I needed to increase my Disk Image Size

## Dockerize Postgres

### Pull containers

```bash
docker pull postgres
docker pull dpage/pgadmin4
```

### Run Postgres Database

```bash
# run Postgres in container
docker run -p 5432:5432 --name pg -e POSTGRES_PASSWORD=postgres postgres:latest

PostgreSQL init process complete; ready for start up.

starting PostgreSQL 15.0 (Debian 15.0-1.pgdg110+1) on x86_64-pc-linux-gnu, compiled by gcc (Debian 10.2.1-6) 10.2.1 20210110, 64-bit
listening on IPv4 address "0.0.0.0", port 5432
listening on IPv6 address "::", port 5432
listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
database system was shut down at 2022-11-05 20:02:59 UTC
database system is ready to accept connections
 ```

### Run PGAdmin 4

```bash
docker run -p 5050:80 --name pgadmin -e "PGADMIN_DEFAULT_EMAIL=admin@admin.com" -e "PGADMIN_DEFAULT_PASSWORD=admin" -d dpage/pgadmin4

open -a Google\ Chrome "http://localhost:5050"
```


### Add a Database

```bash
# get host name
hostname        # AppyDave.local
```

![](/images/docker/register-server.png)
![](/images/docker/register-server-general.png)
![](/images/docker/register-server-connection.png)
![](/images/docker/server-running.png)

```bash
# Load the database from a dump
docker exec -i pg pg_restore  -U postgres -d my_database_development < ~/Downloads/my_database.dump
```

```bash
# creating a new database
docker exec -it pg psql -Upostgres -c "CREATE DATABASE printspeak_development OWNER printspeak"
docker exec -it pg psql -Upostgres -c "CREATE DATABASE printspeak_test OWNER printspeak"

# docker exec -it pg psql -Upostgres -c "DROP DATABASE foodlog_development;"
# docker exec -it pg psql -Upostgres -c "DROP DATABASE foodlog_test;"
# docker exec -it pg psql -Upostgres -c "CREATE USER foodlog WITH SUPERUSER PASSWORD 'foodlog';"
# docker exec -it pg psql -Upostgres -c "CREATE DATABASE foodlog_development OWNER foodlog;"
# docker exec -it pg psql -Upostgres -c "CREATE DATABASE foodlog_test OWNER foodlog;"


# if you need `pv` (pipe viewer)
brew install pv

```