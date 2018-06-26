const pingEndpoint = (client) => {
  const endpoint = 'verify'

  return {
    name: endpoint,
    ping: () =>
      client.dispatch.post(`${endpoint}/ping`)
        .then(res => res.data),
  }
}

module.exports = pingEndpoint
