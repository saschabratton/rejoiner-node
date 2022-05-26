const { dateString, withClient } = require('../helpers')

const sessionsEndpoint = (client) => {
  const endpoint = 'sessions'

  const { dispatchReturnData } = withClient(client)

  return {
    path: endpoint,
    update: (sessionId, data = {}) => {
      const {
        paymentDate,
        fulfillmentDate,
        deliveryDate,
        metadata,
      } = data

      const payload = { metadata }

      if (paymentDate) payload.payment_date = dateString(paymentDate)
      if (fulfillmentDate) payload.fulfillment_date = dateString(fulfillmentDate)
      if (deliveryDate) payload.delivery_date = dateString(deliveryDate)

      return dispatchReturnData('put')(`${endpoint}/${sessionId}/`, payload)
    },
  }
}

module.exports = sessionsEndpoint
