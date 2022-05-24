const { withClient } = require('../helpers')

const listsEndpoint = (client) => {
  const endpoint = 'lists'

  const { dispatchReturnData, postEmail } = withClient(client)

  return {
    path: endpoint,
    get: () => dispatchReturnData('get')(`${endpoint}/`),
    add: (name) => {
      if (typeof name === 'string') {
        return dispatchReturnData('post')(`${endpoint}/`, { name })
      }

      return dispatchReturnData('post')(`${endpoint}/`, name)
    },
    contacts: (listId) => ({
      get: (page) => {
        const pagination = page ? `?page=${page}` : ''
        return dispatchReturnData('get')(`${endpoint}/${listId}/contacts/${pagination}`)
      },
      add: (email) => postEmail(`${endpoint}/${listId}/contacts/`, email),
      remove: (email) => postEmail(`${endpoint}/${listId}/contacts/remove/`, email),
    }),
  }
}

module.exports = listsEndpoint
