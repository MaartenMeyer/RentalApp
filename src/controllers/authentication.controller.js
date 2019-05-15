const logger = require('../config/config').logger;
const jwt = require('jsonwebtoken');
const database = require('../data/mssql.dao');
const assert = require('assert');

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
      assert.equal(typeof user.lastName, 'string', 'lastName is required.');
      assert.equal(typeof user.streetAddress, 'string', 'streetAddress is required.');
      assert.equal(typeof user.postalCode, 'string', 'postalCode is required.');
      assert.equal(typeof user.city, 'string', 'city is required.');
      assert.equal(typeof user.dateOfBirth, 'string', 'dateOfBirth is required.');
      assert.equal(typeof user.phoneNumber, 'string', 'phoneNumber is required.');
      assert.equal(typeof user.emailAddress, 'string', 'emailAddress is required.');
      assert.equal(typeof user.password, 'string', 'password is required.');
      assert(emailValidator.test(user.emailAddress), 'Valid email is required.');
      assert(phoneValidator.test(user.phoneNumber), 'Valid phone number is required.');
      assert(postalCodeValidator.test(user.postalCode), 'Valid postal code is required.');
      assert(passwordValidator.test(user.password), 'Valid password is required.');
    } catch (ex){
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

      if (err) {
        const errorObject = {
          message: 'Error in database.',
          code: 500
        }
        next(errorObject)
      }
      if (rows) {
        res.status(200);
        res.send('User registered!');
      }
    })
  },

  loginUser: (req, res, next) => {
    logger.info('Post /api/loginUser called')

    const user = req.body

    const query = `SELECT Password, UserId FROM [DBUser] WHERE EmailAddress='${user.emailAddress}'`

    database.executeQuery(query, (err, rows) => {

      if (err) {
        const errorObject = {
          message: 'Error in database.',
          code: 500
        }
        next(errorObject)
      }
      if (rows) {

        if (rows.recordset.length === 0 || req.body.password !== rows.recordset[0].Password) {
          const errorObject = {
            message: 'Access denied: email does not exist or password is incorrect!',
            code: 401
          }
          next(errorObject)
        } else {
          logger.info('Password match, user logged id')
          logger.trace(rows.recordset)

          const payload = {
            UserId: rows.recordset[0].UserId
          }
          jwt.sign({ data: payload }, 'secretkey', { expiresIn: 60 * 60 }, (err, token) => {
            if (err) {
              const errorObject = {
                message: 'Could not generate JWT.',
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

  validateToken: (req, res, next) => {
    logger.info('validateToken aangeroepen')

    const authHeader = req.headers.authorization
    if (!authHeader) {
      errorObject = {
        message: 'Authorization header missing!',
        code: 401
      }
      logger.warn('Validate token failed: ', errorObject.message)
      return next(errorObject)
    }
    const token = authHeader.substring(7, authHeader.length)

    jwt.verify(token, 'secretkey', (err, payload) => {
      if (err) {
        errorObject = {
          message: 'not authorized',
          code: 401
        }
        logger.warn('Validate token failed: ', errorObject.message)
        next(errorObject)
      }
      logger.trace('payload', payload)
      if (payload.data && payload.data.UserId) {
        logger.debug('token is valid', payload)

        req.userId = payload.data.UserId
        next()
      } else {
        errorObject = {
          message: 'UserId is missing!',
          code: 401
        }
        logger.warn('Validate token failed: ', errorObject.message)
        next(errorObject)
      }
    })
  }
}