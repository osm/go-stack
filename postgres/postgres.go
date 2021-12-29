package postgres

import (
	"github.com/jackc/pgx/v4/pgxpool"
	_ "github.com/lib/pq"
)

type Client struct {
	pool *pgxpool.Pool
}

func (c *Client) Close() {
	c.pool.Close()
}

func NewClient(opts ...Option) *Client {
	c := &Client{}

	for _, opt := range opts {
		opt(c)
	}

	return c
}
