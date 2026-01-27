const { parsePhoneNumberFromString } = require('libphonenumber-js')
const { withClient } = require('../helpers')

const preferenceTagsPath = 'customers/preference_tags/by_email/'
const preferenceTagsRemovePath = 'customers/preference_tags/remove/by_email/'

const getPhoneNumber = (value) => {
  const phoneNumber = parsePhoneNumberFromString(value)
  if (!phoneNumber) {
    throw new Error(`Invalid phone number: ${value}`)
  }
  return phoneNumber.number
}

const customerEndpoint = (client) => {
  const endpoint = 'customer'

  const { dispatchReturnData, postEmail, putEmail } = withClient(client)

  const get = (email, identifier = 'by_email') => {
    switch (client.apiVersion) {
      case 1:
        if (identifier !== 'by_email') {
          throw new Error('Identifier must be by_email for API v1')
        }
        return dispatchReturnData('get')(`customers/${email}/`)
      case 2:
        switch (identifier) {
          case 'by_email':
            return dispatchReturnData('get')('customers/by_email/', {
              params: { email: email.toLowerCase() },
            })
          case 'by_phone':
            return dispatchReturnData('get')('customers/by_phone/', {
              params: { phone: getPhoneNumber(email) },
            })
          default:
            throw new Error(`Invalid identifier: ${identifier}`)
        }
      default:
        throw new Error(`Invalid API version: ${client.apiVersion}`)
    }
  }

  return {
    path: endpoint,
    convert: (data, always) => {
      if (always) return dispatchReturnData('post')(`${endpoint}/always_convert/`, data)
      return dispatchReturnData('post')(`${endpoint}/convert/`, data)
    },
    cancel: (email) => postEmail(`${endpoint}/cancel/`, email),
    unsubscribe: (email) => postEmail(`${endpoint}/unsubscribe/`, email),
    optIn: (email) => postEmail(`${endpoint}/opt_in/`, email),
    get,
    getByEmail: (email) => get(email, 'by_email'),
    getByPhone: (phone) => get(phone, 'by_phone'),
    update: (data) => {
      switch (client.apiVersion) {
        case 1:
          if (!data.email) {
            throw new Error('Email is required for API v1')
          }
          return putEmail(`customers/${data.email}/`, data)
        case 2:
          return postEmail('customers/', data)
        default:
          throw new Error(`Invalid API version: ${client.apiVersion}`)
      }
    },
    tags: {
      get: async (email) => {
        if (client.apiVersion !== 2) {
          throw new Error('Tags endpoints require API v2')
        }

        const { id: customerId } = await client.customer.get(email)
        const path = `customers/${customerId}/tags/`

        return dispatchReturnData('get')(path)
      },
      set: async (email, tags, startJourney = true) => {
        if (client.apiVersion !== 2) {
          throw new Error('Tags endpoints require API v2')
        }

        const { id: customerId } = await client.customer.get(email)
        const path = `customers/${customerId}/tags/`

        const data = { tags }
        if (!startJourney) data.start_journey = false

        return dispatchReturnData('put')(path, data)
      },
      add: async (email, tags, startJourney = true) => {
        if (client.apiVersion !== 2) {
          throw new Error('Tags endpoints require API v2')
        }

        const { id: customerId } = await client.customer.get(email)
        const path = `customers/${customerId}/tags/`

        const data = { tags }
        if (!startJourney) data.start_journey = false

        return dispatchReturnData('patch')(path, data)
      },
      remove: async (email, tags, startJourney = true) => {
        if (client.apiVersion !== 2) {
          throw new Error('Tags endpoints require API v2')
        }

        const { id: customerId } = await client.customer.get(email)
        const path = `customers/${customerId}/tags/remove/`

        const data = { tags }
        if (!startJourney) data.start_journey = false

        return dispatchReturnData('patch')(path, data)
      },
    },
    preferenceTags: {
      get: (email) => {
        const params = { email }

        const config = { params }
        return dispatchReturnData('get')(preferenceTagsPath, config)
      },
      set: (email, tags) => {
        const params = { email }
        const data = { preference_tags: tags }

        const config = { params }
        return dispatchReturnData('put')(preferenceTagsPath, data, config)
      },
      add: (email, tags) => {
        const params = { email }
        const data = { preference_tags: tags }

        const config = { params }
        return dispatchReturnData('patch')(preferenceTagsPath, data, config)
      },
      remove: (email, tags) => {
        const params = { email }
        const data = { preference_tags: tags }

        const config = { params }
        return dispatchReturnData('patch')(preferenceTagsRemovePath, data, config)
      },
    },
  }
}

module.exports = customerEndpoint
