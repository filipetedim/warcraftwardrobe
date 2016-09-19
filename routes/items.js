'use strict';

// Dependencies
const express = require('express');

// Models
const Items = require('../models/items');

// Business Logic
const ItemsBL = require('../bl/items');

// Middlewares

// Endpoints
Items.methods(['get', 'post', 'put']);
Items.before('get', ItemsBL.parseRequestId);
// Expenses.restful.before('get', [validation]);

// Routes
// Items.route('info(', ['post'], ItemsBL.getItemInfo);


// Exports restful object
module.exports = Items;