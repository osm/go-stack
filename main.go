package main

import (
	"crypto/tls"
	"flag"
	"log"
	"net/http"

	"github.com/osm/flen"
	"golang.org/x/crypto/acme/autocert"

	"github.com/osm/go-stack/auth"
	"github.com/osm/go-stack/graphql"
	"github.com/osm/go-stack/mailgun"
	"github.com/osm/go-stack/postgres"
	"github.com/osm/go-stack/redis"
	"github.com/osm/go-stack/router"
)

func main() {
	jwtPrivateKey := flag.String(
		"jwt-private-key",
		"LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1DNENBUUF3QlFZREsyVndCQ0lFSU9HYnJoM1FRYlg4L3N6RVdvb21OSXdKVm5xUmxiNDB5cnVUQ3BlanhabWcKLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLQo=",
		"JWT private Ed25519 key",
	)
	jwtPublicKey := flag.String(
		"jwt-public-key",
		"LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUNvd0JRWURLMlZ3QXlFQTIwWEtWTzI5aGFpcEpnN0VYN0cxM3BYRDBrelpQSFVYMTRjQmlUbVJtN2s9Ci0tLS0tRU5EIFBVQkxJQyBLRVktLS0tLQo=",
		"Auth public Ed25519 key",
	)
	jwtIssuer := flag.String(
		"jwt-issuer",
		"go-stack",
		"JWT issuer",
	)
	frontendDir := flag.String(
		"frontend-dir",
		"./frontend/dist",
		"Frontend dir",
	)
	fileUploadDir := flag.String(
		"file-upload-dir",
		"/tmp",
		"File upload dir",
	)
	databaseURL := flag.String(
		"database-url",
		"pg://localhost:5432/go-stack?sslmode=disable",
		"Database URL",
	)
	port := flag.String(
		"port",
		"4000",
		"Listen port",
	)
	redisURL := flag.String(
		"redis-url",
		"redis://localhost:6379",
		"Redis URL",
	)
	mailgunDomain := flag.String(
		"mailgun-domain",
		"",
		"Mailgun domain",
	)
	mailgunAPIKey := flag.String(
		"mailgun-api-key",
		"",
		"Mailgun API key",
	)
	mailgunSender := flag.String(
		"mailgun-sender",
		"",
		"Mailgun sender",
	)
	enablePlayground := flag.Bool(
		"enable-playground",
		false,
		"Enable GraphQL playground",
	)
	letsEncryptDomain := flag.String("lets-encrypt-domain", "", "let's encrypt domain name")
	letsEncryptCertDir := flag.String("lets-encrypt-cert-dir", "certs", "let's encrypt cert dir")
	flen.Parse()

	auth := auth.New(
		auth.WithIssuer(*jwtIssuer),
		auth.WithPrivateKey(*jwtPrivateKey),
		auth.WithPublicKey(*jwtPublicKey),
	)

	pg := postgres.NewClient(
		postgres.WithConn(*databaseURL),
	)
	defer pg.Close()

	redis := redis.NewClient(
		redis.WithConn(*redisURL),
	)
	defer redis.Close()

	resolverOpts := []graphql.ResolverOption{
		graphql.WithAuth(auth),
		graphql.WithPostgres(pg),
		graphql.WithRedis(redis),
		graphql.WithFileUploadDir(*fileUploadDir),
	}

	if *mailgunDomain != "" && *mailgunAPIKey != "" && *mailgunSender != "" {
		mailgun := mailgun.NewClient(
			mailgun.WithConn(*mailgunDomain, *mailgunAPIKey),
			mailgun.WithSender(*mailgunSender),
			mailgun.WithPostgres(pg),
		)
		resolverOpts = append(resolverOpts, graphql.WithMailgun(mailgun))
	}

	gql := graphql.NewServer(
		graphql.WithResolver(
			graphql.NewResolver(resolverOpts...),
		),
		graphql.WithIntrospection(),
	)

	routerOpts := []router.Option{
		router.WithAuth(auth),
		router.WithPostgres(pg),
		router.WithGraphql(gql),
		router.WithFrontend(*frontendDir),
		router.WithFileUploadDir(*fileUploadDir),
	}
	if *enablePlayground {
		routerOpts = append(routerOpts, router.WithPlayground())
	}
	router := router.NewRouter(routerOpts...)

	if *letsEncryptDomain == "" {
		if err := http.ListenAndServe(":"+*port, router); err != nil {
			log.Fatalf("fatal error: %v\n", err)
		}
	} else {
		certManager := autocert.Manager{
			Prompt:     autocert.AcceptTOS,
			HostPolicy: autocert.HostWhitelist(*letsEncryptDomain),
			Cache:      autocert.DirCache(*letsEncryptCertDir),
		}
		tlsConfig := certManager.TLSConfig()
		tlsConfig.GetCertificate = func(h *tls.ClientHelloInfo) (*tls.Certificate, error) {
			return certManager.GetCertificate(h)
		}

		server := http.Server{
			Addr:      ":443",
			Handler:   router,
			TLSConfig: tlsConfig,
		}

		go http.ListenAndServe(":80", certManager.HTTPHandler(nil))
		if err := server.ListenAndServeTLS("", ""); err != nil {
			log.Fatalf("fatal error: %v\n", err)
		}
	}
}
