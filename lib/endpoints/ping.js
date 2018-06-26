const pingEndpoint = (client) => {
  const endpoint = 'verify'

  return {
    name: endpoint,
    ping: () =>
      client.dispatch.post('/ping/')
        .then(res => res.data),
  }
}

module.exports = pingEndpoint
