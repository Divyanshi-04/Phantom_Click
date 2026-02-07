function attachNetworkLogger(page) {
  const log = [];

  page.on('request', (req) => {
    log.push({
      type: 'request',
      url: req.url(),
      method: req.method(),
      resourceType: req.resourceType(),
      timestamp: Date.now()
    });
  });

  page.on('response', (res) => {
    log.push({
      type: 'response',
      url: res.url(),
      status: res.status(),
      timestamp: Date.now()
    });
  });

  return log;
}

module.exports = { attachNetworkLogger };
