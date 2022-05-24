const axios = require('axios')
const crypto = require('crypto')
const fs = require('graceful-fs')
const path = require('path')
const merge = require('lodash.merge')

const {
  VERSION,
  REJOINER_API_KEY,
  REJOINER_SITE_ID,
  REJOINER_WEBHOOK_SECRET,
  REJOINER_BASE_URL,
} = require('./config')

function Rejoiner2(options) {
  const opts = merge({}, options)

  this.siteId = opts.siteId || REJOINER_SITE_ID
  this.apiKey = opts.apiKey || REJOINER_API_KEY
  this.webhookSecret = opts.webhookSecret || REJOINER_WEBHOOK_SECRET
  this.baseURL = opts.baseURL || REJOINER_BASE_URL

  if (!this.siteId) throw new Error('Site ID must be configured')
  if (!this.apiKey) throw new Error('API Key must be configured')

  this.dispatch = axios.create({
    baseURL: `${this.baseURL}/${this.siteId}`,
    headers: {
      Authorization: `Rejoiner ${this.apiKey}`,
      'User-Agent': `rejoiner2-node/v${VERSION}`,
    },
  })

  fs.readdirSync(path.join(__dirname, 'endpoints'))
    .filter((file) => file.indexOf('.') !== 0)
    .forEach((file) => {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      const endpoint = require(path.join(__dirname, 'endpoints', file))(this)
      this[endpoint.path] = endpoint
    })

  this.verifyWebhook = (signatureHeader, payload) => {
    if (!this.webhookSecret) throw new Error('No webhook secret configured')

    const { timestamp, hmac } = signatureHeader.split(',')
      .reduce((signature, element) => {
        const [key, value] = element.trim().split('=')
        switch (key) {
          case 't':
            return { ...signature, timestamp: value }
          case 'sha1':
            return { ...signature, hmac: value }
          default:
            return signature
        }
      }, {})

    const signedPayload = `${timestamp}.${payload}`

    const digest = crypto.createHmac('sha1', this.webhookSecret)
      .update(signedPayload)
      .digest('hex')

    return digest === hmac
  }
}

module.exports = Rejoiner2
