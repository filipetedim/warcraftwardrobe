'use strict';

const config = require('./config');
const database = require('./database');
const battlenet = require('./battlenet');
const wowdb = require('./wowdb');

/**
 * Creates the url to connect to mlab.com.
 * 
 * @return {string} - db url
 */
const getDbConnectionUrl = function () {
    return `mongodb://${database.USERNAME}:${database.PASSWORD}@${database.URL}`;
};

/**
 * Creates the url to connect to battlenet's API.
 * 
 * @param {String} type - type of request (item/spell/..)
 * @param {Number} id - if of item/spell/..
 * @return {string} - battlenet url
 */
const getBattlenetUrl = function (type, id) {
    return `${battlenet.URL}/${type}/${id}?locale=${battlenet.LOCALE}&apikey=${battlenet.API_KEY}`;
};

/**
 * Creates the url to connect to wowdb's API.
 *
 * @param {String} type - type of request (item/spell/..)
 * @param {Number} id - if of item/spell/..
 * @return {string} - wowdb url
 */
const getWowdbUrl = function (type, id) {
    return `${wowdb.URL}/${type}/${id}?cookieTest=1`
};

module.exports = {
    getDbConnectionUrl: getDbConnectionUrl,
    getBattlenetUrl: getBattlenetUrl,
    getWowdbUrl: getWowdbUrl,
    PORT: config.PORT,
    SECRET: config.SECRET
};