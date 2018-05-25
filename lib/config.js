const VERSION = require('../package.json').version

const { REJOINER_API_KEY, REJOINER_SITE_ID } = process.env

module.exports = {
  VERSION,
  REJOINER_API_KEY,
  REJOINER_SITE_ID,
}
