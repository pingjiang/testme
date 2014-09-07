/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var media = require('./media.model');

exports.register = function(socket) {
  media.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  media.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('media:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('media:remove', doc);
}
