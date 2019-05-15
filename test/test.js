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
