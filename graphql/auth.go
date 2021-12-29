package graphql

import (
	"context"
	"errors"

	"github.com/osm/go-stack/auth"
)

func (r *Resolver) hasUserAccess(ctx context.Context, userID string) error {
	au, err := auth.FromContext(ctx)
	if err != nil {
		return err
	}
	if au.UserID != userID {
		return errors.New("user not authorized to access this resource")
	}

	return nil
}

func (r *Resolver) hasTodoAccess(ctx context.Context, userID, todoID string) error {
	if err := r.hasUserAccess(ctx, userID); err != nil {
		return nil
	}

	return r.pg.HasTodoAccess(ctx, userID, todoID)
}
