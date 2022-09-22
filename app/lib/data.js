/**
 * Module for storing and editing data
 */

const fs = require('fs');
const path = require('path');

const lib = {};

lib.baseDir = path.join(__dirname, '/../.data/');

// Write data to a file
lib.create = function (dir, file, data, callback) {

    fs.open(`${lib.baseDir}${dir}/${file}.json`, 'wx', function (err, fileDescriptor) {
        if (!err && fileDescriptor) {
            const stringData = JSON.stringify(data)
            fs.writeFile(fileDescriptor, stringData, function (err) {
                if (!err) {
                    fs.close(fileDescriptor, function (err) {
                        if (!err){
                            callback(false)
                        }else {
                            callback('Error closing new file')
                        }
                    })
                } else {
                    callback('Error writing to new file')
                }
            })

        }else {
            callback('Could not create new file, it may already exists')
        }
    });

}

// Read data from a file
lib.read = function (dir, file, callback) {
    fs.readFile(`${lib.baseDir}${dir}/${file}.json`, 'utf-8', function (err, data) {
        callback(err, data);
    })
}

// Update data inside a file
lib.update = function (dir, file, data, callback) {
    fs.open(`${lib.baseDir}${dir}/${file}.json`, 'r+', function (err, fileDescriptor) {
        if (!err && fileDescriptor) {
            const stringData = JSON.stringify(data)
            fs.ftruncate(fileDescriptor, function (err) {
                if (!err) {
                    fs.writeFile(fileDescriptor, stringData, function (err) {
                        if (!err) {
                            fs.close(fileDescriptor, function (err) {
                                if (!err){
                                    callback(false)
                                }else {
                                    callback('Error closing existing file')
                                }
                            })
                        } else {
                            callback('Error writing to existing file')
                        }
                    })
                }else {
                    callback('Error truncating file')
                }
            })

        }else {
            callback('Could not open file for updating, it may not exist yet')
        }
    })
}

// Delete a file
lib.delete = function (dir, file, callback) {
    fs.unlink(`${lib.baseDir}${dir}/${file}.json`, function (err) {
        if (!err) {
            callback(false)
        }else (
            callback('Trouble deleting file')
        )
    })
}

module.exports = lib;