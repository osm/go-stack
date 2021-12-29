package redis

import (
	"context"

	"github.com/go-redis/redis/v8"
)

type Client struct {
	conn *redis.Client
}

func (c *Client) Close() {
	c.conn.Close()
}

func (c *Client) Subscribe(ctx context.Context, name string) *redis.PubSub {
	return c.conn.Subscribe(ctx, name)
}

func (c *Client) Publish(ctx context.Context, name string, payload interface{}) *redis.IntCmd {
	return c.conn.Publish(ctx, name, payload)
}

func NewClient(opts ...Option) *Client {
	c := &Client{}

	for _, opt := range opts {
		opt(c)
	}

	return c
}
