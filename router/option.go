package router

import (
	"embed"

	"github.com/99designs/gqlgen/graphql/handler"

	"github.com/osm/go-stack/auth"
	"github.com/osm/go-stack/postgres"
)

type Option func(*Router)

func WithAuth(auth *auth.Auth) Option {
	return func(r *Router) {
		r.auth = auth
	}
}

func WithGraphql(graphql *handler.Server) Option {
	return func(r *Router) {
		r.graphql = graphql
	}
}

func WithPostgres(pg *postgres.Client) Option {
	return func(r *Router) {
		r.pg = pg
	}
}

func WithPlayground() Option {
	return func(r *Router) {
		r.playground = true
	}
}

func WithFrontend(frontendFS embed.FS) Option {
	return func(r *Router) {
		r.frontendFS = frontendFS
	}
}

func WithFileUploadDir(fileUploadDir string) Option {
	return func(r *Router) {
		r.fileUploadDir = fileUploadDir
	}
}
