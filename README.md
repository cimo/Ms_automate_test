# Ms_automate_test

Microservice automate frontend test.

Depend from Ms_cronjob (use the volume "ms_cronjob-volume" for share the certificate).

## Setup

1. Wrinte on terminal:

```
docker compose -f docker-compose.yaml --env-file ./env/local.env up -d --build
```

2. If you have a proxy execute this command (if you use a certificate put it in "/certificate/proxy/" folder):

```
DOCKERFILE="Dockerfile_local_proxy" docker compose -f docker-compose.yaml --env-file ./env/local.env up -d --build
```

## API (Postman)

1. Upload

```
url = https://localhost:1002/msautomatetest/upload

form-data

key             value
---             ---
token_api       1234
file_name       test.spec.js
file            "upload field"
```

2. Run

```
url = https://localhost:1002/msautomatetest/run

raw / JSON

{
    "token_api": "1234",
    "name": "test.spec.ts"
    "browser": "desktop_chrome", // -> "desktop_edge" - "desktop_firefox" - "desktop_safari" - "mobile_android" - "mobile_ios"
}
```

3. Download

```
url = https://localhost:1002/msautomatetest/download

raw / JSON

{
    "token_api": "1234",
    "name": "Test 1"
}
```
