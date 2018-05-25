const pingEndpoint = (client) => {
  const endpoint = 'verify'

  return {
    name: endpoint,
    ping: () =>
      client.dispatch.post(`${endpoint}`)
        .then(res => res.data),
  }
}

module.exports = pingEndpoint
