const logger = require('../config/config').logger;
const database = require('../data/mssql.dao')
const assert = require('assert');

module.exports = {
  createReservation: function(req, res, next){
    logger.info('Post /api/apartments/:apartmentId/reservations called');

    logger.trace('User id: ', req.userId);
    logger.trace('Req: ', req);

    const id = req.params.apartmentId;
    const reservation = req.body;

    logger.info(reservation);
    try {
      assert.equal(typeof reservation.startDate, 'string', 'reservation.startDate is required.');
      assert.equal(typeof reservation.endDate, 'string', 'reservation.endDate is required.');
    } catch (e) {
      const errorObject = {
        message: e.toString(),
        code: 400
      }
      return next(errorObject);
    }

    var startDate = reservation.startDate;
    var endDate = reservation.endDate;
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    if(startDate > endDate){
      const errorObject = {
        message: 'End date is not after start date of reservation',
        code: 400
      }
      return next(errorObject);
    }

    const query =
    "INSERT INTO Reservation(ApartmentId, StartDate, EndDate, Status, UserId) VALUES ('" +
      id +
      "','" +
      reservation.startDate +
      "','" +
      reservation.endDate +
      "','" +
      reservation.status +
      "','" +
      req.userId +
      "');"

      logger.trace('Query: ', query);

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


  getAllReservations: function(req, res, next){

  },

  getReservationById: function(req, res, next){

  },

  deleteReservationById: function(req, res, next){

  },

  updateReservationById: function(req, res, next){

  }



}