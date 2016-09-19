'use strict';

// Dependencies

// Models
const Users = require('../models/users');

// Middlewares

/**
 *
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const register = (req, res) => {
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password_confirm', 'Passwords do not match').equals(req.body.password);
    req.checkBody('name', 'Name is required').notEmpty();

    const validationErrors = req.validationErrors();
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    if (validationErrors) {
        // TODO rollbar error
        return res.status(400).send(validationErrors);
    }

    const newUser = new Users({
        email: email,
        password: password,
        name: name
    });

    newUser.save((err, user) => {
        if (err) {
            if (err.code === 11000) {
                // TODO rollbar error
                console.log('equal pw');

            }
            console.log('hello');
            console.log(err);
            // TODO rollbar error
            return res.status(500).send({success: false, message: err});
        }

        return res.status(201).send(user);
    });

};

// Exports functions
module.exports = {
    register
};