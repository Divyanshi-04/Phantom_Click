function createEventCollector() {
  const events = [];

  function add(type, data = {}) {
    events.push({
      type,
      timestamp: Date.now(),
      ...data
    });
  }

  return {
    add,
    getEvents: () => events
  };
}

module.exports = { createEventCollector };
