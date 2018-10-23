const User = require('../models/user.model');
const config = require('../config/config');

var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
 
 
// POST a User
exports.create = (req, res) => {
    // Create a User
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashedPassword,
        date: new Date()
    });
    // Save a User in the MongoDB
    user.save()
    .then(data => {
        var token = jwt.sign({id: data._id}, config.SECRET, {
            expiresIn: 86400 // expires in 24 hours
        });
        console.log('token = '+token);
        res.json({'token': token});
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};
 
//Login user
exports.loginUser = (req, res) => {
        // Find the User 
        User.findOne({ email: req.body.email })
        .then(data => {
            var passwordIsValid = bcrypt.compareSync(req.body.password, data.password);
            if (!passwordIsValid) 
                throw Error("Invalid username/password")
            res.json({ message: 'Bienvenue '+ data.firstname+' !', token: req.headers['x-access-token']})
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
    
}
 
// FETCH all Users
exports.findAll = (req, res) => {
    User.find().select("-password")
    .then(users => {
        delete users['password'];
        res.send(users);
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};
 
 
// FIND a User
exports.findOne = (req, res) => {
    User.findById(req.params.userId).select("-password")
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });            
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving User with id " + req.params.userId
        });
    });
};
 
// UPDATE a User
exports.update = (req, res) => {
    // Find user and update it
    User.findByIdAndUpdate(req.params.userId, {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email
    }, {new: true})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Error updating user with id " + req.params.userId
        });
    });
};
 
// DELETE a User
exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params.userId)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });
        }
        res.send({message: "User deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Could not delete user with id " + req.params.userId
        });
    });
};