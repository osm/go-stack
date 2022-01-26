package router

import (
	"context"
	"embed"
	"fmt"
	"io/fs"
	"io/ioutil"
	"net/http"
	"path/filepath"
	"strings"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/rs/cors"

	"github.com/osm/go-stack/auth"
	"github.com/osm/go-stack/postgres"
)

type Router struct {
	auth          *auth.Auth
	fileUploadDir string
	frontendFS    embed.FS
	graphql       *handler.Server
	pg            *postgres.Client
	playground    bool
}

func NewRouter(opts ...Option) *chi.Mux {
	ro := &Router{}

	for _, opt := range opts {
		opt(ro)
	}

	r := chi.NewRouter()

	r.Use(cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:4000", "http://localhost:5000"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
		Debug:            false,
	}).Handler)

	if ro.auth != nil {
		r.Use(ro.auth.Middleware())
	}

	r.Use(middleware.Logger)
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Recoverer)

	if ro.playground {
		r.Handle("/playground", playground.Handler("Playground", "/graphql"))
	}

	if ro.graphql != nil {
		r.Handle("/graphql", ro.graphql)
	}

	if ro.fileUploadDir != "" {
		r.Get("/todos/{todoID}/files/{id}", func(w http.ResponseWriter, r *http.Request) {
			parts := strings.Split(r.Header.Get("Authorization"), "Bearer ")
			if len(parts) != 2 {
				w.WriteHeader(http.StatusUnauthorized)
				w.Write([]byte("unauthorized\r\n"))
				return
			}

			user, err := ro.auth.VerifyJWT(parts[1])
			if err != nil {
				w.WriteHeader(http.StatusUnauthorized)
				w.Write([]byte("unauthorized\r\n"))
				return
			}

			todoID := chi.URLParam(r, "todoID")
			if err := ro.pg.HasTodoAccess(context.Background(), user.UserID, todoID); err != nil {
				w.WriteHeader(http.StatusUnauthorized)
				w.Write([]byte("unauthorized\r\n"))
				return
			}

			fileID := chi.URLParam(r, "id")
			todoFile, err := ro.pg.GetTodoFile(context.Background(), fileID)
			if err != nil {
				w.WriteHeader(http.StatusNotFound)
				w.Write([]byte("not found\r\n"))
				return
			}

			data, err := ioutil.ReadFile(filepath.Join(ro.fileUploadDir, todoFile.FileSystemID))
			if err != nil {
				w.WriteHeader(http.StatusNotFound)
				w.Write([]byte("not found\r\n"))
				return
			}

			w.Header().Set("Content-Length", fmt.Sprintf("%d", len(data)))
			w.Header().Set("Content-Type", "text/plain")
			w.Header().Set("Content-Disposition", "inline")
			w.WriteHeader(http.StatusOK)
			w.Write(data)
			return
		})
	}

	files, _ := fs.ReadDir(ro.frontendFS, "frontend/dist")
	if len(files) > 0 {
		for _, f := range files {
			n := f.Name()

			if n == "index.html" {
				r.Get("/*", func(w http.ResponseWriter, r *http.Request) {
					http.ServeFile(w, r, filepath.Join("frontend", "dist", "index.html"))
				})
			} else {
				r.Get("/"+n, func(w http.ResponseWriter, r *http.Request) {
					http.ServeFile(w, r, filepath.Join("frontend", "dist", n))
				})
			}
		}
	}

	return r
}
