const pingEndpoint = (client) => {
  const endpoint = 'verify'

  return {
    path: endpoint,
    ping: () => client.dispatch.get('/ping/')
      .then((res) => res.data),
  }
}

module.exports = pingEndpoint
