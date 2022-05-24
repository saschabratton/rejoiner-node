const { withClient } = require('../helpers')

const path = 'journeys'

const journeysEndpoint = (client) => {
  const { dispatchReturnData } = withClient(client)

  const endpoint = (journeyId) => ({
    nodes: (nodeId) => ({
      webhook: (email) => {
        const requestPath = `${path}/${journeyId}/nodes/${nodeId}/webhook_event_wait/`

        if (typeof email === 'string') {
          return dispatchReturnData('post')(requestPath, {
            email: email.toLowerCase(),
            customer_data: {},
            session_data: {},
          })
        }

        if (typeof email === 'object' && typeof email.email === 'string') {
          return dispatchReturnData('post')(requestPath, {
            customer_data: {},
            session_data: {},
            ...email,
            email: email.email.toLowerCase(),
          })
        }

        return Promise.reject(new Error('Request is missing required email parameter.'))
      },
    }),
  })

  endpoint.path = path

  return endpoint
}

module.exports = journeysEndpoint
