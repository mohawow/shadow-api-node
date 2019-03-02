const winston = require("winston");
const express = require("express");
const config = require("config");
const app = express();
const morgan = require('morgan');

//app.use(morgan('combined'));

require("./startup/logging")();
require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();
require('./startup/prod')(app);

const port = process.env.PORT || config.get("port");
const server = app.listen(port, () => {
  console.log('Listening in on port something');
}
);

module.exports = server;
