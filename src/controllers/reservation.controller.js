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
      assert.equal(typeof reservation.status, 'string', 'reservation.status is required.');
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
    logger.info('Get /api/apartments/:apartmentId/reservations called');

    const id = req.params.apartmentId;

    const query =
      `SELECT * FROM Reservation WHERE Reservation.ApartmentId=${id};`

    database.executeQuery(query, (err, rows) => {
      if (err) {
        const errorObject = {
          message: 'Fout in database.',
          code: 500
        }
        next(errorObject)
      }
      if (rows) {
        if(rows.recordset.length > 0){
          res.status(200).json({ result: rows.recordset })
        }else{
          const errorObject = {
            message: 'No reservations found',
            code: 404
          }
          next(errorObject);
        }
      }
    })
  },

  getReservationById: function(req, res, next){
    logger.info('Get /api/apartments/:apartmentId/reservations/:reservationId called');

    const apartmentId = req.params.apartmentId;
    const reservationId = req.params.reservationId;

    const query =
      `SELECT * FROM Reservation WHERE Reservation.ReservationId=${reservationId} AND Reservation.ApartmentId=${apartmentId};`

    database.executeQuery(query, (err, rows) => {
      if (err) {
        const errorObject = {
          message: 'Fout in database.',
          code: 500
        }
        next(errorObject)
      }
      if (rows) {
        if(rows.recordset.length > 0){
          res.status(200).json({ result: rows.recordset })
        }else{
          const errorObject = {
            message: 'No reservation found',
            code: 404
          }
          next(errorObject);
        }
      }
    })
  },

  deleteReservationById: function(req, res, next){
    logger.info('Delete /api/apartments/:apartmentId/reservations/:reservationId called')
    const reservationId = req.params.reservationId;
    const userId = req.userId;

    const query = `DELETE FROM Reservation WHERE ReservationId=${reservationId} AND UserId=${userId}`
    database.executeQuery(query, (err, rows) => {
      if (err) {
        logger.trace('Could not delete apartment: ', err)
        const errorObject = {
          message: 'Error in database',
          code: 500
        }
        next(errorObject)

      }
      if (rows) {
        if (rows.rowsAffected[0] === 0) {
          const msg = 'Reservation not found or not authorized to delete this reservation';
          logger.trace(msg)
          const errorObject = {
            message: msg,
            code: 401
          }
          next(errorObject)
        } else {
          res.status(200);
          res.send('Reservation deleted!');
        }
      }
    })

  },

  updateReservationById: function(req, res, next){

  }



}