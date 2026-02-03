#!/bin/bash

"./node_modules/.bin/playwright" test "${1}.spec.ts" --config="./src/playwright.config.ts" --project="${2}" 2>&1 | tee -a "${PATH_ROOT}${MS_AT_PATH_LOG}debug.log"
