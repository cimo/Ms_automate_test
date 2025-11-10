# Ms_automate_test

Microservice automate test.

Depend from "Ms_cronjob" (use "ms_cronjob-volume" for share the certificate).
It's possible to use a personal certificate instead of "Ms_cronjob", just add the certificate in the ".ms_cronjob-volume" folders.

## Info:

-   Cross platform (Windows, Linux)
-   X11 for WSL2 (Run linux GUI app directly in windows).
-   Playwright

## Installation

1. For full build write on terminal:

```
bash docker/container_execute.sh
```

2. For light build (just env variable change) remove the container and write on terminal:

```
bash docker/container_execute.sh "fast"
```

## Reset

1. Remove this from the root:

    - .cache
    - .config
    - .dbus
    - .npm
    - .pki
    - node_modules
    - package-lock.json

2. Follow the "Installation" instructions.

3. For execute "Playwright" GUI write on terminal:

    ```
    bash script/playwright.sh
    ```

## UI

1. Write on the browser url:

https://localhost:1044/login

## Url

1. /info
2. /login
4. /logout
