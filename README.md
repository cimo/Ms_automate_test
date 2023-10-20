# Ms_automate_test

Microservice automate frontend test.

Depend from Ms_cronjob (use the volume "ms_cronjob-volume" for share the certificate).\
Rename "/env/local.env.public" in "/env/local.env" and adjust the variable for your environment.

## Installation

1. Wrinte on terminal:

```
docker compose -f docker-compose.yaml --env-file ./env/local.env build --no-cache \
&& docker compose -f docker-compose.yaml --env-file ./env/local.env up --detach
```

## API (Postman)

1. Upload

```
url = https://localhost:1002/msautomatetest/upload

form-data

key             value
---             ---
file_name       test
file            "upload field"
```

2. Run

```
url = https://localhost:1002/msautomatetest/run

raw / JSON

{
    "name": "test.spec.ts"
    "browser": "desktop_chrome", // -> "desktop_edge" - "desktop_firefox" - "desktop_safari" - "mobile_android" - "mobile_ios"
}
```

3. Download

```
url = https://localhost:1002/msautomatetest/download

raw / JSON

{
    "name": "Test 1"
}
```

## UI

1. Wrinte on the browser url:

https://localhost:1002/ui
