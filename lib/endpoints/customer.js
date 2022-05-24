const { withClient } = require('../helpers')

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
          return postEmail('/customers/', data)
        default:
          throw new Error(`Invalid API version: ${client.apiVersion}`)
      }
    },
  }
}

module.exports = customerEndpoint
