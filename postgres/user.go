package postgres

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/georgysavva/scany/pgxscan"

	"github.com/osm/go-stack/graphql/model"
	"github.com/osm/go-stack/tools"
)

func (c *Client) GetUser(ctx context.Context, id string) (*model.User, error) {
	query := `
		SELECT id, username, email, first_name, last_name, created_at, updated_at
		FROM "user"
		WHERE id = $1 AND deleted_at IS NULL
	`

	user := model.User{}
	if err := pgxscan.Get(ctx, c.pool, &user, query, id); err == sql.ErrNoRows {
		return nil, nil
	} else if err != nil {
		return nil, err
	}

	return &user, nil
}

func (c *Client) GetUserByUsername(ctx context.Context, username string) (*model.User, error) {
	query := `
		SELECT id, username, email, first_name, last_name, created_at, updated_at
		FROM "user"
		WHERE username = $1 AND deleted_at IS NULL
	`

	user := model.User{}
	if err := pgxscan.Get(ctx, c.pool, &user, query, username); err == sql.ErrNoRows {
		return nil, nil
	} else if err != nil {
		return nil, err
	}

	return &user, nil
}

func (c *Client) GetUserPassword(ctx context.Context, id string) (*model.UserWithPassword, error) {
	query := `
		SELECT id, username, email, password, first_name, last_name, created_at, updated_at
		FROM "user"
		WHERE id = $1 AND deleted_at IS NULL
	`

	user := model.UserWithPassword{}
	if err := pgxscan.Get(ctx, c.pool, &user, query, id); err == sql.ErrNoRows {
		return nil, nil
	} else if err != nil {
		return nil, err
	}

	return &user, nil
}

func (c *Client) GetUserPasswordByUsername(ctx context.Context, username string) (*model.UserWithPassword, error) {
	query := `
		SELECT id, username, email, password, first_name, last_name, created_at, updated_at
		FROM "user"
		WHERE username = $1 AND deleted_at IS NULL
	`

	user := model.UserWithPassword{}
	if err := pgxscan.Get(ctx, c.pool, &user, query, username); err == sql.ErrNoRows {
		return nil, nil
	} else if err != nil {
		return nil, err
	}

	return &user, nil
}

func (c *Client) InsertUser(ctx context.Context, input map[string]interface{}) (*model.User, error) {
	query := `
		INSERT INTO "user" (id, username, email, password) VALUES($1, $2, $3, $4)
		RETURNING id, username, email, first_name, last_name, created_at, updated_at
	`

	var user model.User
	if err := pgxscan.Get(
		ctx,
		c.pool,
		&user,
		query,
		tools.NewUUID(), input["username"], input["email"], input["password"],
	); err != nil {
		return nil, err
	}

	return &user, nil
}

func (c *Client) UpdateUser(ctx context.Context, id string, patch map[string]interface{}) (*model.User, error) {
	keys := getSortedKeys(patch)

	var toUpdate string
	params := []interface{}{id}
	for idx, key := range keys {
		toUpdate = fmt.Sprintf(`%s%s = $%d, `, toUpdate, toSnakeCase(key), idx+2)
		params = append(params, patch[key])
	}

	query := fmt.Sprintf(`
		UPDATE "user"
		SET updated_at = now(), %s
		WHERE id = $1
		RETURNING id, username, email, first_name, last_name, created_at, updated_at
	`, toUpdate[0:len(toUpdate)-2])

	var user model.User
	if err := pgxscan.Get(
		ctx,
		c.pool,
		&user,
		query,
		params...,
	); err != nil {
		return nil, err
	}

	return &user, nil
}

func (c *Client) DeleteUser(ctx context.Context, id string) error {
	if _, err := c.pool.Exec(ctx, `UPDATE "user" SET deleted_at = now() WHERE id = $1`, id); err != nil {
		return err
	}
	return nil
}
