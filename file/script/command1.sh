#!/bin/bash

npx playwright test "${1}.spec.ts" --config=./src/playwright.config.ts --project="${2}"
