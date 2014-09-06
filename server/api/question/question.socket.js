/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var question = require('./question.model');

exports.register = function(socket) {
  question.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  question.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('question:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('question:remove', doc);
}
