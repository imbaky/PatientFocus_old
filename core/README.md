# Backend

## Requirements
go-lang
docker
docker-compose
Makefile

## Golang

To build an executable in go run `go build` in the directory that contains your main function.
You can also run without the executable by type `go run main.go`

Use `go get` in the command line to get any packages you use that are not in the standard library and need to be imported.

In order to test in go, create a file in the directory of the package you wish to test containing all your tests.
The file will have this format: "*_test.go".

### Test by running go test.

This video is great for getting more familiar with go-tooling. Code coverage, testing etc...
https://www.youtube.com/watch?v=uBjoTxosSys

### Documenting:
The convention for commenting in go is each function should have a comment above it that begins with the name of the function and what it does.

Each package should begin with a comment and each struct and interface as well. It is important to have this above each because documents similar to JavaDoc can be generated:

- `godoc -http <your_port_here>`

- Visit localhost:you_port_here to see the documentation.%

## Docker

### Setup
1. In Dockerfile, make sure your WORKDIR is where your files are.
2. In Dockerfile, set ENV variables for POSTGRES_USER and POSTGRES_PASSWORD. Remove from yml file.
3. In docker-compose-dev.yml, set the local directory
```
volumes:
    - <local directory>:/var/lib/postgresql/data
```

### Build Image
make build

### Test
make dev

Use favorite postgres client to connect on port 5432. If there was no patient table, there should be now.

