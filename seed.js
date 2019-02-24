const { Shift } = require("./models/shift");
const { Trip } = require("./models/trip");
const mongoose = require("mongoose");
const config = require("config");

const data = [
  {
    name: "Morning",
    trips: [
      { block: "8:30AM - 9:30AM", numberOfPackages: 5, numberOfStops: 2 },
      { block: "8:30AM - 9:30AM", numberOfPackages: 10, numberOfStops: 2 },
      { block: "8:30AM - 9:30AM", numberOfPackages: 15, numberOfStops: 2 }
    ]
  },
  {
    name: "Afternoon",
    trips: [
      { block: "12:30PM - 01:30PM", numberOfPackages: 5, numberOfStops: 2 },
      { block: "12:30PM - 01:30PM", numberOfPackages: 10, numberOfStops: 2 },
      { block: "12:30PM - 01:30PM", numberOfPackages: 15, numberOfStops: 2 }
    ]
  },
  {
    name: "Evening",
    trips: [
      { block: "04:30PM - 06:30PM", numberOfPackages: 5, numberOfStops: 2 },
      { block: "04:30PM - 06:30PM", numberOfPackages: 10, numberOfStops: 2 },
      { block: "04:30PM - 06:30PM", numberOfPackages: 15, numberOfStops: 2 }
    ]
  },
  {
    name: "Night",
    trips: [
      { block: "07:30PM - 08:30PM", numberOfPackages: 5, numberOfStops: 2 },
      { block: "07:30PM - 08:30PM", numberOfPackages: 10, numberOfStops: 2 },
      { block: "07:30PM - 08:30PM", numberOfPackages: 15, numberOfStops: 2 }
    ]
  }
];

async function seed() {
  await mongoose.connect(config.get("db"));

  await Trip.deleteMany({});
  await Shift.deleteMany({});

  for (let shift of data) {
    const { _id: shiftId } = await new Shift({ name: shift.name }).save();
    const trips = shift.trips.map(trip => ({
      ...trip,
      shift: { _id: shiftId, name: shift.name }
    }));
    await Trip.insertMany(trips);
  }

  mongoose.disconnect();
  console.info("Done!");
}
seed();
// completed on 02/23/19