package postgres

import (
	"embed"

	_ "github.com/lib/pq"
	"github.com/osm/migrator/repository"
)

func getRepository(migrationsFS embed.FS) repository.Source {
	return repository.FromEmbedded(migrationsFS, "migrations")
}
