package graphql

import (
	"github.com/osm/go-stack/auth"
	"github.com/osm/go-stack/mailgun"
	"github.com/osm/go-stack/postgres"
	"github.com/osm/go-stack/redis"
)

type ResolverOption func(*Resolver)

func WithAuth(auth *auth.Auth) ResolverOption {
	return func(r *Resolver) {
		r.auth = auth
	}
}

func WithFileUploadDir(fileUploadDir string) ResolverOption {
	return func(r *Resolver) {
		r.fileUploadDir = fileUploadDir
	}
}

func WithPostgres(pg *postgres.Client) ResolverOption {
	return func(r *Resolver) {
		r.pg = pg
	}
}

func WithRedis(redis *redis.Client) ResolverOption {
	return func(r *Resolver) {
		r.redis = redis
	}
}

func WithMailgun(mailgun *mailgun.Client) ResolverOption {
	return func(r *Resolver) {
		r.mailgun = mailgun
	}
}
