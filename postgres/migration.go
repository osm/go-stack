package postgres

import (
	"os"
	"path/filepath"

	_ "github.com/lib/pq"
	"github.com/osm/migrator/repository"
)

func getRepository() repository.Source {
	workDir, _ := os.Getwd()
	migrations := filepath.Join(workDir, "migrations")
	return repository.FromFiles(migrations)
}
