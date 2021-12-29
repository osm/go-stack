package mailgun

import (
	"context"

	"github.com/mailgun/mailgun-go/v4"

	"github.com/osm/go-stack/postgres"
)

type Client struct {
	mailgun *mailgun.MailgunImpl
	sender  string
	pg      *postgres.Client
}

func NewClient(opts ...Option) *Client {
	c := &Client{}

	for _, opt := range opts {
		opt(c)
	}

	return c
}

func (c *Client) Send(ctx context.Context, subject, body, recipient string) error {
	m := c.mailgun.NewMessage(c.sender, subject, body, recipient)
	_, externalID, err := c.mailgun.Send(ctx, m)

	data := map[string]interface{}{
		"external_id": externalID,
		"sender":      c.sender,
		"subject":     subject,
		"body":        body,
		"recipient":   recipient,
	}
	if err != nil {
		data["error"] = err.Error()
	}

	return c.pg.InsertMailgunEmail(ctx, data)
}
