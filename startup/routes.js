const express = require('express');
const shifts = require('../routes/shifts');
const tips = require('../routes/tips');
const trips = require('../routes/trips');
const reports = require('../routes/reports');
const users = require('../routes/users');
const auth = require('../routes/auth');
const returns = require('../routes/returns');
const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json());
  app.use('/api/shifts', shifts);
  app.use('/api/tips', tips);
  app.use('/api/trips', trips);
  app.use('/api/reports', reports);
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use('/api/returns', returns);
  app.use(error);
}