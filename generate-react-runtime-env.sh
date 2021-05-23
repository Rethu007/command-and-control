#!/bin/sh

beginswith() { case $2 in "$1"*) true ;; *) false ;; esac }

printf 'window.runtimeEnv = {};\n'
env | while IFS='=' read -r name value; do
    if beginswith REACT_APP_ "$name"; then
        printf 'window.runtimeEnv.%s="%s";\n' "$name" "$value"
    fi
done