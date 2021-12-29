package postgres

import (
	"context"
	"database/sql"

	"github.com/georgysavva/scany/pgxscan"

	"github.com/osm/go-stack/graphql/model"
	"github.com/osm/go-stack/tools"
)

func (c *Client) GetTodoFile(ctx context.Context, id string) (*model.TodoFile, error) {
	query := `
		SELECT id, file_system_id, created_at, updated_at
		FROM todo_file
	 	WHERE id = $1 AND deleted_at IS NULL
	`

	todoFile := model.TodoFile{}
	if err := pgxscan.Get(ctx, c.pool, &todoFile, query, id); err == sql.ErrNoRows {
		return nil, nil
	} else if err != nil {
		return nil, err
	}

	return &todoFile, nil
}

func (c *Client) GetTodoFiles(ctx context.Context, todoID string) ([]*model.TodoFile, error) {
	query := `
		SELECT id, file_system_id, created_at, updated_at
		FROM todo_file
		WHERE deleted_at IS NULL AND todo_id = $1
		ORDER BY created_at DESC, id DESC
	`

	rows, err := c.pool.Query(ctx, query, todoID)
	if err != nil {
		return nil, err
	}

	var todoFiles []*model.TodoFile
	if err := pgxscan.ScanAll(&todoFiles, rows); err != nil {
		return nil, err
	}

	if int64(len(todoFiles)) == 0 {
		return nil, nil
	}

	return todoFiles, nil
}

func (c *Client) InsertTodoFile(ctx context.Context, todoID, fsID string) (*model.TodoFile, error) {
	query := `
		INSERT INTO todo_file (id, todo_id, file_system_id) VALUES($1, $2, $3)
		RETURNING id, file_system_id, created_at, updated_at
	`

	var todoFile model.TodoFile
	if err := pgxscan.Get(
		ctx,
		c.pool,
		&todoFile,
		query,
		tools.NewUUID(), todoID, fsID,
	); err != nil {
		return nil, err
	}

	return &todoFile, nil
}

func (c *Client) DeleteTodoFile(ctx context.Context, id string) error {
	if _, err := c.pool.Exec(ctx, `UPDATE todo_file SET deleted_at = now() WHERE id = $1`, id); err != nil {
		return err
	}
	return nil
}
