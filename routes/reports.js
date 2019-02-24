const { Report, validate } = require("../models/report");
const { Trip } = require("../models/trip");
const { Tip } = require("../models/tip");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const express = require("express");
const router = express.Router();

Fawn.init(mongoose);

router.get("/", auth, async (req, res) => {
  const reports = await Report.find()
    .select("-__v")
    .sort("-dateOut");
  res.send(reports);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const tip = await Tip.findById(req.body.tipId);
  if (!tip) return res.status(400).send("Invalid tip.");

  const trip = await Trip.findById(req.body.tripId);
  if (!trip) return res.status(400).send("Invalid trip.");

  if (trip.numberOfPackages === 0)
    return res.status(400).send("Trip not in the account.");

  let report = new Report({
    tip: {
      _id: tip._id,
      name: tip.name,
      phone: tip.phone
    },
    trip: {
      _id: trip._id,
      title: trip.title,
      numberOfStops: trip.numberOfStops
    }
  });

  try {
    new Fawn.Task()
      .save("reports", report)
      .update(
        "trips",
        { _id: trip._id },
        {
          $inc: { numberOfPackages: -1 }
        }
      )
      .run();

    res.send(report);
  } catch (ex) {
    res.status(500).send("Something failed.");
  }
});

router.get("/:id", [auth], async (req, res) => {
  const report = await Report.findById(req.params.id).select("-__v");

  if (!report)
    return res.status(404).send("The report with the given ID was not found.");

  res.send(report);
});

module.exports = router;
