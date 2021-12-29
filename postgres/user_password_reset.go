package postgres

import (
	"context"
	"database/sql"

	"github.com/georgysavva/scany/pgxscan"

	"github.com/osm/go-stack/graphql/model"
	"github.com/osm/go-stack/tools"
)

func (c *Client) GetUserByPasswordResetToken(ctx context.Context, token string) (*model.User, error) {
	query := `
		SELECT u.id, u.username, u.email, u.first_name, u.last_name, u.created_at, u.updated_at
		FROM "user" u
		INNER JOIN user_password_reset upr ON upr.user_id = u.id
		WHERE upr.token = $1 AND upr.deleted_at IS NULL AND u.deleted_at IS NULL
	`

	user := model.User{}
	if err := pgxscan.Get(ctx, c.pool, &user, query, token); err == sql.ErrNoRows {
		return nil, nil
	} else if err != nil {
		return nil, err
	}

	return &user, nil
}

func (c *Client) InsertPasswordReset(ctx context.Context, input map[string]interface{}) error {
	if _, err := c.pool.Exec(
		ctx,
		`INSERT INTO user_password_reset (id, user_id, token) VALUES($1, $2, $3)`,
		tools.NewUUID(), input["userID"], input["token"],
	); err != nil {
		return err
	}
	return nil
}

func (c *Client) DeleteUserPasswordReset(ctx context.Context, token string) error {
	if _, err := c.pool.Exec(
		ctx,
		`UPDATE user_password_reset SET deleted_at = now() WHERE token = $1`,
		token,
	); err != nil {
		return err
	}
	return nil
}
