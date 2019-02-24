const moment = require('moment');
const request = require('supertest');
const {Report} = require('../../models/report');
const {Trip} = require('../../models/trip');
const {User} = require('../../models/user');
const mongoose = require('mongoose');

describe('/api/returns', () => {
  let server; 
  let tipId; 
  let tripId;
  let report;
  let trip; 
  let token;

  const exec = () => {
    return request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ tipId, tripId });
  };
  
  beforeEach(async () => { 
    server = require('../../index'); 

    tipId = mongoose.Types.ObjectId();
    tripId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    trip = new Trip({
      _id: tripId,
      block: '12345',
      numberOfStops: 2,
      shift: { name: '12345' },
      numberOfPackages: 10 
    });
    await trip.save();

    report = new Report({
      tip: {
        _id: tipId,
        name: '12345',
        phone: '12345'
      },
      trip: {
        _id: tripId,
        block: '12345',
        numberOfStops: 2
      }
    });
    await report.save();
  });

  afterEach(async () => { 
    await server.close(); 
    await Report.remove({});
    await Trip.remove({});
  });  

  it('should return 401 if client is not logged in', async () => {
    token = '';

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it('should return 400 if tipId is not provided', async () => {
    tipId = ''; 
    
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 400 if tripId is not provided', async () => {
    tripId = ''; 

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 404 if no report found for the tip/trip', async () => {
    await Report.remove({});

    const res = await exec();

    expect(res.status).toBe(404);
  });

  it('should return 400 if return is already processed', async () => {
    report.dateReturned = new Date();
    await report.save();

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 200 if we have a valid request', async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it('should set the returnDate if input is valid', async () => {
    const res = await exec();

    const reportInDb = await Report.findById(report._id);
    const diff = new Date() - reportInDb.dateReturned;
    expect(diff).toBeLessThan(10 * 1000);
  });

  it('should set the reportFee if input is valid', async () => {
    report.dateOut = moment().add(-7, 'days').toDate();
    await report.save();

    const res = await exec();

    const reportInDb = await Report.findById(report._id);
    expect(reportInDb.reportFee).toBe(14);
  });

  it('should increase the trip stock if input is valid', async () => {
    const res = await exec();

    const tripInDb = await Trip.findById(tripId);
    expect(tripInDb.numberOfPackages).toBe(trip.numberOfPackages + 1);
  });

  it('should return the report if input is valid', async () => {
    const res = await exec();

    const reportInDb = await Report.findById(report._id);

    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining(['dateOut', 'dateReturned', 'reportFee',
      'tip', 'trip']));
  });
});