const express = require('express');
const shifts = require('../routes/shifts');
const trips = require('../routes/trips');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json());
  app.use('/api/shifts', shifts);
  app.use('/api/trips', trips);
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use(error);
}
