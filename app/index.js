const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');

const httpServer = http.createServer(function (req, res) {
    unifiedServer(req, res)
});

httpServer.listen(config.httpPort, function () {
    console.log(`Server is listening on port ${config.httpPort} in ${config.envName} mode`);
});

const httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
}

const httpsServer = https.createServer(httpsServerOptions, function (req, res) {
    unifiedServer(req, res)
});

httpsServer.listen(config.httpsPort, function () {
    console.log(`Server is listening on port ${config.httpsPort} in ${config.envName} mode`);
})

const unifiedServer = function (req, res) {
    // Get the URL and parse it
    const parsedUrl = url.parse(req.url, true);

    // Get the path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the query string as an object
    const queryStringObject = parsedUrl.query;

    // Get the HTTP method
    const method = req.method.toLowerCase();

    // Get headers as an object
    const headers = req.headers

    // Get the payload if any
    const decoder = new StringDecoder('utf-8');
    let buffer = ''
    req.on('data', function (data) {
        buffer += decoder.write(data);
    });
    req.on('end', function () {
        buffer += decoder.end()
        const chosenHandler = typeof router[trimmedPath] !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        const data = {
            trimmedPath,
            queryStringObject,
            method,
            headers,
            'payload': buffer
        }


        chosenHandler(data, function (statusCode, payload) {
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200
            payload = typeof(payload) === 'object' ? payload : {};
            const payloadString = JSON.stringify(payload);

            res.setHeader('Content-Type', 'application/json')
            res.writeHead(statusCode);
            res.end(payloadString);

            console.log('This is the response', buffer);
        })
    })
}

const handlers = {};

handlers.ping = function (data, callback) {
    callback(200)
}

handlers.notFound = function (data, callback) {
    callback(404)
}

const router = {
    'ping': handlers.ping
}