'use strict';

// Dependencies
const http = require('http');
const config = require('../config');
const utils = require('../middlewares/utils');

/**
 * Requests spell information from wowdb's API.
 * If status is anything other 200, returns an error.
 * If no reagents are sent, returns an error.
 * Creates a new spell with only id and reagents array containing the item id and quantity.
 *
 * TODO: Might require further testing for other status.
 *
 * @param {Number} id - spell id
 * @param {Function} next - callback
 */
const getSpell = (id, next) => {
    http.get(config.getWowdbUrl('spell', id), (res) => {
        if (res.statusCode !== 200) {
            // TODO: rollbar error
            return next({success: false, statusCode: res.statusCode, message: `Wowdb: Something went wrong.`});
        }

        // creating item variable to concat data
        let spell = '';

        // concat data from wowdb, their API sucks
        res.on('data', (data) => {
            spell += data.toString();
        });

        // when done, do logic
        res.on('end', () => {
            if (spell === '' || !utils.exists(spell)) {
                // TODO: rollbar error
                return next({success: false, statusCode: 503, message: `Wowdb: Something went wrong.`});
            }

            // remove first and last elements, since their API really sucks; JSON response comes inside ( )
            spell = JSON.parse(spell.slice(1, spell.length - 1));

            if (!utils.exists(spell.Reagents) || spell.Reagents.length < 1) {
                // TODO: rollbar error
                return next({success: false, statusCode: 417, message: `Wowdb: Spell has no reagents.`});
            }

            let reagents = [];
            spell.Reagents.forEach(reagent => {
                reagents.push({id: reagent.Item, quantity: reagent.ItemQty});
            });

            const returnSpell = {
                id: spell.ID,
                reagents: reagents
            };

            next(null, returnSpell);
        });
    });
};

module.exports = {
    getSpell
};