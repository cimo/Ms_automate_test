#!/bin/bash

"./node_modules/.bin/playwright" test "${1}.spec.ts" --config=./src/playwright.config.ts --project="${2}"
