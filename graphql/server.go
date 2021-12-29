package graphql

import (
	"context"
	"net/http"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/gorilla/websocket"
	"github.com/vektah/gqlparser/v2/gqlerror"

	"github.com/osm/go-stack/auth"
	"github.com/osm/go-stack/graphql/generated"
)

type Server struct {
	resolver      *Resolver
	auth          *auth.Auth
	introspection bool
}

var mb int64 = 1 << 20

func NewServer(opts ...Option) *handler.Server {
	s := &Server{}

	for _, opt := range opts {
		opt(s)
	}

	srv := handler.New(
		generated.NewExecutableSchema(
			generated.Config{Resolvers: s.resolver},
		),
	)

	srv.SetErrorPresenter(func(ctx context.Context, e error) *gqlerror.Error {
		return graphql.DefaultErrorPresenter(ctx, e)
	})

	srv.AddTransport(&transport.Websocket{
		InitFunc: s.resolver.auth.WebSocketInitFunc,
		Upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
		},
		KeepAlivePingInterval: 10 * time.Second,
	})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})
	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.MultipartForm{
		MaxMemory:     32 * mb,
		MaxUploadSize: 50 * mb,
	})

	srv.SetQueryCache(lru.New(1000))

	if s.introspection {
		srv.Use(extension.Introspection{})
	}

	srv.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New(100),
	})

	return srv
}
