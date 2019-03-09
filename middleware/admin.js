const config = require("config");

module.exports = function(req, res, next) {

  if (!config.get("requiresAuth")) return next();


 next();
};
