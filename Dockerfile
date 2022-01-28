FROM mhart/alpine-node:14
WORKDIR /usr/src/app
COPY frontend .
RUN yarn
ARG GRAPHQL_URL "${GRAPHQL_URL:-http://localhost:4000/graphql}"
ARG GRAPHQL_WS_URL "${GRAPHQL_WS_URL:-ws://localhost:4000/graphql}"
RUN yarn build

FROM golang:1.17-alpine
WORKDIR /go/src/app
COPY . .
RUN mkdir -p /go/src/app/frontend/dist
COPY --from=0 /usr/src/app/dist/* /go/src/app/frontend/dist/
RUN go get -d -v ./...
RUN go install -v ./...

ENTRYPOINT ["go-stack"]
