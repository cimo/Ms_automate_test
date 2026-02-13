# Ms_automate_test

Microservice automate test.

Depend on "Ms_cronjob" (use "ms_cronjob-volume" to share the certificate).
It's possible to use a personal certificate instead of "Ms_cronjob", just add the certificate to the ".ms_cronjob-volume" folder.

## Info:

-   Cross platform (Windows, Linux)
-   WSLg for WSL2 (Run linux GUI app directly in windows) with full nvidia GPU host support.
-   Playwright

## Installation

1. For build and up write on terminal:

```
bash docker/container_execute.sh "local" "build-up"
```

2. Just for up write on terminal:

```
bash docker/container_execute.sh "local" "up"
```

## Reset

1. Remove this from the root:

    - .cache
    - .config
    - .local
    - .npm
    - .pki
    - dist
    - node_modules
    - package-lock.json

2. Follow the "Installation" instructions.

## Command

1. For execute "Playwright" GUI test (execute test with debug) write on terminal:

    ```
    bash script/playwright.sh "test"
    ```

2. For execute "Playwright" GUI codegen (recording and generate test directly in the browser) write on terminal:

    ```
    bash script/playwright.sh "codegen"
    ```

## UI

1. Write on the browser url:

https://localhost:1044/login

## Url

1. /info
2. /login
4. /logout
