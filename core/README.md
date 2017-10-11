# Backend

## Requirements
go-lang
docker
docker-compose
Makefile

## Setup
1. In Dockerfile, make sure your WORKDIR is where your files are.
2. In Dockerfile, set ENV variables for POSTGRES_USER and POSTGRES_PASSWORD. Remove from yml file.
3. In docker-compose-dev.yml, set the local directory
```
volumes:
    - <local directory>:/var/lib/postgresql/data
```

## Build Image
make build

## Test
make dev

Use favorite postgres client to connect on port 5432. If there was no patient table, there should be now.
