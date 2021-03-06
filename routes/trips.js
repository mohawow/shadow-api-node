const { Trip, validate } = require("../models/trip");
const { Shift } = require("../models/shift");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const moment = require("moment");
const express = require("express");
const router = express.Router();



router.get("/:userId", async (req, res) => {
  const trips = await Trip.find({ userId: req.params.userId})
    .select("-__v")
    .sort("name");
  res.send(trips);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const shift = await Shift.findById(req.body.shiftId);
  if (!shift) return res.status(400).send("Invalid shift.");

  const trip = new Trip({
    block: req.body.block,
    date: req.body.date,
    shift: {
      _id: shift._id,
      name: shift.name
    },
    numberOfPackages: req.body.numberOfPackages,
    numberOfStops: req.body.numberOfStops,
    initialPay: req.body.initialPay,
    finalPay: req.body.finalPay,
    tips: req.body.tips,
    userId: req.body.userId
  });
  await trip.save();

  res.send(trip);
});

router.put("/trip/:id", [auth], async (req, res) => {
  console.log('route hit', req.body);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const shift = await Shift.findById(req.body.shiftId);
  if (!shift) return res.status(400).send("Invalid shift.");

  const trip = await Trip.findByIdAndUpdate(
    req.params.id,
    {
      block: req.body.block,
      date: req.body.date,
      shift: {
        _id: shift._id,
        name: shift.name
      },
      numberOfPackages: req.body.numberOfPackages,
      numberOfStops: req.body.numberOfStops,
      initialPay: req.body.initialPay,
      finalPay: req.body.finalPay,
      tips: req.body.tips,
      userId: req.body.userId
    },
    { new: true }
  );

  if (!trip)
    return res.status(404).send("The trip with the given ID was not found.");

  res.send(trip);
});

router.delete("/trip/:id", [auth, admin], async (req, res) => {
  const trip = await Trip.findByIdAndRemove(req.params.id);

  if (!trip)
    return res.status(404).send("The trip with the given ID was not found.");

  res.send(trip);
});

router.get("/trip/:id", validateObjectId, async (req, res) => {
  const trip = await Trip.findById(req.params.id).select("-__v");

  if (!trip)
    return res.status(404).send("The trip with the given ID was not found.");

  res.send(trip);
});

module.exports = router;
