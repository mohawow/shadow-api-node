const Joi = require('joi');
const mongoose = require('mongoose');
const moment = require('moment');

const reportSchema = new mongoose.Schema({
  tip: { 
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      },
      isGold: {
        type: Boolean,
        default: false
      },
      phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      }      
    }),  
    required: true
  },
  trip: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true, 
        minlength: 5,
        maxlength: 255
      },
      dailyReportRate: { 
        type: Number, 
        required: true,
        min: 0,
        max: 255
      }   
    }),
    required: true
  },
  dateOut: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  dateReturned: { 
    type: Date
  },
  reportFee: { 
    type: Number, 
    min: 0
  }
});

reportSchema.statics.lookup = function(tipId, tripId) {
  return this.findOne({
    'tip._id': tipId,
    'trip._id': tripId,
  });
}

reportSchema.methods.return = function() {
  this.dateReturned = new Date();

  const reportDays = moment().diff(this.dateOut, 'days');
  this.reportFee = reportDays * this.trip.dailyReportRate;
}

const Report = mongoose.model('Report', reportSchema);

function validateReport(report) {
  const schema = {
    tipId: Joi.objectId().required(),
    tripId: Joi.objectId().required()
  };

  return Joi.validate(report, schema);
}

exports.Report = Report; 
exports.validate = validateReport;