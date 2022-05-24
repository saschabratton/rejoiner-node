const dateString = (date) => new Date(date).toISOString()

const withClient = (client) => {
  const dispatchReturnData = (method) => (...args) => client.dispatch[method](...args)
    .then((res) => res.data)

  const withEmail = (method, path, email) => {
    if (typeof email === 'string') {
      return dispatchReturnData(method)(path, { email: email.toLowerCase() })
    }

    if (typeof email === 'object' && typeof email.email === 'string') {
      return dispatchReturnData(method)(path, {

        ...email,
        email: email.email.toLowerCase(),
      })
    }

    return Promise.reject(new Error('Request is missing required email parameter.'))
  }

  const postEmail = (path, email) => withEmail('post', path, email)
  const putEmail = (path, email) => withEmail('put', path, email)

  return {
    dispatchReturnData,
    postEmail,
    putEmail,
  }
}

module.exports = { dateString, withClient }
