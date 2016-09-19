'use strict';

// Dependencies
const express = require('express');

// Init
const router = express.Router();

// Routes
const Users = require('./users');
const Items = require('./items');

// Registration

Users.register(router, '/users');
Items.register(router, '/items');

// Exports router
module.exports = router;