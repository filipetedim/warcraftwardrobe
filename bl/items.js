'use strict';

// Dependencies
const https = require('https');

// Models
const Items = require('../models/items');

// Middlewares
const battlenet = require('../middlewares/battlenet');
const wowdb = require('../middlewares/wowdb');

const getNewItem = (id, next) => {
    battlenet.getItem(id, (err, item) => {
        if (err) {
            return next(err);
        }

        if (item.itemSource.sourceType === 'CREATED_BY_SPELL') {
            wowdb.getSpell(item.itemSource.sourceId, (err, spell) => {
                if (err) {
                    return next(err);
                }

                item.reagents = spell.reagents;
                console.log(item);

                next(null, item);
            });
        } else {
            next(null, item);
        }
    });
};

const getItemInfo = (req, res) => {
    const id = req.params.id;

    Items.findOne({id: id}, (err, item) => {
        if (err) {
            // TODO rollbar error
            return res.status(500).send({success: false, message: 'Internal Database: Something went wrong.'});
        }

        // If item doesn't exist, try to fetch
        if (item === null) {
            return getNewItem(id, (err, item) => {
                if (err) {
                    return res.status(err.statusCode).send({success: false, message: res.message});
                }

                res.send(item);
            });
        }

        return res.send(item.toObject());
    });
};

const parseRequestId = (req, res, next) => {
    req.checkParams('id', 'Item id is required').notEmpty();

    const validationErrors = req.validationErrors();

    // If no id provided, return all results
    if (validationErrors) {
        return next();
    }

    getItemInfo(req, res);
};

// Exports functions
module.exports = {
    parseRequestId
};