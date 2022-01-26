package postgres

import (
	"context"
	"database/sql"
	"embed"
	"fmt"
	"net/url"
	"strings"

	"github.com/jackc/pgx/v4/pgxpool"
	_ "github.com/lib/pq"
	"github.com/osm/migrator"
)

type Option func(*Client)

func WithConn(conn string, migrationsFS embed.FS) Option {
	return func(c *Client) {
		var err error
		u, err := url.Parse(conn)
		if err != nil {
			panic(err)
		}

		parts := strings.Split(u.Host, ":")
		host := parts[0]
		port := "5432"
		if len(parts) == 2 {
			port = parts[1]
		}

		cs := fmt.Sprintf(
			"host=%s port=%s dbname=%s",
			host,
			port,
			strings.Trim(u.Path, "/"),
		)

		for k, v := range u.Query() {
			cs = fmt.Sprintf("%s %s=%s", cs, k, v[0])
		}

		if u.User != nil {
			cs = fmt.Sprintf("%s user=%s", cs, u.User.Username())
		}
		if password, hasPass := u.User.Password(); hasPass {
			cs = fmt.Sprintf("%s password=%s", cs, password)
		}

		var db *sql.DB

		if db, err = sql.Open("postgres", cs); err != nil {
			panic(err)
		}

		if err = migrator.ToLatest(db, getRepository(migrationsFS)); err != nil {
			panic(err)
		}

		pool, err := pgxpool.Connect(context.Background(), cs)
		if err != nil {
			panic(err)
		}
		c.pool = pool

	}
}
