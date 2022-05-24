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
    get: (email) => dispatchReturnData('get')(`customers/${email}/`),
    update: (data) => putEmail(`customers/${data.email}/`, data),
  }
}

module.exports = customerEndpoint
