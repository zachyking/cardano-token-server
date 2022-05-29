# CARDANO TOKEN SERVER

Cardano multisig tx backend validating, signing and submitting in `concurrency = 1` mode. Next one starts after previous finishes even when parallel requests are happening.

## Uses Fastify, to build:
```
npm run build
```
## to run:
```
npm run start
```

## ENVIRONMENT VARIABLES
```
SERVER_PRIVKEY='' //server's private key
BLOCKFROST_API_KEY='' //your API key, get one at https://blockfrost.io/
BLOCKFROST_URL='https://cardano-mainnet.blockfrost.io/api/v0' || 'https://cardano-testnet.blockfrost.io/api/v0'
BLOCKFROST_NETWORK='Testnet' || 'Mainnet'
```

## REQUESTS
Requires transaction and signature hex string and the body as `application/json`
### TYPE: 
```
type SubmitReqBody = {
    txHex: string
    signatureHex: string
}
```
### MAKE A REQUEST:
```
const reqBody = {txHex: txHex, signatureHex: signatureHex}
const rawResponse = await fetch(`http://localhost:8080/submit`, {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(reqBody)
});
```

## VALIDATION
Implement custom validation in `cardano-utils.ts`
```
//write custom validation
const validate = async () => {
    return true
}
```

