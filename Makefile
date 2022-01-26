.PHONY: all gql frontend clean docker

all:
	go build

gql:
	go run github.com/99designs/gqlgen generate
	go run gqlgen/gqlgen.go

frontend:
	cd frontend && yarn && yarn build

clean:
	rm -f go-stack
	rm -f frontend/dist/*
	rm -rf frontend/node_modules

docker:
	make clean
	docker build .
