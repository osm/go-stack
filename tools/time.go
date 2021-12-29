package tools

import (
	"time"
)

func GetTimestamp() time.Time {
	loc, _ := time.LoadLocation("UTC")
	return time.Now().In(loc)

}
