# Backend

## Requirements
go-lang
docker
docker-compose
Makefile

## Setup
1. In Dockerfile, make sure your WORKDIR is the same
2. In docker-compose-dev.yml, set the local directory
```
volumes:
    - <local directory>:/var/lib/postgresql/data
```
3. Set environment variables for POSTGRES_USER and POSTGRES_PASSWORD. Remove from yml file.

## Build Image
make build

## Test
make dev

use favorite postgres client to connect on port 5432
