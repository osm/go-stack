package redis

import (
	"context"
	"log"
	"net/url"

	"github.com/go-redis/redis/v8"
)

type Option func(*Client)

func WithConn(conn string) Option {
	return func(c *Client) {
		u, err := url.Parse(conn)
		if err != nil {
			panic(err)
		}

		if p, hasPassword := u.User.Password(); hasPassword {
			c.conn = redis.NewClient(&redis.Options{
				Addr:     u.Host,
				Password: p,
			})
		} else {
			c.conn = redis.NewClient(&redis.Options{
				Addr: u.Host,
			})
		}

		ctx := context.Background()
		if _, err = c.conn.Ping(ctx).Result(); err != nil {
			log.Printf("unable to connect to redis, subscriptions will not work as expected")
		}
	}
}
