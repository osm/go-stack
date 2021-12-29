package tools

import (
	"context"

	"github.com/99designs/gqlgen/graphql"
)

// GetRequestData extracts the JSON data from the GraphQL context and returns
// a map where the db struct tag is the key for each submitted value.
func GetRequestData(ctx context.Context, obj interface{}) map[string]interface{} {
	// Extract variables from the GraphQL context.
	variables := graphql.GetOperationContext(ctx).Variables

	// We'll iterate over the variables until we find a
	// map[string]interface{} type, we'll assume that this is the data
	// that we want to insert/patch.
	var data map[string]interface{}
	for _, v := range variables {
		m, ok := v.(map[string]interface{})
		if !ok {
			continue
		}

		data = m
		break
	}
	return data
}
