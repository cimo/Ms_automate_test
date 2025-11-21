#!/bin/bash

find "${1}" -type f -name "*.webm" -exec sh -c '
    pathPublic="'${2}'"

    for data
    do
        parentDir="$(dirname "${data}")"
        
        fileName="$(basename "${parentDir}").webm"
        fileDestination="${pathPublic}file/${fileName}"
        
        rm "${fileDestination}"
        mv "${data}" "${fileDestination}"
    done
' sh {} \;
