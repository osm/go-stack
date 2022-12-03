package graphql

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"encoding/json"
	"errors"
	"io/ioutil"
	"log"
	"path/filepath"

	"github.com/99designs/gqlgen/graphql"
	"github.com/osm/go-stack/graphql/generated"
	"github.com/osm/go-stack/graphql/model"
	"github.com/osm/go-stack/tools"
)

// Signup is the resolver for the signup field.
func (r *mutationResolver) Signup(ctx context.Context, input model.SignupInput) (*model.User, error) {
	inputData := tools.GetRequestData(ctx, &input)

	if password, ok := inputData["password"].(string); ok {
		inputData["password"] = tools.Hash(password)
	}

	return r.pg.InsertUser(ctx, inputData)
}

// Login is the resolver for the login field.
func (r *mutationResolver) Login(ctx context.Context, input model.LoginInput) (string, error) {
	user, err := r.pg.GetUserPasswordByUsername(ctx, input.Username)
	if err != nil || user == nil {
		return "", errors.New("incorrect username and/or password")
	}

	if ok := tools.CompareHash(input.Password, user.Password); !ok {
		return "", errors.New("incorrect username and/or password")
	}

	return r.auth.GenerateJWT(user.ID), nil
}

// RefreshToken is the resolver for the refreshToken field.
func (r *mutationResolver) RefreshToken(ctx context.Context, input model.RefreshTokenInput) (string, error) {
	details, err := r.auth.VerifyJWT(input.Token)
	if err != nil {
		return "", err
	}

	return r.auth.GenerateJWT(details.UserID), nil
}

// ResetPassword is the resolver for the resetPassword field.
func (r *mutationResolver) ResetPassword(ctx context.Context) (*model.ResetPasswordMutation, error) {
	return &model.ResetPasswordMutation{}, nil
}

// User is the resolver for the user field.
func (r *mutationResolver) User(ctx context.Context, userID string) (*model.UserMutation, error) {
	return &model.UserMutation{UserID: userID}, nil
}

// User is the resolver for the user field.
func (r *queryResolver) User(ctx context.Context, userID string) (*model.User, error) {
	if err := r.hasUserAccess(ctx, userID); err != nil {
		return nil, err
	}

	return r.pg.GetUser(ctx, userID)
}

// Initiate is the resolver for the initiate field.
func (r *resetPasswordMutationResolver) Initiate(ctx context.Context, obj *model.ResetPasswordMutation, input model.InitiatePasswordResetInput) (bool, error) {
	user, err := r.pg.GetUserByUsername(ctx, input.Username)
	if user == nil || err != nil {
		return false, errors.New("user not found")
	}

	token := tools.RandString(64)
	if err := r.pg.InsertPasswordReset(ctx, map[string]interface{}{
		"userID": user.ID,
		"token":  token,
	}); err != nil {
		return false, err
	}

	if r.mailgun != nil {
		if err := r.mailgun.Send(ctx, "Reset password", token, user.Email); err != nil {
			return false, err
		}
	}

	return true, nil
}

// Confirm is the resolver for the confirm field.
func (r *resetPasswordMutationResolver) Confirm(ctx context.Context, obj *model.ResetPasswordMutation, input model.ConfirmPasswordResetInput) (bool, error) {
	user, err := r.pg.GetUserByPasswordResetToken(ctx, input.Token)
	if user == nil || err != nil {
		return false, errors.New("invalid token")
	}

	if user, err = r.pg.UpdateUser(ctx, user.ID, map[string]interface{}{
		"password": tools.Hash(input.Password),
	}); err != nil {
		return false, err
	}

	if err := r.pg.DeleteUserPasswordReset(ctx, input.Token); err != nil {
		return false, err
	}

	return true, nil
}

// CreatedTodos is the resolver for the createdTodos field.
func (r *subscriptionResolver) CreatedTodos(ctx context.Context, userID string) (<-chan *model.Todo, error) {
	if err := r.hasUserAccess(ctx, userID); err != nil {
		return nil, err
	}

	c := make(chan *model.Todo, 1)
	go func() {
		sub := r.redis.Subscribe(ctx, "/users/"+userID+"/todos/created")
		if _, err := sub.Receive(ctx); err != nil {
			return
		}

		ch := sub.Channel()
		for {
			select {
			case m := <-ch:
				var todo model.Todo
				if err := json.Unmarshal([]byte(m.Payload), &todo); err != nil {
					log.Printf("todo subscription: %v\n", err)
					return
				}
				c <- &todo
			case <-ctx.Done():
				sub.Close()
				return
			}
		}
	}()

	return c, nil
}

// UpdatedTodos is the resolver for the updatedTodos field.
func (r *subscriptionResolver) UpdatedTodos(ctx context.Context, userID string) (<-chan *model.Todo, error) {
	if err := r.hasUserAccess(ctx, userID); err != nil {
		return nil, err
	}

	c := make(chan *model.Todo, 1)
	go func() {
		sub := r.redis.Subscribe(ctx, "/users/"+userID+"/todos/updated")
		if _, err := sub.Receive(ctx); err != nil {
			return
		}

		ch := sub.Channel()
		for {
			select {
			case m := <-ch:
				var todo model.Todo
				if err := json.Unmarshal([]byte(m.Payload), &todo); err != nil {
					log.Printf("todo subscription: %v\n", err)
					return
				}
				c <- &todo
			case <-ctx.Done():
				sub.Close()
				return
			}
		}
	}()

	return c, nil
}

