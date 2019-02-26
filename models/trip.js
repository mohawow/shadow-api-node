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
  date: {
    type: moment().toJSON(),
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
  intialPay: { 
    type: Number, 
    required: true,
    min: 0,
    max: 1000
  },
  finalPay: { 
    type: Number, 
    required: false,
    min: 0,
    max: 1000
  },
  tips: { 
    type: Number, 
    required: flase,
    min: 0,
    max: 1000
  }
}));

function validateTrip(trip) {
  const schema = {
    block: Joi.string().min(5).max(50).required(),
    date:moment().toJSON(),
    shiftId: Joi.objectId().required(),
    numberOfPackages: Joi.number().min(0).required(),
    numberOfStops: Joi.number().min(0).required(),
    intialPay: Joi.number().min(0).required(),
    finalPay: Joi.number().min(0),
    tips: Joi.number().min(0)
  };

  return Joi.validate(trip, schema);
}

exports.Trip = Trip; 
exports.validate = validateTrip;