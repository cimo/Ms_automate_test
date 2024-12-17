#!/bin/bash

find "${1}" -type f -name "*.webm" -exec sh -c '
    p2="'${2}'"

    for data; do
        parentDir=$(dirname "${data}")
        filenameNew=$(basename "${parentDir}").webm
        destination="${p2}file/${filenameNew}"
        rm "${destination}"
        mv "${data}" "${destination}"
    done
' sh {} \;
