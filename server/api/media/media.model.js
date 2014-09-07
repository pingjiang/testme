'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MediaSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Media', MediaSchema);
