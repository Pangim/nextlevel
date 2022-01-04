const strapi = require('strapi/lib/index.js')

/**
 * `$ node app.js`
 */
// elk
var apm = require('elastic-apm-node').start({
    // Override service name from package.json
    // Allowed characters: a-z, A-Z, 0-9, -, _, and space
    serviceName: 'Test',

    // Use if APM Server requires a token
    secretToken: '',

    // Set custom APM Server URL (default: http://localhost:8200)
    serverUrl: 'http://174.17.0.4:8200'
})

strapi().start()