// DeletedTodos is the resolver for the deletedTodos field.
func (r *subscriptionResolver) DeletedTodos(ctx context.Context, userID string) (<-chan string, error) {
	if err := r.hasUserAccess(ctx, userID); err != nil {
		return nil, err
	}

	c := make(chan string, 1)
	go func() {
		sub := r.redis.Subscribe(ctx, "/users/"+userID+"/todos/deleted")
		if _, err := sub.Receive(ctx); err != nil {
			return
		}

		ch := sub.Channel()
		for {
			select {
			case m := <-ch:
				c <- m.Payload
			case <-ctx.Done():
				sub.Close()
				return
			}
		}
	}()

	return c, nil
}

// Files is the resolver for the files field.
func (r *todoResolver) Files(ctx context.Context, obj *model.Todo) ([]*model.TodoFile, error) {
	if err := r.hasTodoAccess(ctx, obj.UserID, obj.ID); err != nil {
		return nil, err
	}

	return r.pg.GetTodoFiles(ctx, obj.ID)
}

// Delete is the resolver for the delete field.
func (r *todoFileMutationResolver) Delete(ctx context.Context, obj *model.TodoFileMutation) (*model.Todo, error) {
	if err := r.hasTodoAccess(ctx, obj.UserID, obj.TodoID); err != nil {
		return nil, err
	}

	if err := r.pg.DeleteTodoFile(ctx, obj.FileID); err != nil {
		return nil, err
	}

	t, err := r.pg.GetTodo(ctx, obj.TodoID)
	if err != nil {
		return nil, err
	}
	r.redis.Publish(ctx, "/users/"+obj.UserID+"/todos/updated", t)

	return t, nil
}

// Create is the resolver for the create field.
func (r *todoFilesMutationResolver) Create(ctx context.Context, obj *model.TodoFilesMutation, file graphql.Upload) (*model.Todo, error) {
	if err := r.hasTodoAccess(ctx, obj.UserID, obj.TodoID); err != nil {
		return nil, err
	}

	data, err := ioutil.ReadAll(file.File)
	if err != nil {
		return nil, err
	}

	fsID := tools.NewUUID()
	if err = ioutil.WriteFile(filepath.Join(r.fileUploadDir, fsID), data, 0440); err != nil {
		return nil, err
	}

	if _, err = r.pg.InsertTodoFile(ctx, obj.TodoID, fsID); err != nil {
		return nil, err
	}

	todo, err := r.pg.GetTodo(ctx, obj.TodoID)
	if err != nil {
		return nil, err
	}
	r.redis.Publish(ctx, "/users/"+obj.UserID+"/todos/updated", todo)

	return todo, nil
}

// Update is the resolver for the update field.
func (r *todoMutationResolver) Update(ctx context.Context, obj *model.TodoMutation, patch model.TodoPatch) (*model.Todo, error) {
	if err := r.hasTodoAccess(ctx, obj.UserID, obj.TodoID); err != nil {
		return nil, err
	}

	todo, err := r.pg.UpdateTodo(ctx, obj.TodoID, tools.GetRequestData(ctx, &patch))
	if err != nil || todo == nil {
		return nil, err
	}

	r.redis.Publish(ctx, "/users/"+obj.UserID+"/todos/updated", todo)

	return todo, nil
}

// Delete is the resolver for the delete field.
func (r *todoMutationResolver) Delete(ctx context.Context, obj *model.TodoMutation) (string, error) {
	if err := r.hasTodoAccess(ctx, obj.UserID, obj.TodoID); err != nil {
		return "", err
	}

	if err := r.pg.DeleteTodo(ctx, obj.TodoID); err != nil {
		return "", err
	}

	r.redis.Publish(ctx, "/users/"+obj.UserID+"/todos/deleted", obj.TodoID)

	return obj.TodoID, nil
}

// Files is the resolver for the files field.
func (r *todoMutationResolver) Files(ctx context.Context, obj *model.TodoMutation) (*model.TodoFilesMutation, error) {
	return &model.TodoFilesMutation{UserID: obj.UserID, TodoID: obj.TodoID}, nil
}

// File is the resolver for the file field.
func (r *todoMutationResolver) File(ctx context.Context, obj *model.TodoMutation, fileID string) (*model.TodoFileMutation, error) {
	return &model.TodoFileMutation{UserID: obj.UserID, TodoID: obj.TodoID, FileID: fileID}, nil
}

