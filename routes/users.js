'use strict';

// Dependencies
const express = require('express');

// Models
const Users = require('../models/users');

// Business Logic
const UsersBL = require('../bl/users');

// Middlewares

// Endpoints
Users.methods(['get', 'post', 'put']);
// Expenses.restful.before('get', [validation]);

// Routes
Users.route('register', ['post'], UsersBL.register);


// Exports restful object
module.exports = Users;