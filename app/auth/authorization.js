var jwt = require('jsonwebtoken');
var config = require('../config/config');

var authorization = function (req, res, next) {
    var token = req.headers['x-access-token'];
    console.log('athorization='+token);
    var msg = {auth: false, message: 'No token provided.'};
    if (!token) 
        return res.status(500).send(msg);
    jwt.verify(token, config.SECRET, function (err, decoded) {
        var msg = {auth: false, message: 'Failed to authenticate token.'};
        if (err) 
            return res.status(500).send(msg);
        next();
    });
}

module.exports = authorization;