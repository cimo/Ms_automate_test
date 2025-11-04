#!/bin/bash

eval "$(dbus-launch --auto-syntax)"

npx playwright test --ui --config="${PATH_ROOT}src/playwright.config.ts"
