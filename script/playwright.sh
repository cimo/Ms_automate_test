#!/bin/bash

if [ "${1}" = "gui" ]
then
    XDG_RUNTIME_DIR="/mnt/wslg/runtime-dir" npx -y playwright test --ui --config="${PATH_ROOT}src/playwright.config.ts" >> "${PATH_ROOT}${MS_AT_PATH_LOG}playwright_gui.log" 2>&1 &
elif [ "${1}" = "code" ]
then
    XDG_RUNTIME_DIR="/mnt/wslg/runtime-dir" npx -y playwright codegen >> "${PATH_ROOT}${MS_AT_PATH_LOG}playwright_code.log" 2>&1 &
fi
