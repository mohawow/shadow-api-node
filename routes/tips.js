const { Tip, validate } = require("../models/tip");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const tips = await Tip.find()
    .select("-__v")
    .sort("name");
  res.send(tips);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let tip = new Tip({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone
  });
  tip = await tip.save();

  res.send(tip);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const tip = await Tip.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone
    },
    { new: true }
  );

  if (!tip)
    return res
      .status(404)
      .send("The tip with the given ID was not found.");

  res.send(tip);
});

router.delete("/:id", auth, async (req, res) => {
  const tip = await Tip.findByIdAndRemove(req.params.id);

  if (!tip)
    return res
      .status(404)
      .send("The tip with the given ID was not found.");

  res.send(tip);
});

router.get("/:id", auth, async (req, res) => {
  const tip = await Tip.findById(req.params.id).select("-__v");

  if (!tip)
    return res
      .status(404)
      .send("The tip with the given ID was not found.");

  res.send(tip);
});

module.exports = router;
