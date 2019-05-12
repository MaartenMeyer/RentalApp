require('dotenv').config();
const express = require('express');
const apartmentRoutes = require('./src/routes/apartment.routes');
//const authenticationRoutes = require('./src/routes/authentication.routes');
const logger = require('./src/config/config').logger

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Generic endpoint handler - voor alle routes
app.all('*', (req, res, next) => {
  // logger.info('Generieke afhandeling aangeroepen!')
  // ES16 deconstructuring
  const { method, url } = req
  logger.info(`${method} ${url}`)
  next();
})

app.use('/api/apartments', apartmentRoutes);
//app.use('/api', authenticationRoutes);

app.listen(port, () => logger.info(`App listening on port: ${port}!`))

module.exports = app;