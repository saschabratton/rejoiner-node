const { withClient } = require('../helpers')

const customerEndpoint = (client) => {
  const endpoint = 'customer'

  const { dispatchReturnData, postEmail } = withClient(client)

  return {
    path: endpoint,
    convert: data => dispatchReturnData('post')(`${endpoint}/convert/`, data),
    cancel: email => postEmail(`${endpoint}/cancel/`, email),
    unsubscribe: email => postEmail(`${endpoint}/unsubscribe/`, email),
    optIn: email => postEmail(`${endpoint}/opt_in/`, email),
  }
}

module.exports = customerEndpoint
