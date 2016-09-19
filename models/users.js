'use strict';

// Dependencies
const restful = require('node-restful');
const mongoose = restful.mongoose;
const bcrypt = require('bcryptjs');

// Schema
const UserSchema = mongoose.Schema({
    email: {type: String, required: true, lowercase: true, trim: true, unique: true},
    name: {type: String, required: true},
    password: {type: String, required: true},
    token: String,
    settings: {
        authorization: [String],
        active: {type: Boolean, default: false},
        activation_date: Date
    }
});

/***********************************************************************************************************************
 * VIRTUALS
 **********************************************************************************************************************/
UserSchema.virtual('created_at').get(() => {
    return this._id.getTimestamp();
});

/***********************************************************************************************************************
 * PRE
 **********************************************************************************************************************/
UserSchema.pre('save', function (next) {
    // ES6 arrow function cannot be used as they change the semantics of the 'this' keyword.
    // http://stackoverflow.com/questions/36794709/inside-schema-method-scopes-this-is-empty-in-mongoose-4-4-12
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, (err, salt) => {
            if (!err) {
                console.log("got into error");
                // TODO rollbar error handling
                return next(err);
            }

            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) {
                    // TODO rollbar error handling
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

/***********************************************************************************************************************
 * METHODS
 **********************************************************************************************************************/

/**
 *
 * @param {String} candidatePassword - password to be compared
 * @param {Function} next - callback
 */
UserSchema.methods.comparePassword = (candidatePassword, next) => {
    bcrypt.compare(candidatePassword, this.password, (err, match) => {
        if (err) {
            // TODO rollbar error handling
            return next(err);
        }
        next(null, match);
    });
};

/***********************************************************************************************************************
 * STATICS
 **********************************************************************************************************************/


// Exports restful object
module.exports = restful.model('Users', UserSchema);