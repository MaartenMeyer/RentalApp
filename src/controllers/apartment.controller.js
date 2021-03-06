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
      assert.equal(typeof apartment.description, 'string', 'apartment.description is required.');
      assert.equal(typeof apartment.streetAddress, 'string', 'apartment.streetAddress is required.');
      assert.equal(typeof apartment.postalCode, 'string', 'apartment.postalCode is required.');
      assert.equal(typeof apartment.city, 'string', 'apartment.city is required.');
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
      "');"

    database.executeQuery(query, (err, rows) => {
      if (err) {
        const errorObject = {
          message: 'Error in database.',
          code: 500
        }
        next(errorObject)
      }
      if (rows) {
        res.status(200);
        res.send('Success!');
      }
    })
  },

  getAllApartments: function(req, res, next) {
    logger.info('Get /api/apartments called');

    const query =
      'SELECT * FROM Apartment ' +
      'INNER JOIN DBUser ON (Apartment.UserId = DBUser.UserId) '

    database.executeQuery(query, (err, rows) => {
      if (err) {
        const errorObject = {
          message: 'Error in database.',
          code: 500
        }
        next(errorObject);
      }
      if (rows) {
        if(rows.recordset.length > 0){
          res.status(200).json({ result: rows.recordset })
        }else{
          const errorObject = {
            message: 'No apartments found',
            code: 404
          }
          next(errorObject);
        }
      }
    })
  },

  getApartmentById: function(req, res, next) {
    logger.info('Get /api/apartments/:apartmentId called')
    const id = req.params.apartmentId;

    const query = `SELECT * FROM Apartment WHERE ApartmentId=${id};`
    database.executeQuery(query, (err, rows) => {
      if (err) {
        const errorObject = {
          message: 'Error in database.',
          code: 500
        }
        next(errorObject);
      }
      if (rows) {
        if(rows.recordset.length > 0){
          res.status(200).json({ result: rows.recordset })
        }else{
          const errorObject = {
            message: 'No apartment found',
            code: 404
          }
          next(errorObject);
        }
      }
    })
  },

  deleteApartmentById: function(req, res, next) {
    logger.info('Delete /api/apartments/:apartmentId called')
    const apartmentId = req.params.apartmentId;
    const userId = req.userId;

    const query = `DELETE FROM Apartment WHERE ApartmentId=${apartmentId} AND UserId=${userId}`
    database.executeQuery(query, (err, rows) => {
      if (err) {
        logger.trace('Could not delete apartment: ', err)
        const errorObject = {
          message: 'Error in database',
          code: 500
        }
        next(errorObject);

      }
      if (rows) {
        if (rows.rowsAffected[0] === 0) {
          const errorObject = {
            message: 'Apartment not found or not authorized to delete this apartment',
            code: 401
          }
          next(errorObject)
        } else {
          res.status(200);
          res.send('Apartment deleted!');
        }
      }
    })
  },

  updateApartmentById: function(req, res, next){
    logger.info('Put /api/apartments/:apartmentId called')
    const apartmentId = req.params.apartmentId;
    const userId = req.userId;

    const apartment= req.body;

    const query = `UPDATE Apartment SET Apartment.Description='${apartment.description}', Apartment.StreetAddress='${apartment.streetAddress}', Apartment.PostalCode='${apartment.postalCode}', Apartment.City='${apartment.city}' WHERE Apartment.UserId=${userId} AND Apartment.ApartmentId=${apartmentId} `
    database.executeQuery(query, (err, rows) => {
      if (err) {
        logger.trace('Could not update : ', err)
        const errorObject = {
          message: 'Error in database',
          code: 500
        }
        next(errorObject);

      }
      if (rows) {
        if (rows.rowsAffected[0] === 0) {
          const errorObject = {
            message: 'Apartment not found or not authorized to update this apartment',
            code: 401
          }
          next(errorObject)
        } else {
          res.status(200);
          res.send('Apartment updated!');
        }
      }
    })
  }
}