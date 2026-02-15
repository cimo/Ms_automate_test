#!/bin/bash

p1=$(printf '%s' "${1}" | xargs)
p2=$(printf '%s' "${2}" | xargs)

if [ -z "${p1}" ] || [ -z "${p2}" ]
then
    echo "command4.sh - Missing parameter."

    exit 1
fi

parameter1="${1}"
parameter2="${2}"

rm "${parameter1}file/${parameter2}"
