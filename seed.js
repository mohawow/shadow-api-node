const { Shift } = require("./models/shift");
const { Trip } = require("./models/trip");
const mongoose = require("mongoose");
const config = require("config");
const moment = require("moment");

const data = [
  {
    name: "Morning",
    trips: [
      { block: "8:30AM - 9:30AM", date: moment().toJSON(), numberOfStops: 2, numberOfPackages: 3, initialPay: 35, finalPay: 40, tips: 5, userId:"5c75e2fa8ba203e53b18ea0a" },
      { block: "8:30AM - 9:30AM", date: moment().toJSON(), numberOfPackages: 10, numberOfStops: 2, initialPay: 35, finalPay: 40, tips: 5, userId:"5c75e2fa8ba203e53b18ea0a" },
      { block: "8:30AM - 9:30AM", date: moment().toJSON(), numberOfPackages: 15, numberOfStops: 2, initialPay: 35, finalPay: 40, tips: 5, userId:"5c75e2fa8ba203e53b18ea0a" }
    ]
  },
  {
    name: "Afternoon",
    trips: [
      { block: "12:30PM - 01:30PM", date: moment().toJSON(), numberOfPackages: 5, numberOfStops: 2, initialPay: 25, finalPay: 30, tips: 10, userId:"5c75e2fa8ba203e53b18ea0a" },
      { block: "12:30PM - 01:30PM", date: moment().toJSON(), numberOfPackages: 10, numberOfStops: 2, initialPay: 25, finalPay: 30, tips: 10, userId:"5c75e2fa8ba203e53b18ea0a"},
      { block: "12:30PM - 01:30PM", date: moment().toJSON(), numberOfPackages: 15, numberOfStops: 2, initialPay: 25, finalPay: 30, tips: 10, userId:"5c75e2fa8ba203e53b18ea0a" }
    ]
  },
  {
    name: "Evening",
    trips: [
      { block: "04:30PM - 06:30PM", date:moment().toJSON(), numberOfPackages: 5, numberOfStops: 2, initialPay: 25,finalPay: 30, tips: 10, userId:"5c75e2fa8ba203e53b18ea0a"  },
      { block: "04:30PM - 06:30PM", date: moment().toJSON(), numberOfPackages: 10, numberOfStops: 2, initialPay: 25, finalPay: 30, tips: 10, userId:"5c75e2fa8ba203e53b18ea0a" },
      { block: "04:30PM - 06:30PM", date: moment().toJSON(), numberOfPackages: 15, numberOfStops: 2, initialPay: 25, finalPay: 30, tips: 10, userId:"5c75e2fa8ba203e53b18ea0a"  }
    ]
  },
  {
    name: "Night",
    trips: [
      { block: "07:30PM - 08:30PM", date: moment().toJSON(), numberOfPackages: 5, numberOfStops: 2, initialPay: 45, finalPay: 50, tips: 5, userId:"5c75e2fa8ba203e53b18ea0a"},
      { block: "07:30PM - 08:30PM", date: moment().toJSON(), numberOfPackages: 10, numberOfStops: 2, initialPay: 45, finalPay: 50, tips: 5, userId:"5c75e2fa8ba203e53b18ea0a" },
      { block: "07:30PM - 08:30PM", date: moment().toJSON(), numberOfPackages: 15, numberOfStops: 2, initialPay: 45, finalPay: 50, tips: 5, userId:"5c75e2fa8ba203e53b18ea0a" }
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(config.get("db"));
    await Trip.deleteMany({});
    await Shift.deleteMany({});
  } catch (err) {
    console.error('err', err);
  }


  for (let shift of data) {
    try {
      const { _id: shiftId } = await new Shift({ name: shift.name }).save();
      const trips = shift.trips.map(trip => ({
        ...trip,
        shift: { _id: shiftId, name: shift.name }
      }));
      await Trip.insertMany(trips);
    } catch (err) {
      console.error('err', err);
    }
  }

  mongoose.disconnect();
  console.info("Done!");
}
seed();
