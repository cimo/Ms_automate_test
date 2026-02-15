#!/bin/bash

p1=$(printf '%s' "${1}" | xargs)
p2=$(printf '%s' "${2}" | xargs)

if [ -z "${p1}" ] || [ -z "${p2}" ]
then
    echo "command3.sh - Missing parameter."

    exit 1
fi

parameter1="${1}"
parameter2="${2}"

find "${parameter1}file/" -type f -iname "${parameter2}*" -exec basename {} \;
