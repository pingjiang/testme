'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Enum contants
var QUESTION_TYPES = ['Choice', 'MutilpleChoices', 'TrueFalse', 'Blanks', 'Calculate', 'Coding', 'Reviews'];

var QuestionSchema = new Schema({
  type: {
    type: String,
    'enum': QUESTION_TYPES,
    'default': QUESTION_TYPES[0]
  },
  author: String,
  identifier: { type: String, trim: true },
  description: { type: String, required: true },
  images: [String],
  choices: [{
    identifier: { type: String, trim: true, required: true },
    choice: String
  }],
  answers: [String],
  explains: [{
    explain: String,
    date: { type: Date, default: Date.now }
  }],
  date: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  coef: { type: Number, default: 0.5 },
  tags: { type: [String], index: true },
  living: { type: Boolean, default: true },
  comments: [{ 
    nicename: String, 
    email: String, 
    body: String, 
    date: Date 
  }],
  meta: {
    votes: { type: Number, default: 0 },
    favs:  { type: Number, default: 0 }
  }
});

module.exports = mongoose.model('Question', QuestionSchema);
