const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const server = require('../app.js');

chai.should();
chai.use(chaiHttp);

let token;

before(() => {
  console.log('before')

  const payload = {
    UserId: 2
  }
  jwt.sign({ data: payload }, 'secretkey', { expiresIn: 2 * 60 }, (err, result) => {
    if (result) {
      token = result
    }
  })
})

beforeEach(() => {
  console.log('- beforeEach')
})

describe('Api Apartment POST', () => {
  it('Create new apartment and post', done => {
    chai.request(server)
        .post('/api/apartments')
        .set('Authorization', 'Bearer ' + token)
        .send({
            "description": "Test Apartment",
            "streetAddress": "Lovensdijkstraat 63",
            "postalCode": "4818 AJ",
            "city": "Breda"
        })
        .end(function(err, res, body) {
            res.should.have.status(200);
            done()
        })
  });

  it('Create new apartment with invalid token', done => {
    chai.request(server)
        .post('/api/apartments')
        .set('Authorization', 'Bearer ' + '"abcdefghijklmnop"')
        .send({
            "description": "Test Apartment",
            "streetAddress": "Lovensdijkstraat 63",
            "postalCode": "4818 AJ",
            "city": "Breda"
        })
        .end(function(err, res, body) {
            res.should.have.status(401);
            done()
        })
  });
})

describe('Api Apartment GET', () => {
  it('Get all apartments', done => {
    chai.request(server)
        .get('/api/apartments')
        .end(function(err, res, body) {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done()
    })
  });

  it('Get apartment by id', done => {
    chai.request(server)
        .get('/api/apartments/1')
        .end(function(err, res, body) {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done()
    })
  });

  it('Get apartment by invalid id', done => {
    chai.request(server)
        .get('/api/apartments/0')
        .end(function(err, res, body) {
          res.should.have.status(404);
          res.body.should.be.a('object');
          done()
    })
  });

  it('Get on unknown endpoint', function (done) {
    chai.request(server)
        .get('/api/unknown')
        .end(function (err, res) {
            res.should.have.status(404);
            res.body.should.be.a('object');
            done();
        })
  });
})

describe('Api Reservation POST', () => {
  it('Create new reservation and post', done => {
    chai.request(server)
        .post('/api/apartments/1/reservations')
        .set('Authorization', 'Bearer ' + token)
        .send({
          "startDate": "2019-06-10",
          "endDate": "2019-06-12"
        })
        .end(function(err, res, body) {
            res.should.have.status(200);
            done()
        })
  });

  it('Create new reservation with endDate before startDate', done => {
    chai.request(server)
        .post('/api/apartments/1/reservations')
        .set('Authorization', 'Bearer ' + token)
        .send({
          "startDate": "2019-06-12",
          "endDate": "2019-06-10"
        })
        .end(function(err, res, body) {
            res.should.have.status(400);
            done()
        })
  });

  it('Create new reservation with invalid apartmentId', done => {
    chai.request(server)
        .post('/api/apartments/0/reservations')
        .set('Authorization', 'Bearer ' + token)
        .send({
          "startDate": "2019-06-10",
          "endDate": "2019-06-12"
        })
        .end(function(err, res, body) {
            res.should.have.status(500);
            done()
        })
  });
})

describe('Api Reservation GET', () => {
  it('Get all reservations', done => {
    chai.request(server)
        .get('/api/apartments/1/reservations')
        .end(function(err, res, body) {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done()
    })
  });

  it('Get all reservations on invalid apartmentId', done => {
    chai.request(server)
        .get('/api/apartments/0/reservations')
        .end(function(err, res, body) {
          res.should.have.status(404);
          res.body.should.be.a('object');
          done()
    })
  });

  it('Get reservation by id', done => {
    chai.request(server)
        .get('/api/apartments/1/reservations/1')
        .end(function(err, res, body) {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done()
    })
  });

  it('Get reservation by invalid id', done => {
    chai.request(server)
        .get('/api/apartments/1/reservations/0')
        .end(function(err, res, body) {
          res.should.have.status(404);
          res.body.should.be.a('object');
          done()
    })
  });

})
