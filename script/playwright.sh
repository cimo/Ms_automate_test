#!/bin/bash

eval "$(dbus-launch --auto-syntax)"

playwright test --ui --config=${PATH_ROOT}src/playwright.config.ts