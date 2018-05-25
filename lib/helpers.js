const withClient = (client) => {
  const dispatchReturnData = method =>
    (...args) => client.dispatch[method](...args).then(res => res.data)

  const postEmail = (path, email) => {
    let data

    if (typeof email === 'string') {
      data = { email }
    } else {
      data = email
    }

    return dispatchReturnData('post')(path, data)
  }

  return {
    dispatchReturnData,
    postEmail,
  }
}

module.exports = { withClient }
