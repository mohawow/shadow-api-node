const helmet = require('helmet');

const conpression = require ('compression');

module.exports = function(app) {
    app.use(helmet());
    app.use(conpression());
}