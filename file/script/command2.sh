#!/bin/bash

find "${1}" -type f -name "*.webm" -exec sh -c '
    p2="'${2}'"

    for file; do
        parent_dir=$(dirname "$file")
        new_filename=$(basename "$parent_dir").webm
        destination="${p2}file/$new_filename"
        rm "$destination"
        mv "$file" "$destination"
    done
' sh {} \;
