# go-stack

A web stack based on Postgres, Redis, GraphQL and React.

There is a TODO app to showcase the stack, check out the source code for
inspiration on how to use the different parts of the stack.

## Run backend locally

You will need a Postgres and Redis server installed to run this stack.

```sh
$ make

# This will start go-stack with default JWT certificates and assumes that the
# postgres and redis servers are accessible on localhost on their default
# ports.
# See go-stack -h if you need help.
$ ./go-stack
```

## Run frontend locally

The frontend assumes that you have node and yarn installed and that you are
running the backend on port 4000.

```sh
$ cd frontend
$ yarn
$ yarn start:dev
```

## Build release

```sh
GRAPHQL_URL=https://example.com GRAPHQL_WS_URL=https://example.com make release
```

## Run with let's encrypt

Use the `-lets-encrypt-domain` and `-lets-encrypt-cert-dir` options to start
the server and let let's encrypt generate valid SSL certificates.

## JWT certificates

The stack uses JWT for authentication. Use the following commands to generate
a new set of private and public key. The keys should be used when starting the
backend.

```sh
openssl genpkey -algorithm Ed25519 -out private.pem
openssl pkey -in private.pem -pubout >public.pem
base64 -w0 private.pem >private.pem.base64
base64 -w0 public.pem >public.pem.base64
```

## Cloudflare

If you are using the Cloudflare DNS proxy and want to utilize the gzip
compression in go-stack you will have to disable the Brotli compression in the
Cloudflare control panel.
