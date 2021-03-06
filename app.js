require('dotenv').config();
const express = require('express');
const apartmentRoutes = require('./src/routes/apartment.routes');
const authenticationRoutes = require('./src/routes/authentication.routes');
const logger = require('./src/config/config').logger

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.all('*', (req, res, next) => {
  const { method, url } = req;
  next();
})

app.use('/api/apartments', apartmentRoutes);
app.use('/api', authenticationRoutes);

app.all('*', (req, res, next) => {
  const { method, url } = req;
  const errorMessage = `${method} ${url} does not exist.`;
  logger.warn(errorMessage)
  const errorObject = {
    message: errorMessage,
    code: 404,
    date: new Date()
  }
  next(errorObject)
})

app.use((error, req, res, next) => {
  logger.error('Error handler: ', error.message.toString())
  res.status(error.code).json(error)
})

app.listen(port, () => logger.info(`App listening on port: ${port}!`))

module.exports = app;