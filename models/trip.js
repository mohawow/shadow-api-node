const Joi = require('joi');
const mongoose = require('mongoose');
const {shiftSchema} = require('./shift');

const Trip = mongoose.model('Trips', new mongoose.Schema({
  block: {
    type: String,
    required: true,
    trim: true, 
    minlength: 5,
    maxlength: 255
  },
  shift: { 
    type: shiftSchema,  
    required: true
  },
  numberOfPackages: { 
    type: Number, 
    required: true,
    min: 0,
    max: 255
  },
  dailyReportRate: { 
    type: Number, 
    required: false,
    min: 0,
    max: 255
  }
}));

function validateTrip(trip) {
  const schema = {
    block: Joi.string().min(5).max(50).required(),
    shiftId: Joi.objectId().required(),
    numberOfPackages: Joi.number().min(0).required(),
    dailyReportRate: Joi.number().min(0)
  };

  return Joi.validate(trip, schema);
}

exports.Trip = Trip; 
exports.validate = validateTrip;