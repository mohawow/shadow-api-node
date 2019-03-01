const Joi = require('joi');
const mongoose = require('mongoose');
const {shiftSchema} = require('./shift');

const Trip = mongoose.model('Trips', new mongoose.Schema({
  block: {
    type: String,
    required: true,
    minlength: 0,
    maxlength: 255
  },
  date: {
    type: String,
    required: false,
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
  numberOfStops: { 
    type: Number, 
    required: true,
    min: 0,
    max: 255
  },
  initialPay: { 
    type: Number, 
    required: true,
    min: 0,
    max: 255
  },
  finalPay: { 
    type: Number, 
    required: false,
    min: 0,
    max: 255,
    default:0
  },
  tips: { 
    type: Number, 
    required: false,
    min: 0,
    max: 255
  }
}));

function validateTrip(trip) {
  const schema = {
    block: Joi.string().min(5).max(50).required(),
    date:Joi.string(),
    shiftId: Joi.objectId(),
    numberOfPackages: Joi.number().min(0).required(),
    numberOfStops: Joi.number().min(0).required(),
    initialPay: Joi.number().min(0).required(),
    finalPay: Joi.number().min(0).optional().allow(''),
    tips: Joi.number().min(0)
  };
  return Joi.validate(trip, schema);
}
exports.Trip = Trip; 
exports.validate = validateTrip;