/**
 * Request Handlers
 */

const _data = require('./data');
const _helpers = require('./helpers');

const handlers = {};

handlers.users = function (data, callback) {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback)
    }else {
        callback(405)
    }
}

handlers._users = {};

handlers._users.post = function (data, callback) {

    const firstName = typeof data.payload.firstName === 'string' && data.payload.firstName.trim().length
        ? data.payload.firstName.trim()
        : false;
    const lastName = typeof data.payload.lastName === 'string' && data.payload.lastName.trim().length
        ? data.payload.lastName.trim()
        : false;
    const contact = typeof data.payload.contact === 'string' && data.payload.contact.trim().length === 10
        ? data.payload.contact.trim()
        : false;
    const password = typeof data.payload.password === 'string' && data.payload.password.length >= 8
        ? data.payload.password
        : false;
    const tosAgreement = typeof data.payload.tosAgreement === 'boolean' && data.payload.tosAgreement;

    if (firstName && lastName && contact && password && tosAgreement) {

        _data.read('users', contact, function (err, data) {
            if (err) {
                const hashedPassword = _helpers.hash(password);
                const userObject = {
                    firstName,
                    lastName,
                    contact,
                    hashedPassword,
                    tosAgreement
                }
                if (hashedPassword) {
                    _data.create('users', contact, userObject, function (err) {
                        if (err) {
                            console.log(err);
                            callback(500, {'error': 'Could not create new user'})
                        }else {
                            callback(200, {'message': 'New user created successfully'})
                        }
                    })
                }else {
                    callback(500, {'error': 'Password hash unsuccessful'})
                }

            }else {
                callback(400, {'error': 'A user with that contact number already exists'});
            }
        })

    }else {
        callback(400, {'error': 'a required field to create a user is missing'});
    }

}

handlers._users.get = function (data, callback) {

}

handlers._users.put = function (data, callback) {

}

handlers._users.delete = function (data, callback) {

}

handlers.ping = function (data, callback) {
    callback(200)
}

handlers.notFound = function (data, callback) {
    callback(404)
}


module.exports = handlers

