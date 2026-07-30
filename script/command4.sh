#!/bin/bash

p1=$(printf '%s' "${1}" | xargs)
p2=$(printf '%s' "${2}" | xargs)

if [ "$#" -lt 2 ] || [ -z "${p1}" ] || [ -z "${p2}" ]
then
    echo -e "\n❌ command4.sh - Missing parameter."

    exit 1
fi

parameter1="${p1}"
parameter2="${p2}"

rm "${parameter1}file/${parameter2}"
