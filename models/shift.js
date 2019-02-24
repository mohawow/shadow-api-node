const Joi = require('joi');
const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
});

const Shift = mongoose.model('Shift', shiftSchema);

function validateShift(shift) {
  const schema = {
    name: Joi.string().min(5).max(50).required()
  };

  return Joi.validate(shift, schema);
}

exports.shiftSchema = shiftSchema;
exports.Shift = Shift; 
exports.validate = validateShift;