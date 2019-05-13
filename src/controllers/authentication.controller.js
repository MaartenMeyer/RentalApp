const logger = require('../config/config').logger;
const jwt = require('jsonwebtoken');
const database = require('../data/mssql.dao');
const assert = require('assert');

const emailValidation = new RegExp('^[^@]+@[^@]+\\.[^@]+$');
const postalCodeValidator = new RegExp('^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-zA-Z]{2}$');
const phoneValidator = new RegExp('^06(| |-)[0-9]{8}$');
const emailValidator = new RegExp('^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$');
const passwordValidator = new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$');

module.exports = {
  registerUser: function(req, res, next) {
    logger.info('function registerUser called');

    const user = req.body;

    try {
      assert.equal(typeof user.firstName, 'string', 'firstName is required.');
      assert(emailValidation.test(user.emailAddress), 'Valid email is required.');
    } catch (e){
      const errorObject = {
        message: 'Validation fails: ' + ex.toString(),
        code: 500
      }
      return next(errorObject)
    }

    const query =
      `INSERT INTO [DBUser] (FirstName, LastName, StreetAddress, PostalCode, City, DateOfBirth, PhoneNumber, EmailAddress, Password)` +
      `VALUES ('${user.firstName}', '${user.lastName}', '${user.streetAddress}', ` +
      `'${user.postalCode}', '${user.city}', '${user.dateOfBirth}',` +
      `${user.phoneNumber}, '${user.emailAddress}', '${user.password}')` +
      `; SELECT SCOPE_IDENTITY() AS UserId`

    database.executeQuery(query, (err, rows) => {
      // verwerk error of result
      if (err) {
        const errorObject = {
          message: 'Er ging iets mis in de database.',
          code: 500
        }
        next(errorObject)
      }
      if (rows) {
        res.status(200).json({ result: rows.recordset })
      }
    })
  },

  loginUser: (req, res, next) => {
    logger.info('loginUser aangeroepen')

    // user informatie uit req.body halen
    const user = req.body
    // Verifieer dat de juiste velden aanwezig zijn. ToDo.

    // SELECT query samenstellen
    const query = `SELECT Password, UserId FROM [DBUser] WHERE EmailAddress='${user.emailAddress}'`
    // Query uitvoeren en resultaat retourneren.
    database.executeQuery(query, (err, rows) => {
      // verwerk error of result
      if (err) {
        const errorObject = {
          message: 'Er ging iets mis in de database.',
          code: 500
        }
        next(errorObject)
      }
      if (rows) {
        // Als we hier zijn:
        if (rows.recordset.length === 0 || req.body.password !== rows.recordset[0].Password) {
          const errorObject = {
            message: 'Geen toegang: email bestaat niet of password is niet correct!',
            code: 401
          }
          next(errorObject)
        } else {
          logger.info('Password match, user logged id')
          logger.trace(rows.recordset)

          // Maak de payload, die we in het token stoppen.
          // De payload kunnen we er bij het verifiëren van het token later weer uithalen.
          const payload = {
            UserId: rows.recordset[0].UserId
          }
          jwt.sign({ data: payload }, 'secretkey', { expiresIn: 60 * 60 }, (err, token) => {
            if (err) {
              const errorObject = {
                message: 'Kon geen JWT genereren.',
                code: 500
              }
              next(errorObject)
            }
            if (token) {
              res.status(200).json({
                result: {
                  token: token
                }
              })
            }
          })
        }
      }
    })
  },

  getAll: (req, res, next) => {
    logger.info('getAll aangeroepen')

    // query samenstellen met user data
    const query = `SELECT * FROM [DBUser]`

    // Query aanroepen op de database
    database.executeQuery(query, (err, rows) => {
      if (err) {
        const errorObject = {
          message: 'Er ging iets mis in de database.',
          code: 500
        }
        next(errorObject)
      }
      if (rows) {
        res.status(200).json({ result: rows.recordset })
      }
    })
  }
}