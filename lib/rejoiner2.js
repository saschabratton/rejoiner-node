const axios = require('axios')
const fs = require('graceful-fs')
const path = require('path')
const { merge } = require('lodash')

const {
  VERSION,
  REJOINER_API_KEY,
  REJOINER_SITE_ID,
} = require('./config')

function Rejoiner2(options) {
  const opts = merge({}, options)

  this.siteId = opts.siteId || REJOINER_SITE_ID
  this.apiKey = opts.apiKey || REJOINER_API_KEY

  if (!this.siteId) throw new Error('Site ID must be configured')
  if (!this.apiKey) throw new Error('API Key must be configured')

  this.dispatch = axios.create({
    baseURL: `https://rj2.rejoiner.com/api/v1/${this.siteId}`,
    headers: {
      Authorization: `Rejoiner ${this.apiKey}`,
      'User-Agent': `rejoiner2-node/v${VERSION}`,
    },
  })

  fs.readdirSync(path.join(__dirname, 'endpoints'))
    .filter(file => file.indexOf('.') !== 0)
    .forEach((file) => {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      const endpoint = require(path.join(__dirname, 'endpoints', file))(this)
      this[endpoint.name] = endpoint
    })
}

module.exports = Rejoiner2
