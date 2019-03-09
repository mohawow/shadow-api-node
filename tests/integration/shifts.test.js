const request = require('supertest');
const {Shift} = require('../../models/shift');
const {User} = require('../../models/user');
const mongoose = require('mongoose');

let server;

describe('/api/shifts', () => {
  beforeEach(() => { server = require('../../index'); })
  afterEach(async () => { 
    await server.close(); 
    await Shift.remove({});
  });

  describe('GET /', () => {
    it('should return all shifts', async () => {
      const shifts = [
        { name: 'shift1' },
        { name: 'shift2' },
      ];
      
      await Shift.collection.insertMany(shifts);

      const res = await request(server).get('/api/shifts');
      console.log('BODY: -------------------',res.body)
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.name === 'shift1')).toBeTruthy();
      expect(res.body.some(g => g.name === 'shift2')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    it('should return a shift if valid id is passed', async () => {
      const shift = new Shift({ name: 'shift1' });
      await shift.save();

      const res = await request(server).get('/api/shifts/' + shift._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', shift.name);     
    });

    it('should return 404 if invalid id is passed', async () => {
      const res = await request(server).get('/api/shifts/1');

      expect(res.status).toBe(404);
    });

    it('should return 404 if no shift with the given id exists', async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get('/api/shifts/' + id);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /', () => {

    let token; 
    let name; 

    const exec = async () => {
      return await request(server)
        .post('/api/shifts')
        .set('x-auth-token', token)
        .send({ name });
    }

    beforeEach(() => {
      token = new User().generateAuthToken();      
      name = 'shift1'; 
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''; 

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if shift is less than 5 characters', async () => {
      name = '1234'; 
      
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if shift is more than 50 characters', async () => {
      name = new Array(52).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should save the shift if it is valid', async () => {
      await exec();

      const shift = await Shift.find({ name: 'shift1' });

      expect(shift).not.toBeNull();
    });

    it('should return the shift if it is valid', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'shift1');
    });
  });

  describe('PUT /:id', () => {
    let token; 
    let newName; 
    let shift; 
    let id; 

    const exec = async () => {
      return await request(server)
        .put('/api/shifts/' + id)
        .set('x-auth-token', token)
        .send({ name: newName });
    }

    beforeEach(async () => {
   
      shift = new Shift({ name: 'shift1' });
      await shift.save();
      
      token = new User().generateAuthToken();     
      id = shift._id; 
      newName = 'updatedName'; 
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''; 

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if shift is less than 5 characters', async () => {
      newName = '1234'; 
      
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if shift is more than 50 characters', async () => {
      newName = new Array(52).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 404 if id is invalid', async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 404 if shift with the given id was not found', async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should update the shift if input is valid', async () => {
      await exec();

      const updatedShift = await Shift.findById(shift._id);

      expect(updatedShift.name).toBe(newName);
    });

    it('should return the updated shift if it is valid', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', newName);
    });
  });  

  describe('DELETE /:id', () => {
    let token; 
    let shift; 
    let id; 

    const exec = async () => {
      return await request(server)
        .delete('/api/shifts/' + id)
        .set('x-auth-token', token)
        .send();
    }

    beforeEach(async () => {     
      shift = new Shift({ name: 'shift1' });
      await shift.save();
      
      id = shift._id; 
      token = new User({ isAdmin: true }).generateAuthToken();     
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''; 

      const res = await exec();

      expect(res.status).toBe(401);
    });
    // it('should return 403 if the user is not an admin', async () => {
    //   token = new User({ isAdmin: false }).generateAuthToken(); 

    //   const res = await exec();

    //   expect(res.status).toBe(403);
    // });
    it('should return 404 if id is invalid', async () => {
      id = 1; 
      
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 404 if no shift with the given id was found', async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should delete the shift if input is valid', async () => {
      await exec();

      const shiftInDb = await Shift.findById(id);

      expect(shiftInDb).toBeNull();
    });

    it('should return the removed shift', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id', shift._id.toHexString());
      expect(res.body).toHaveProperty('name', shift.name);
    });
  });  
});