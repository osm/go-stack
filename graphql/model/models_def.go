package model

import (
	"encoding/json"
	"time"
)

// This is required for the redis publisher to work.
func (t Todo) MarshalBinary() ([]byte, error) {
	return json.Marshal(t)
}

type UserWithPassword struct {
	ID        string     `json:"id" db:"id"`
	Username  string     `json:"username" db:"username"`
	Password  string     `json:"password" db:"password"`
	Email     string     `json:"email" db:"email"`
	FirstName *string    `json:"firstName" db:"first_name"`
	LastName  *string    `json:"lastName" db:"last_name"`
	CreatedAt time.Time  `json:"createdAt" db:"created_at"`
	UpdatedAt *time.Time `json:"updatedAt" db:"updated_at"`
}

type UserMutation struct {
	UserID string
	Update *User          `json:"update"`
	Delete *string        `json:"delete"`
	Todo   *TodoMutation  `json:"todoMutation"`
	Todos  *TodosMutation `json:"todosMutation"`
}

type TodosMutation struct {
	UserID string
	Create *Todo `json:"create"`
}

type TodoMutation struct {
	UserID string
	TodoID string
	Update *Todo              `json:"update"`
	Delete *string            `json:"delete"`
	Files  *TodoFilesMutation `json:"files"`
	File   *TodoFileMutation  `json:"file"`
}

type TodoFileMutation struct {
	UserID string
	TodoID string
	FileID string
	Delete string `json:"delete"`
}

type TodoFilesMutation struct {
	UserID string
	TodoID string
	Create bool `json:"create"`
}

type TodoFile struct {
	ID           string     `json:"id" db:"id"`
	FileSystemID string     `json:"fileSystemId" db:"file_system_id"`
	CreatedAt    time.Time  `json:"createdAt" db:"created_at"`
	UpdatedAt    *time.Time `json:"updatedAt" db:"updated_at"`
}
