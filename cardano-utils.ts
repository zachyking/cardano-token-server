import { Blockfrost, C, Lucid, Network } from 'lucid-cardano'

type SubmitReqBody = {
    txHex: string
    signatureHex: string
}

const initLucid = async () => {
    if(!process.env.BLOCKFROST_URL || !process.env.BLOCKFROST_API_KEY || !process.env.BLOCKFROST_NETWORK)
        throw 'BLOCKFROST_URL and/or BLOCKFROST_API_KEY environment variables not set'

    return await Lucid.new(
        new Blockfrost(process.env.BLOCKFROST_URL, process.env.BLOCKFROST_API_KEY),
        process.env.BLOCKFROST_NETWORK as Network
    )
}

const submitJob = async (submitReqBody: SubmitReqBody) => {
    if(!process.env.SERVER_PRIVKEY) throw "SERVER_PRIVKEY env variable not set"

    //custom validation
    await validate() 

    //Create private key for server
    const serverKey = process.env.SERVER_PRIVKEY
    const sKey = C.PrivateKey.from_extended_bytes(Buffer.from(serverKey, 'hex'))

    //Validate and parse request body
    const { transaction, signatureList, signatureSet } = parseSubmitBody(submitReqBody)
    
    //Create txbodyHash and make tx witness from it and server's key
    const transaction_body = transaction.body();
    const txBodyHash = C.hash_transaction(transaction_body);
    const witness = C.make_vkey_witness(
        txBodyHash,
        sKey
    );
    
    signatureList.add(witness);
    signatureSet.set_vkeys(signatureList);
    
    //copy native scripts from intial tx
    const txNativeScripts = transaction.witness_set().native_scripts()
    if(txNativeScripts) signatureSet.set_native_scripts(txNativeScripts)

    //copy metadata from intial tx
    const aux = C.AuxiliaryData.new()
    const txMetadata = transaction.auxiliary_data()?.metadata()
    if(txMetadata) aux.set_metadata(txMetadata)
    
    //assemble the tx with witnesses and metadata
    const signedTx = C.Transaction.new(transaction.body(), signatureSet, aux)

    //init lucid and use provider to submit
    const lib = await initLucid()
    try {
        const resF = await lib.provider.submitTx(signedTx)

        //if returns txHash, return it, otherwise error
        //TODO: better check would be nice
        if(resF && resF.length === 64) return { transactionId: resF }
    } catch (err) {
        console.log(err)
    }

    throw 'Failed to submit'
}

function parseSubmitBody(submitReqBody: SubmitReqBody) {
    let transaction
    try {
        transaction = C.Transaction.from_bytes(Buffer.from(submitReqBody.txHex, 'hex'))
    } catch {
        transaction = undefined
    }
    if (!transaction)
        throw "Couldn't parse the transaction"

    let signatureSet
    try {
        signatureSet = C.TransactionWitnessSet.from_bytes(Buffer.from(submitReqBody.signatureHex, 'hex'))
    } catch {
        signatureSet = undefined
    }
    if (!signatureSet)
        throw "Couldn't parse the signature"

    const signatureList = signatureSet.vkeys()

    if (!signatureList)
        throw "User signature invalid."

    return { transaction, signatureList, signatureSet }
}

//write custom validation
const validate = async () => {
    return true
}

export { initLucid, submitJob, SubmitReqBody }
