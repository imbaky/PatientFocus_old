frontend:
	$(MAKE) -C client build

server:
	$(MAKE) -C backend build

all: frontend server

dev:
	docker-compose -f docker-compose-dev.yml down
	docker-compose -f docker-compose-dev.yml up
