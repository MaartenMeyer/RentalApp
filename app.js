const express = require('express');
const appartmentRoutes = require('./src/routes/appartment.routes');
const authenticationRoutes = require('./src/routes/authentication.routes');
const logger = require('./src/config/config').logger

const app = express();
const port = process.env.PORT || 3000

app.use(express.json())

app.listen(port, () => logger.info(`App listening on port: ${port}!`))

module.exports = app;