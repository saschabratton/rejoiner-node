const axios = require('axios')
const crypto = require('crypto')
const merge = require('lodash.merge')

const endpoints = require('./endpoints')

const {
  DEFAULT_API_VERSION,
  REJOINER_API_KEY,
  REJOINER_BASE_URL,
  REJOINER_SITE_ID,
  REJOINER_WEBHOOK_SECRET,
  VERSION,
} = require('./config')

function Rejoiner2(options) {
  const opts = merge({}, options)

  this.baseURL = opts.baseURL || REJOINER_BASE_URL
  this.apiVersion = opts.apiVersion || DEFAULT_API_VERSION

  this.siteId = opts.siteId || REJOINER_SITE_ID
  this.apiKey = opts.apiKey || REJOINER_API_KEY
  this.webhookSecret = opts.webhookSecret || REJOINER_WEBHOOK_SECRET

  if (!this.siteId) throw new Error('Site ID must be configured')
  if (!this.apiKey) throw new Error('API Key must be configured')

  this.dispatch = axios.create({
    baseURL: `${this.baseURL}/v${this.apiVersion}/${this.siteId}`,
    headers: {
      Authorization: `Rejoiner ${this.apiKey}`,
      'User-Agent': `rejoiner2-node/v${VERSION}`,
    },
  })

  Object.values(endpoints)
    .forEach((model) => {
      const endpoint = model(this)
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
