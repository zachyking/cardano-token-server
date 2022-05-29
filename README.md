# SAFE-JOBS API

Process jobs in `concurrency = 1` mode, next one starts after previous finishes even when parallel requests are happening.

## Uses Fastify, to build:
```
npm run build
```
## to run:
```
npm run start
```

## Simple test:
```
curl http://127.0.0.1:8080/ping & curl http://127.0.0.1:8080/ping & curl http://127.0.0.1:8080/ping
```
