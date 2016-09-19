'use strict';

const exists = (variable) => {
    return (variable !== null && variable !== undefined && variable !== 'null' && variable !== 'undefined');
};

// Exports functions
module.exports = {
    exists
};