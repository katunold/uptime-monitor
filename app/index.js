const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

const server = http.createServer(function (req, res) {

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

});

server.listen(3000, function () {
    console.log('Server is listening on port 3000');
})

const handlers = {};

handlers.sample = function (data, callback) {
    callback(406, {'name': 'sample handler'})
}

handlers.notFound = function (data, callback) {
    callback(404)
}

const router = {
    'sample': handlers.sample
}