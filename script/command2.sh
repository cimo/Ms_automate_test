#!/bin/bash

p1="${1}"
p2="${2}"

if [ "$#" -lt 2 ] || [ -z "${p1}" ] || [ -z "${p2}" ]
then
    echo -e "\n❌ command2.sh - Missing parameter."

    exit 1
fi

parameter1="${p1}"
parameter2="${p2}"

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
