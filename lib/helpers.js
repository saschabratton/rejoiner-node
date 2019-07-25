const withClient = (client) => {
  const dispatchReturnData = method => (...args) => client.dispatch[method](...args)
    .then(res => res.data)

  const postEmail = (path, email) => {
    if (typeof email === 'string') {
      return dispatchReturnData('post')(path, { email: email.toLowerCase() })
    }

    if (typeof email === 'object' && typeof email.email === 'string') {
      return dispatchReturnData('post')(path, Object.assign(
        {},
        email,
        { email: email.email.toLowerCase() },
      ))
    }

    return Promise.reject(new Error('Request is missing required email parameter.'))
  }

  return {
    dispatchReturnData,
    postEmail,
  }
}

module.exports = { withClient }
