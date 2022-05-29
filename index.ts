import fastify from 'fastify'
import Bottleneck from 'bottleneck'
import { submitJob } from './cardano-utils.js'

//IMPORTANT FOR NFT MINT OR FT CLAIMS:
//IF PARALLEL REQUESTS ARE COMING IN, VALIDATE ONE BY ONE (no double-mints or double-claims)
const limiter = new Bottleneck({
    maxConcurrent: 1
})

const server = fastify()

server.register(import('@fastify/cors'),
    (instance) => 
        (req: any, callback: any) => {
            const corsOptions = {
                // This is NOT recommended for production as it enables reflection exploits
                origin: true
            };

            // do not include CORS headers for requests from localhost
            if (/^localhost$/m.test(req.headers.origin)) {
                corsOptions.origin = false
            }

            // callback expects two parameters: error and options
            callback(null, corsOptions)
        }
)

server.listen(8080, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})


server.post('/submit', async (request, reply) => {
    console.log(`Entered /submit`)
    const body: any = request.body
    return await limiter.schedule(() => submitJob(body))
})
