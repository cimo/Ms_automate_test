# Ms_automate_test

Microservice automate frontend test.

Depend from Ms_cronjob (use the volume "ms_cronjob-volume" for share the certificate).

## Setup

1. Wrinte on terminal:

```
docker compose -f docker-compose_local.yaml --env-file ./env/local.env up -d --build
```

## API (Postman)

1. Upload

```
form-data

key             value
---             ---
token_api       1234
file_name       test.spec.js
file            "upload field"
```

2. Run

```
raw

{
    "token_api": "1234",
    "browser": "chrome",
    "mode": "specjs",
    "name": "test"
}
```
