#!/bin/bash

p1=$(printf '%s' "${1}" | xargs)

if [ -z "${p1}" ]
then
    echo "playwright.sh - Missing parameter."

    exit 1
fi

parameter1="${1}"

if [ "${parameter1}" = "test" ]
then
    npx -y playwright test --ui --config="${PATH_ROOT}src/playwright.config.ts" >> "${PATH_ROOT}${MS_AT_PATH_LOG}playwright_gui.log" 2>&1 &
elif [ "${parameter1}" = "codegen" ]
then
    npx -y playwright codegen >> "${PATH_ROOT}${MS_AT_PATH_LOG}playwright_code.log" 2>&1 &
fi
