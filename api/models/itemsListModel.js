'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ItemSchema = new Schema({
    name: String,
    price: String,
    description: String,
    image: String,
    url: String,
});

module.exports = mongoose.model('Items', ItemSchema);