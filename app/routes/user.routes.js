var Authorization = require('../auth/authorization');

module.exports = function(app) {

    var users = require('../controllers/user.controller.js');

    // Create a new User
    app.post('/api/users', users.create);

     // Login User
     app.post('/api/users/login', users.loginUser);

    // Retrieve all User
    app.get('/api/users',Authorization, users.findAll);

    // Retrieve a single User by Id
    app.get('/api/users/:userId',Authorization, users.findOne);

    // Update a User with Id
    app.put('/api/users/:userId', Authorization, users.update);

    // Delete a User with Id
    app.delete('/api/users/:userId',Authorization, users.delete);
}