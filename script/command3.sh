#!/bin/bash

p1="${1}"
p2="${2}"

if [ "$#" -lt 2 ] || [ -z "${p1}" ] || [ -z "${p2}" ]
then
    echo -e "\n❌ command3.sh - Missing parameter."

    exit 1
fi

parameter1="${p1}"
parameter2="${p2}"

find "${parameter1}file/" -type f -iname "${parameter2}*" -exec basename {} \;
