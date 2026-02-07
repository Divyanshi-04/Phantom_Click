async function extractForms(page) {
  return await page.$$eval('form', forms =>
    forms.map(form => ({
      action: form.action,
      method: form.method,
      fields: Array.from(form.elements).map(el => ({
        name: el.name,
        type: el.type,
        placeholder: el.placeholder
      }))
    }))
  );
}

module.exports = { extractForms };
