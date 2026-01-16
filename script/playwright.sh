#!/bin/bash

eval "$(dbus-launch --auto-syntax)"

if [ "${1}" = "ui" ]
then
    npx -y playwright test --ui --config="${PATH_ROOT}src/playwright.config.ts"
elif [ "${1}" = "code" ]
then
    npx -y playwright codegen
fi
