package postgres

import (
	"bytes"
	"fmt"
	"sort"
	"strings"

	"github.com/osm/go-stack/tools"
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

func getInsertQuery(query string, input map[string]interface{}) string {
	columns := `(`
	values := "VALUES("
	for k := range input {
		columns = fmt.Sprintf(`%s"%s", `, columns, toSnakeCase(k))
		values = fmt.Sprintf(`%s:%s, `, values, k)
	}
	columns = columns[:len(columns)-2] + ")"
	values = values[:len(values)-2] + ")"
	return fmt.Sprintf("%s %s %s", query, columns, values)
}

func getInsertQueryNew(query string, keys []string) string {
	columns := `(`
	values := "VALUES("

	for idx, k := range keys {
		columns = fmt.Sprintf(`%s"%s", `, columns, toSnakeCase(k))
		values = fmt.Sprintf(`%s$%d, `, values, idx+1)
	}

	columns = columns[:len(columns)-2] + ")"
	values = values[:len(values)-2] + ")"
	return fmt.Sprintf("%s %s %s", query, columns, values)
}

func getUpdateQuery(query string, patch map[string]interface{}) string {
	set := "SET "

	patch["updated_at"] = tools.GetTimestamp()

	for k := range patch {
		if k == "id" {
			continue
		}

		set = fmt.Sprintf(`%s"%s" = :%s, `, set, toSnakeCase(k), k)
	}

	return strings.Replace(query, "SET", set[0:len(set)-2], 1)
}

func getSortedKeys(data map[string]interface{}) []string {
	keys := make([]string, 0, len(data))
	for k := range data {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	return keys
}
