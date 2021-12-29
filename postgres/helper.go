package postgres

import (
	"bytes"
	"fmt"
	"sort"
	"strings"
)

func toSnakeCase(camel string) string {
	var buf bytes.Buffer
	for _, c := range camel {
		if 'A' <= c && c <= 'Z' {
			// just convert [A-Z] to _[a-z]
			if buf.Len() > 0 {
				buf.WriteRune('_')
			}
			buf.WriteRune(c - 'A' + 'a')
		} else {
			buf.WriteRune(c)
		}
	}
	return buf.String()
}

func getPaginationQuery(query string, after *string, params *[]interface{}) (string, error) {
	cursorID, cursorTimestamp, err := decodeCursor(after)
	if err != nil {
		return "", err
	}

	if cursorID == nil || cursorTimestamp == nil {
		return query, nil
	}

	timestampIdx := len(*params) + 1
	idIdx := len(*params) + 2
	query = strings.Replace(
		query,
		"WHERE",
		fmt.Sprintf("WHERE (created_at, id) <= ($%d, $%d) AND", timestampIdx, idIdx),
		1,
	)

	*params = append(*params, *cursorTimestamp)
	*params = append(*params, *cursorID)

	return query, nil
}

func getSortedKeys(data map[string]interface{}) []string {
	keys := make([]string, 0, len(data))
	for k := range data {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	return keys
}
