'use strict';

// Dependencies
const config = require('./config');
const express = require('express');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Init
const app = express();
mongoose.connect(config.getDbConnectionUrl());

// Middlewares
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

// Routes
app.use('/', require('./routes'));

// Run
app.listen(config.PORT);