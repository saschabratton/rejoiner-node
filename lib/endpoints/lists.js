const { withClient } = require('../helpers')

const listsEndpoint = (client) => {
  const endpoint = 'lists'

  const { dispatchReturnData, postEmail } = withClient(client)

  return {
    name: endpoint,
    get: () => dispatchReturnData('get')(endpoint),
    contacts: listId => ({
      get: () => dispatchReturnData('get')(`${endpoint}/${listId}/contacts/`),
      add: email => postEmail(`${endpoint}/${listId}/contacts/`, email),
      remove: email => postEmail(`${endpoint}/${listId}/contacts/remove/`, email),
    }),
  }
}

module.exports = listsEndpoint
