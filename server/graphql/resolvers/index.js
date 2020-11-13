const authResolver = require('./auth');
const eventsResolver = require('./events');
const bookingResolver = require('./booking');

const rootResolver = {
  ...authResolver,    //use spread to get all the fields, methods
  ...eventsResolver,
  ...bookingResolver
};

module.exports = rootResolver;