// Create is the resolver for the create field.
func (r *todosMutationResolver) Create(ctx context.Context, obj *model.TodosMutation, input model.TodoInput) (*model.Todo, error) {
	if err := r.hasUserAccess(ctx, obj.UserID); err != nil {
		return nil, err
	}

	todo, err := r.pg.InsertTodo(ctx, obj.UserID, tools.GetRequestData(ctx, &input))
	if err != nil || todo == nil {
		return nil, err
	}

	r.redis.Publish(ctx, "/users/"+obj.UserID+"/todos/created", todo)

	return todo, nil
}

// Todo is the resolver for the todo field.
func (r *userResolver) Todo(ctx context.Context, obj *model.User, todoID string) (*model.Todo, error) {
	if err := r.hasTodoAccess(ctx, obj.ID, todoID); err != nil {
		return nil, err
	}

	return r.pg.GetTodo(ctx, todoID)
}

// Todos is the resolver for the todos field.
func (r *userResolver) Todos(ctx context.Context, obj *model.User, first *int64, after *string) (*model.Todos, error) {
	if err := r.hasUserAccess(ctx, obj.ID); err != nil {
		return nil, err
	}

	return r.pg.GetTodosPaginated(ctx, obj.ID, *first, after)
}

// Update is the resolver for the update field.
func (r *userMutationResolver) Update(ctx context.Context, obj *model.UserMutation, input model.UserPatch) (*model.User, error) {
	if err := r.hasUserAccess(ctx, obj.UserID); err != nil {
		return nil, err
	}

	patch := tools.GetRequestData(ctx, &input)

	currentPassword, hasCurrentPassword := patch["currentPassword"].(string)
	newPassword, hasNewPassword := patch["newPassword"].(string)
	if hasCurrentPassword && hasNewPassword {
		delete(patch, "currentPassword")
		delete(patch, "newPassword")

		user, err := r.pg.GetUserPassword(ctx, obj.UserID)
		if err != nil || user == nil {
			return nil, errors.New("incorrect username and/or password")
		}

		if ok := tools.CompareHash(currentPassword, user.Password); !ok {
			return nil, errors.New("current password is incorrect")
		}

		patch["password"] = tools.Hash(newPassword)
	}

	return r.pg.UpdateUser(ctx, obj.UserID, patch)
}

// Delete is the resolver for the delete field.
func (r *userMutationResolver) Delete(ctx context.Context, obj *model.UserMutation) (string, error) {
	if err := r.hasUserAccess(ctx, obj.UserID); err != nil {
		return "", err
	}

	if err := r.pg.DeleteUser(ctx, obj.UserID); err != nil {
		return "", err
	}

	return obj.UserID, nil
}

// Todos is the resolver for the todos field.
func (r *userMutationResolver) Todos(ctx context.Context, obj *model.UserMutation) (*model.TodosMutation, error) {
	return &model.TodosMutation{UserID: obj.UserID}, nil
}

// Todo is the resolver for the todo field.
func (r *userMutationResolver) Todo(ctx context.Context, obj *model.UserMutation, todoID string) (*model.TodoMutation, error) {
	return &model.TodoMutation{
		UserID: obj.UserID,
		TodoID: todoID,
	}, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

// ResetPasswordMutation returns generated.ResetPasswordMutationResolver implementation.
func (r *Resolver) ResetPasswordMutation() generated.ResetPasswordMutationResolver {
	return &resetPasswordMutationResolver{r}
}

// Subscription returns generated.SubscriptionResolver implementation.
func (r *Resolver) Subscription() generated.SubscriptionResolver { return &subscriptionResolver{r} }

// Todo returns generated.TodoResolver implementation.
func (r *Resolver) Todo() generated.TodoResolver { return &todoResolver{r} }

// TodoFileMutation returns generated.TodoFileMutationResolver implementation.
func (r *Resolver) TodoFileMutation() generated.TodoFileMutationResolver {
	return &todoFileMutationResolver{r}
}

// TodoFilesMutation returns generated.TodoFilesMutationResolver implementation.
func (r *Resolver) TodoFilesMutation() generated.TodoFilesMutationResolver {
	return &todoFilesMutationResolver{r}
}

// TodoMutation returns generated.TodoMutationResolver implementation.
func (r *Resolver) TodoMutation() generated.TodoMutationResolver { return &todoMutationResolver{r} }

// TodosMutation returns generated.TodosMutationResolver implementation.
func (r *Resolver) TodosMutation() generated.TodosMutationResolver { return &todosMutationResolver{r} }

// User returns generated.UserResolver implementation.
func (r *Resolver) User() generated.UserResolver { return &userResolver{r} }

// UserMutation returns generated.UserMutationResolver implementation.
func (r *Resolver) UserMutation() generated.UserMutationResolver { return &userMutationResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type resetPasswordMutationResolver struct{ *Resolver }
type subscriptionResolver struct{ *Resolver }
type todoResolver struct{ *Resolver }
type todoFileMutationResolver struct{ *Resolver }
type todoFilesMutationResolver struct{ *Resolver }
type todoMutationResolver struct{ *Resolver }
type todosMutationResolver struct{ *Resolver }
type userResolver struct{ *Resolver }
type userMutationResolver struct{ *Resolver }
