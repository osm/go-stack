package mailgun

import (
	"github.com/osm/go-stack/postgres"

	"github.com/mailgun/mailgun-go/v4"
)

type Option func(*Client)

func WithConn(domain, privateAPIKey string) Option {
	return func(c *Client) {
		c.mailgun = mailgun.NewMailgun(domain, privateAPIKey)
		c.mailgun.SetAPIBase(mailgun.APIBaseEU)
	}
}

func WithSender(sender string) Option {
	return func(c *Client) {
		c.sender = sender
	}
}

func WithPostgres(pg *postgres.Client) Option {
	return func(c *Client) {
		c.pg = pg
	}
}
