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
    const contact = typeof data.queryStringObject.contact === 'string' && data.queryStringObject.contact.trim().length === 10
        ? data.queryStringObject.contact.trim()
        : false;

    if (contact){
        _data.read('users', contact, function (error, data) {
            if (!error && data) {
               delete data.hashedPassword;
               callback(200, data)
            }else {
               callback(404);
            }
        })
    }else {
        callback(400, {'error': 'missing required field'})
    }
}

handlers._users.put = function (data, callback) {

    const contact = typeof data.queryStringObject.contact === 'string' && data.queryStringObject.contact.trim().length === 10
        ? data.queryStringObject.contact.trim()
        : false;

    const firstName = typeof data.payload.firstName === 'string' && data.payload.firstName.trim().length
        ? data.payload.firstName.trim()
        : false;
    const lastName = typeof data.payload.lastName === 'string' && data.payload.lastName.trim().length
        ? data.payload.lastName.trim()
        : false;
    const password = typeof data.payload.password === 'string' && data.payload.password.length >= 8
        ? data.payload.password
        : false;


    if (contact) {

        if (firstName || lastName || password) {
            _data.read('users', contact, function (err, data) {
                if (!err && data) {
                    if (firstName) {
                        data.firstName = firstName;
                    }
                    if (lastName) {
                        data.lastName = lastName;
                    }
                    if (password) {
                        data.password = password;
                    }

                    _data.update('users', contact, data, function (err) {
                        if (err) {
                            callback(500, {'error': err})
                        }else {
                            callback(200, {'message': 'user update successful'})
                        }
                    })
                }else {
                    callback(400, {'error': 'specified user does not exist'})
                }
            })
        }else {
            callback(400, {'error': 'missing fields to update'})
        }

    }else {
        callback(400, {'error': 'missing required field'})
    }

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

