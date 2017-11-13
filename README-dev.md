# Development
Instructions to get PatientFocus up and running in your development environment.
## Setup
Modify docker-compose-dev.yml in this directory
```
volumes:
    - <your local db path>:/var/lib/postgresql/data
backend:
  environment:
    POSTGRES_HOST: <ip address of your server>
```
Modify client/nginx/default.conf
```
upstream backend {
  server <ip address of your server>:9000;
}
```
DO NOT use localhost or 127.0.0.1 as that is address inside the container. It will go nowhere.

## Makefile
The makefile will allow you to build the project from here.
### Usage
make - with no arguments will build frontend and backend image
make frontend  - just frontend
make server - just backend
make dev - will start up all services defined in docker-compose-dev.yml
