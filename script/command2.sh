#!/bin/bash

p1=$(printf '%s' "${1}" | xargs)
p2=$(printf '%s' "${2}" | xargs)

if [ -z "${p1}" ] || [ -z "${p2}" ]
then
    echo "command2.sh - Missing parameter."

    exit 1
fi

parameter1="${1}"
parameter2="${2}"

find "${parameter1}" -type f -name "*.webm" -exec sh -c '
    pathPublic="'${parameter2}'"

    for data
    do
        parentDir="$(dirname "${data}")"
        
        fileName="$(basename "${parentDir}").webm"
        fileDestination="${pathPublic}file/${fileName}"
        
        rm "${fileDestination}"
        mv "${data}" "${fileDestination}"
    done
' sh {} \;
