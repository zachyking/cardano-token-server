# VALIDATE AND SIGN API

Cardano multisig tx backend validating, signing and submitting in `concurrency = 1` mode. Next one starts after previous finishes even when parallel requests are happening.

## Uses Fastify, to build:
```
npm run build
```
## to run:
```
npm run start
```


## Validation
Implement custom validation in `cardano-utils.ts`
```
//write custom validation
const validate = async () => {
    return true
}
```