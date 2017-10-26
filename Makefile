frontend:
	$(MAKE) -C client build

backend:
	$(MAKE) -C core build

all: frontend backend

dev:
	docker-compose -f docker-compose-dev.yml down
	docker-compose -f docker-compose-dev.yml up
