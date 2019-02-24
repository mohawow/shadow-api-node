const Joi = require("joi");
const validate = require("../middleware/validate");
const { Report } = require("../models/report");
const { Trip } = require("../models/trip");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  const report = await Report.lookup(req.body.tipId, req.body.tripId);

  if (!report) return res.status(404).send("Report not found.");

  if (report.dateReturned)
    return res.status(400).send("Report processed.");

  report.return();
  await report.save();

  await Trip.update(
    { _id: report.trip._id },
    {
      $inc: { numberOfPackages: 1 }
    }
  );

  return res.send(report);
});

function validateReturn(req) {
  const schema = {
    tipId: Joi.objectId().required(),
    tripId: Joi.objectId().required()
  };

  return Joi.validate(req, schema);
}

module.exports = router;
