#!/bin/bash

p1="${1}"
p2="${2}"

if [ "$#" -lt 2 ] || [ -z "${p1}" ] || [ -z "${p2}" ]
then
    echo -e "\n❌ command4.sh - Missing parameter."

    exit 1
fi

parameter1="${p1}"
parameter2="${p2}"

rm "${parameter1}file/${parameter2}"
