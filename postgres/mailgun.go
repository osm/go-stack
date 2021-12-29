package postgres

import (
	"context"

	"github.com/osm/go-stack/tools"
)

func (c *Client) InsertMailgunEmail(ctx context.Context, input map[string]interface{}) error {
	query := `
		INSERT INTO mailgun (id, external_id, sender, subject, body, recipient)
		VALUES($1, $2, $3, $4, $5, $6)
	`

	if _, err := c.pool.Exec(
		ctx,
		query,
		tools.NewUUID(), input["externalID"], input["sender"], input["subject"], input["body"],
		input["recipient"],
	); err != nil {
		return err
	}
	return nil
}
