package postgres

import (
	"context"
	"database/sql"
	"errors"
)

func (c *Client) HasTodoAccess(ctx context.Context, userID, todoID string) error {
	query := `
		SELECT id
		FROM todo
	 	WHERE user_id = $1 AND id = $2 AND deleted_at IS NULL
	`

	var id string
	if err := c.pool.QueryRow(ctx, query, userID, todoID).Scan(&id); err == sql.ErrNoRows || id == "" {
		return errors.New("user not authorized to access this resource")
	}

	return nil
}
