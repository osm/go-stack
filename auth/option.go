package auth

import (
	"encoding/base64"

	"github.com/golang-jwt/jwt/v4"
)

type Option func(*Auth)

func WithIssuer(issuer string) Option {
	return func(a *Auth) {
		a.issuer = issuer
	}
}

func WithPrivateKey(privateKeyBase64 string) Option {
	return func(a *Auth) {
		var privateKeyRaw []byte
		var err error

		if privateKeyRaw, err = base64.StdEncoding.DecodeString(privateKeyBase64); err != nil {
			panic(err)
		}

		if a.privateKey, err = jwt.ParseEdPrivateKeyFromPEM(privateKeyRaw); err != nil {
			panic(err)
		}
	}
}

func WithPublicKey(publicKeyBase64 string) Option {
	return func(a *Auth) {
		var publicKeyRaw []byte
		var err error

		if publicKeyRaw, err = base64.StdEncoding.DecodeString(publicKeyBase64); err != nil {
			panic(err)
		}

		if a.publicKey, err = jwt.ParseEdPublicKeyFromPEM(publicKeyRaw); err != nil {
			panic(err)
		}
	}
}
