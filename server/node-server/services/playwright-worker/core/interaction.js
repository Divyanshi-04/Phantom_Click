const { generateFakeValue } = require('./fakeData');

async function runInteraction(page, collector) {
  const exfiltrationEvents = [];
  const filledFields = {};

  const capture = req => {
    const method = req.method();

    if (!['POST', 'PUT', 'PATCH'].includes(method)) return;

    try {
      const urlObj = new URL(req.url());
      const body = req.postData() || '';

      const pageOrigin = new URL(page.url()).origin;

      const event = {
        host: urlObj.hostname,
        url: req.url(),
        method,
        body, // 🔥 actual stolen payload
        fields: Object.keys(filledFields),
        crossOrigin: urlObj.origin !== pageOrigin,
        timestamp: Date.now()
      };

      exfiltrationEvents.push(event);

      collector.add('exfiltration', event);

    } catch {}
  };

  page.on('request', capture);

  const forms = await page.$$('form');

  for (const form of forms) {
    const inputs = await form.$$('input, textarea, select');

    for (const input of inputs) {
      const name = (await input.getAttribute('name')) || '';
      const type = (await input.getAttribute('type')) || '';

      if (['hidden', 'submit', 'button', 'file'].includes(type)) continue;

      const fakeValue = generateFakeValue({ name });

      try {
        await input.fill(fakeValue);

        // track what we injected
        filledFields[name] = fakeValue;

        collector.add('form_filled', {
          field: name,
          value: fakeValue
        });
      } catch {}
    }

    try {
      collector.add('form_submitted');

      const submitBtn = await form.$(
        'button[type=submit], input[type=submit]'
      );

      if (submitBtn) {
        await submitBtn.click({ force: true });
      } else {
        await form.evaluate(f => f.submit());
      }

      // wait for network activity to finish
      await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(1500);

    } catch {}
  }

  page.off('request', capture);

  return exfiltrationEvents;
}

module.exports = { runInteraction };
