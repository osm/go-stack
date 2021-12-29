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
RUN go get -d -v ./...
RUN go install -v ./...
RUN mkdir /frontend
COPY --from=0 /usr/src/app/dist/* /frontend/

ENTRYPOINT ["go-stack"]
