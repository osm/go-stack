package auth

import (
	"context"
	"crypto"
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/golang-jwt/jwt/v4"

	"github.com/osm/go-stack/tools"
)

const algorithm string = "EdDSA"

type Auth struct {
	issuer     string
	privateKey crypto.PrivateKey
	publicKey  crypto.PublicKey
}

type Details struct {
	UserID string
}

type Claims struct {
	*jwt.StandardClaims
}

type contextKey struct {
	name string
}

var authContextKey = &contextKey{name: "auth"}

func New(opts ...Option) *Auth {
	auth := &Auth{}

	for _, opt := range opts {
		opt(auth)
	}

	return auth
}

func (a *Auth) WebSocketInitFunc(ctx context.Context, initPayload transport.InitPayload) (context.Context, error) {
	auth, hasAuth := initPayload["Authorization"]
	if !hasAuth {
		return ctx, nil
	}

	parts := strings.Split(auth.(string), "Bearer ")
	if len(parts) == 2 {
		details, err := a.VerifyJWT(parts[1])
		if err != nil {
			ctx = context.WithValue(ctx, authContextKey, err)
		} else {
			ctx = context.WithValue(ctx, authContextKey, details)
		}
	}

	return ctx, nil
}

func (a *Auth) Middleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			parts := strings.Split(r.Header.Get("Authorization"), "Bearer ")
			if len(parts) == 2 {
				details, err := a.VerifyJWT(parts[1])
				if err != nil {
					r = r.WithContext(context.WithValue(r.Context(), authContextKey, err))
				} else {
					r = r.WithContext(context.WithValue(r.Context(), authContextKey, details))
				}
			}

			next.ServeHTTP(w, r)
		})
	}
}

func (a *Auth) VerifyJWT(t string) (*Details, error) {
	tok, err := jwt.ParseWithClaims(t, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodEd25519); !ok {
			return nil, errors.New("unexpected signing method")
		}

		return a.publicKey, nil
	})
	if err != nil {
		return nil, err
	}

	if !tok.Valid {
		return nil, errors.New("token is not valid")
	}

	claims := tok.Claims.(*Claims)
	if claims.Issuer != a.issuer {
		return nil, errors.New("invalid issuer")
	}

	return &Details{
		UserID: claims.Subject,
	}, nil
}

func (a *Auth) GenerateJWT(sub string) string {
	t := jwt.New(jwt.GetSigningMethod(algorithm))

	t.Claims = &jwt.StandardClaims{
		Id:        tools.NewUUID(),
		Issuer:    a.issuer,
		IssuedAt:  time.Now().Unix(),
		ExpiresAt: time.Now().Add(time.Second * 8640000).Unix(),
		Subject:   sub,
	}

	tok, _ := t.SignedString(a.privateKey)

	return tok
}

func FromContext(ctx context.Context) (*Details, error) {
	raw := ctx.Value(authContextKey)
	if raw == nil {
		return nil, errors.New("user not authenticated")
	}

	if err, ok := raw.(error); ok {
		return nil, err
	}

	return raw.(*Details), nil
}
