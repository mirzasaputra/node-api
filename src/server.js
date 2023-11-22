import path from "node:path"
import http from "node:http"
import express from "express"
import bodyParser from "body-parser"
import { executeLoader } from "./loader"
import app1, { APP_VERSION as app1version } from './modules/v1/app'

executeLoader()

const loadedApps = {
    [app1version]: app1,
}

const PORT = process.env.PORT || 8000
const server = express()

server.use(express.static(path.join(__dirname, '..', 'public')))

const notFoundHandler = (req, res) => {
    res.status(404).json({
      status: 'fail',
      message: `Route ${req.originalUrl} with request method ${req.method} not found !`,
    });
};

function startServer() {
    console.log('Starting server...\n')

    // looping modules
    for(const k in loadedApps) {
        server.use(`/${k}`, loadedApps[k])
        console.log(`* Application loaded : ${k}`)
    }

    //  hanlder 404
    server.use('*', notFoundHandler)

    const httpServer = http.createServer(server)
    httpServer.listen(PORT, () => console.log(`\nServer listening on ${PORT}`))
}

startServer()