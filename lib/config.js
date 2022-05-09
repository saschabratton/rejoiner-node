const VERSION = require('../package.json').version

const { REJOINER_API_KEY, REJOINER_SITE_ID, REJOINER_WEBHOOK_SECRET } = process.env

const DEFAULT_BASE_URL = 'https://rj2.rejoiner.com/api/v1'
const REJOINER_BASE_URL = process.env.REJOINER_BASE_URL || DEFAULT_BASE_URL

module.exports = {
  VERSION,
  REJOINER_API_KEY,
  REJOINER_SITE_ID,
  REJOINER_WEBHOOK_SECRET,
  REJOINER_BASE_URL,
}
