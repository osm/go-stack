package postgres

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/georgysavva/scany/pgxscan"

	"github.com/osm/go-stack/graphql/model"
	"github.com/osm/go-stack/tools"
)

func (c *Client) GetTodo(ctx context.Context, id string) (*model.Todo, error) {
	query := `
		SELECT id, user_id, title, content, is_done, created_at, updated_at
		FROM todo
	 	WHERE id = $1 AND deleted_at IS NULL
	`

	todo := model.Todo{}
	if err := pgxscan.Get(ctx, c.pool, &todo, query, id); err == sql.ErrNoRows {
		return nil, nil
	} else if err != nil {
		return nil, err
	}

	return &todo, nil
}

func (c *Client) GetTodosPaginated(
	ctx context.Context,
	userID string,
	first int64,
	after *string,
) (*model.Todos, error) {
	params := []interface{}{userID, first + 1}

	query, err := getPaginationQuery(`
		SELECT id, user_id, title, content, is_done, created_at, updated_at
		FROM todo
		WHERE deleted_at IS NULL AND user_id = $1
		ORDER BY created_at DESC, id DESC
		LIMIT $2
	`, after, &params)
	if err != nil {
		return nil, err
	}

	rows, err := c.pool.Query(ctx, query, params...)
	if err != nil {
		return nil, err
	}

	var todos []*model.Todo
	if err := pgxscan.ScanAll(&todos, rows); err != nil {
		return nil, err
	}

	var edges []*model.TodoEdge
	for _, todo := range todos {
		edges = append(edges, &model.TodoEdge{
			Cursor: generateCursor(todo.ID, todo.CreatedAt),
			Node:   todo,
		})
	}

	rowCount := int64(len(edges))
	if rowCount == 0 {
		return &model.Todos{}, nil
	}

	hasNextPage := true
	end := first
	if rowCount < first+1 {
		hasNextPage = false
		end = rowCount
	}

	return &model.Todos{
		Edges: edges[0:end],
		PageInfo: &model.PageInfo{
			StartCursor: &edges[0].Cursor,
			EndCursor:   &edges[end-1].Cursor,
			HasNextPage: hasNextPage,
		},
	}, nil
}

func (c *Client) InsertTodo(
	ctx context.Context,
	userID string,
	input map[string]interface{},
) (*model.Todo, error) {
	query := `
		INSERT INTO todo (id, user_id, title, content) VALUES($1, $2, $3, $4)
		RETURNING id, user_id, title, content, is_done, created_at, updated_at
	`

	var todo model.Todo
	if err := pgxscan.Get(
		ctx,
		c.pool,
		&todo,
		query,
		tools.NewUUID(), userID, input["title"], input["content"],
	); err != nil {
		return nil, err
	}

	return &todo, nil
}

func (c *Client) UpdateTodo(ctx context.Context, id string, patch map[string]interface{}) (*model.Todo, error) {
	keys := getSortedKeys(patch)

	var toUpdate string
	params := []interface{}{id}
	for idx, key := range keys {
		toUpdate = fmt.Sprintf(`%s%s = $%d, `, toUpdate, toSnakeCase(key), idx+2)
		params = append(params, patch[key])
	}

	query := fmt.Sprintf(`
		UPDATE todo
		SET updated_at = now(), %s
		WHERE id = $1
		RETURNING id, user_id, title, content, is_done, created_at, updated_at
	`, toUpdate[0:len(toUpdate)-2])

	var todo model.Todo
	if err := pgxscan.Get(
		ctx,
		c.pool,
		&todo,
		query,
		params...,
	); err != nil {
		return nil, err
	}

	return &todo, nil
}

func (c *Client) DeleteTodo(ctx context.Context, id string) error {
	if _, err := c.pool.Exec(ctx, `UPDATE todo SET deleted_at = now() WHERE id = $1`, id); err != nil {
		return err
	}
	return nil
}
