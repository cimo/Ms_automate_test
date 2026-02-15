#!/bin/bash

p1=$(printf '%s' "${1}" | xargs)
p2=$(printf '%s' "${2}" | xargs)

if [ -z "${p1}" ] || [ -z "${p2}" ]
then
    echo "command1.sh - Missing parameter."

    exit 1
fi

parameter1="${1}"
parameter2="${2}"

"./node_modules/.bin/playwright" test "${parameter1}.spec.ts" --config="${PATH_ROOT}src/playwright.config.ts" --project="${parameter2}" 2>&1 | tee -a "${PATH_ROOT}${MS_AT_PATH_LOG}debug.log"
