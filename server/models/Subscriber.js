const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const moment = require("moment");

const subscriberSchema = mongoose.Schema({
    userTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    userFrom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = { Subscriber };