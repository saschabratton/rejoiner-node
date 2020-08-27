const { withClient } = require('../helpers')

const segmentsEndpoint = (client) => {
  const endpoint = 'segments'

  const { dispatchReturnData } = withClient(client)

  return {
    path: endpoint,
    customers: segmentId => ({
      get: () => dispatchReturnData('get')(`${endpoint}/${segmentId}/customers/`),
    }),
  }
}

module.exports = segmentsEndpoint
