#!/bin/sh

if [ -z "$1" ]; then
	echo "usage: $0 <new-name>"
	exit 1
fi

git grep -l "go-stack" | while read file; do
	sed -i "s/go-stack/$1/g" $file
done
