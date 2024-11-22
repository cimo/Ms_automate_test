#!/bin/bash

find "${1}file/" -type f -iname "${2}*" -exec basename {} \;
