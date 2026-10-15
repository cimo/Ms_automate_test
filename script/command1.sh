#!/bin/bash

p1="${1}"
p2="${2}"

if [ "$#" -lt 2 ] || [ -z "${p1}" ] || [ -z "${p2}" ]
then
    echo -e "\n❌ command1.sh - Missing parameter."

    exit 1
fi

parameter1="${p1}"
parameter2="${p2}"

"./node_modules/.bin/playwright" test "${parameter1}.spec.ts" --config="${PATH_ROOT}src/playwright.config.ts" --project="${parameter2}" 2>&1 | tee -a "${PATH_ROOT}${MS_AT_PATH_LOG}debug.log"
