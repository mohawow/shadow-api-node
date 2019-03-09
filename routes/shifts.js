const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Shift, validate } = require("../models/shift");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const shifts = await Shift.find()
    .select("-__v")
    .sort("name");
    console.log('what am i sneding', shifts);
  res.send(shifts);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let shift = new Shift({ name: req.body.name });
  shift = await shift.save();

  res.send(shift);
});

router.put("/:id", [auth, validateObjectId], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const shift = await Shift.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    {
      new: true
    }
  );

  if (!shift)
    return res.status(404).send("The shift with the given ID was not found.");

  res.send(shift);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const shift = await Shift.findByIdAndRemove(req.params.id);

  if (!shift)
    return res.status(404).send("The shift with the given ID was not found.");

  res.send(shift);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const shift = await Shift.findById(req.params.id).select("-__v");

  if (!shift)
    return res.status(404).send("The shift with the given ID was not found.");

  res.send(shift);
});

module.exports = router;
