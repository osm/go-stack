package postgres

import (
	"encoding/base64"
	"errors"
	"fmt"
	"strings"
	"time"
)

func decodeCursor(after *string) (*string, *string, error) {
	if after == nil {
		return nil, nil, nil
	}

	b, err := base64.StdEncoding.DecodeString(*after)
	if err != nil {
		return nil, nil, errors.New("unable to decode after")
	}

	p := strings.Split(string(b), ",")
	if len(p) != 2 {
		return nil, nil, errors.New("expected after cursor to contain two parts")
	}

	if _, err = time.Parse(time.RFC3339, p[1]); err != nil {
		return nil, nil, err
	}

	return &p[0], &p[1], nil
}

func generateCursor(id string, timestamp time.Time) string {
	return base64.StdEncoding.EncodeToString(
		[]byte(fmt.Sprintf("%s,%s", id, timestamp.Format(time.RFC3339))),
	)
}
