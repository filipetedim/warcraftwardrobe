'use strict';

// Dependencies
const restful = require('node-restful');
const mongoose = restful.mongoose;

// Schema
const ItemsSchema = mongoose.Schema({
    id: String,
    name: String,
    quality: Number,
    itemSource: {
        sourceId: String,
        sourceType: String,
        reagents: [{id: String, quantity: Number}]
    }
});

// remove the _id of every document before returning the result
if (!ItemsSchema.options.toObject) ItemsSchema.options.toObject = {};
ItemsSchema.options.toObject.transform = function (doc, ret) {
    delete ret._id;
};


// Return model and functions
module.exports = restful.model('Items', ItemsSchema);