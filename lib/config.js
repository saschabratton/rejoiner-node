const VERSION = require('../package.json').version

const { REJOINER_API_KEY, REJOINER_SITE_ID, REJOINER_WEBHOOK_SECRET } = process.env

module.exports = {
  VERSION,
  REJOINER_API_KEY,
  REJOINER_SITE_ID,
  REJOINER_WEBHOOK_SECRET,
}
