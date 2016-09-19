'use strict';

// Dependencies
const https = require('https');
const config = require('../config');

/**
 * Requests item information from battlenet's API.
 * If status is anything other 200, returns an error.
 * Creates a new item with only id, name, quality, and itemSource, other info is irrelevant.
 *
 * TODO: Might require further testing for other status.
 *
 * @param {Number} id - item id
 * @param {Function} next - callback
 */
const getItem = (id, next) => {
    https.get(config.getBattlenetUrl('item', id), (res) => {
        if (res.statusCode !== 200) {
            // TODO: rollbar error
            return next({success: false, statusCode: res.statusCode, message: `Battlenet: Something went wrong.`});
        }
        
        res.on('data', (data) => {
            const item = JSON.parse(data);

            const returnItem = {
                id: item.id,
                name: item.name || '',
                quality: item.quality || 1,
                itemSource: item.itemSource || {}
            };

            next(null, returnItem);
        });
    });
};

module.exports = {
    getItem
};