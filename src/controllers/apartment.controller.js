const logger = require('../config/config').logger;
const database = require('../data/mssql.dao')
const assert = require('assert');

module.exports = {
  createApartment: function(req, res, next){
    logger.info('Post /api/apartments called');

    logger.trace('User id: ', req.userId);

    const apartment = req.body;
    logger.info(apartment);
    try {
      assert.equal(typeof apartment.street, 'string', 'apartment.street is required.' )
    } catch (e) {
      const errorObject = {
        message: e.toString(),
        code: 400
      }
      return next(errorObject);
    }

    const query =
    "INSERT INTO Apartment(Description, StreetAddress, PostalCode, City, UserId) VALUES ('" +
      apartment.description +
      "','" +
      apartment.streetAddress +
      "','" +
      apartment.postalCode +
      "','" +
      apartment.city +
      "','" +
      req.userId +
      "'); SELECT * FROM Apartment INNER JOIN DBUser ON Apartment.UserId = DBUser.UserId WHERE ApartmentId = SCOPE_IDENTITY();"

    database.executeQuery(query, (err, rows) => {
      if (err) {
        const errorObject = {
          message: 'Fout in database.',
          code: 500
        }
        next(errorObject)
      }
      if (rows) {
        res.status(200).json({ result: rows.recordset })
      }
    })
  },

  getAllApartments: function(req, res, next) {
    logger.info('Get /api/apartments called');

    const query =
      'SELECT * FROM Apartment ' +
      'INNER JOIN DBUser ON (Apartment.UserId = DBUser.UserId) ' +
      ' JOIN Reservation ON (Apartment.ApartmentId = Reservation.ApartmentId)'

    database.executeQuery(query, (err, rows) => {
      if (err) {
        const errorObject = {
          message: 'Fout in database.',
          code: 500
        }
        next(errorObject)
      }
      if (rows) {
        res.status(200).json({ result: rows.recordset })
      }
    })
  },

  getApartmentById: function(req, res, next) {
    logger.info('Get /api/apartments/id aangeroepen')
    const id = req.params.id;

    const query = `SELECT * FROM Apartment WHERE ApartmentId=${id};`
    database.executeQuery(query, (err, rows) => {
      if (err) {
        const errorObject = {
          message: 'Fout in database.',
          code: 500
        }
        next(errorObject)
      }
      if (rows) {
        res.status(200).json({ result: rows.recordset })
      }
    })
  },
}