const { withClient } = require('../helpers')

const preferenceTagsPath = 'customers/preference_tags/by_email/'
const preferenceTagsRemovePath = 'customers/preference_tags/remove/by_email/'

const customerEndpoint = (client) => {
  const endpoint = 'customer'

  const { dispatchReturnData, postEmail, putEmail } = withClient(client)

  return {
    path: endpoint,
    convert: (data, always) => {
      if (always) return dispatchReturnData('post')(`${endpoint}/always_convert/`, data)
      return dispatchReturnData('post')(`${endpoint}/convert/`, data)
    },
    cancel: (email) => postEmail(`${endpoint}/cancel/`, email),
    unsubscribe: (email) => postEmail(`${endpoint}/unsubscribe/`, email),
    optIn: (email) => postEmail(`${endpoint}/opt_in/`, email),
    get: (email) => {
      switch (client.apiVersion) {
        case 1:
          return dispatchReturnData('get')(`customers/${email}/`)
        case 2:
          return dispatchReturnData('get')('customers/by_email/', {
            params: { email },
          })
        default:
          throw new Error(`Invalid API version: ${client.apiVersion}`)
      }
    },
    update: (data) => {
      switch (client.apiVersion) {
        case 1:
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
