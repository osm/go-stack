package graphql

import (
	"github.com/osm/go-stack/auth"
	"github.com/osm/go-stack/mailgun"
	"github.com/osm/go-stack/postgres"
	"github.com/osm/go-stack/redis"
)

type Resolver struct {
	auth          *auth.Auth
	pg            *postgres.Client
	redis         *redis.Client
	mailgun       *mailgun.Client
	fileUploadDir string
}

func NewResolver(opts ...ResolverOption) *Resolver {
	r := &Resolver{}

	for _, opt := range opts {
		opt(r)
	}

	return r
}
