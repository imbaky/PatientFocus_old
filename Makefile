frontend:
	$(MAKE) -C client build

backend1:
	$(MAKE) -C backend build

all: frontend backend1

dev:
	docker-compose -f docker-compose-dev.yml down
	docker-compose -f docker-compose-dev.yml up
