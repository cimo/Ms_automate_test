#!/bin/bash

find "${1}" -type f -name "*.webm" -exec sh -c '
    p2="'${2}'"

    for file; do
        parentDir=$(dirname "$file")
        filenameNew=$(basename "$parentDir").webm
        destination="${p2}file/$filenameNew"
        rm "$destination"
        mv "$file" "$destination"
    done
' sh {} \;
