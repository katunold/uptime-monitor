/**
 * Helpers for various tasks
 */

const crypto = require('crypto');
const config = require('../config');

const helpers = {}

helpers.hash = function (str) {
    if (typeof str == 'string' && str.length) {
        return crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    }else {
        return false
    }
}

helpers.parseJsonToObject = function (str) {
    try {
        return JSON.parse(str)
    }catch (e) {
        return {}
    }
}

module.exports = helpers;