# Ms_automate_test

Microservice automate frontend test.

Depend from Ms_cronjob (use the volume "ms_cronjob-volume" for share the certificate).

## Installation

1. Wrinte on terminal:

```
docker compose -f docker-compose.yaml --env-file ./env/local.env build --no-cache \
&& docker compose -f docker-compose.yaml --env-file ./env/local.env up --detach --pull "always"
```

## Reset

1. Remove the folder from the root:

    - .cache
    - .config
    - .npm
    - .pki
    - node_modules
    - package-lock.json

2. Follow the "Installation" instructions.

## API (Postman)

1. Login

```
url = https://localhost:1002/login

Body: none
```

2. Run

```
url = https://localhost:1002/api/run

Body: raw / JSON

{
    "name": "test_1.spec.ts"
    "browser": "desktop_chrome", // -> "desktop_edge" - "desktop_firefox" - "desktop_safari" - "mobile_android" - "mobile_ios",
    "process_number": "0"
}
```

3. Download

```
url = https://localhost:1002/api/download

Body: raw / JSON

{
    "name": "Test 1",
    "process_number": "0"
}
```

4. Upload

```
url = https://localhost:1002/api/upload

Body: form-data

key             value
---             ---
file_name       test
file            "upload field"
```

5. Logout

```
url = https://localhost:1002/logout

Body: none
```

## UI

1. Wrinte on the browser url:

https://localhost:1002/login
