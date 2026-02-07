const { getAIFlags } = require('../../pythonClient');

const COLOR_MAP = {
  financial: 'red',
  credential: 'orange',
  urgency: 'purple',
  branding: 'yellow',
  malware: 'black',
  general: 'blue'
};

async function collectAIBoundingBoxes(page, html) {
  const boxes = [];

  const ai = await getAIFlags(html);
  const flags = ai?.flags || [];

  console.error('AI flags:', flags);

  const viewport = page.viewportSize();
  const pageArea = viewport.width * viewport.height;

  const seen = new Set();

  /* ==============================
     Helpers
  ============================== */

  const addBox = (box, flag) => {
    const key = [
      Math.round(box.x),
      Math.round(box.y),
      Math.round(box.width),
      Math.round(box.height)
    ].join('-');

    if (seen.has(key)) return;
    seen.add(key);

    boxes.push({
      ...box,
      label: flag.text || '',
      reason: flag.reason || '',
      type: flag.type || 'general',
      color: COLOR_MAP[flag.type] || 'blue'
    });
  };

  const pushLocator = async (locator, flag) => {
    const count = await locator.count();

    for (let i = 0; i < count; i++) {
      const el = locator.nth(i);
      const box = await el.boundingBox();
      if (!box) continue;

      const area = box.width * box.height;
      if (area > pageArea * 0.6) continue;

      addBox(box, flag);
    }
  };

  /* ==============================
     Main
  ============================== */

  for (const flag of flags) {
    const phrase = (flag.text || '').trim();

    try {
      /* --------------------------------
         1️⃣ DIRECT SELECTOR (BEST)
      -------------------------------- */
      if (flag.selector_hint) {
        await pushLocator(page.locator(flag.selector_hint), flag);
        continue;
      }

      /* --------------------------------
         2️⃣ TAG HINT
      -------------------------------- */
      if (flag.tag_hint === 'input') {
        await pushLocator(page.locator('input, textarea, select'), flag);
        continue;
      }

      if (flag.tag_hint === 'form') {
        await pushLocator(page.locator('form'), flag);
        continue;
      }

      if (flag.tag_hint === 'button') {
        await pushLocator(page.getByRole('button', { name: phrase }), flag);
        continue;
      }

      if (flag.tag_hint === 'link') {
        await pushLocator(page.locator('a'), flag);
        continue;
      }

      if (flag.tag_hint === 'container') {
        await pushLocator(page.locator('section, div, header, main, article'), flag);
        continue;
      }

      /* --------------------------------
         3️⃣ TEXT MATCH (fallback only)
      -------------------------------- */
      if (phrase) {
        await pushLocator(
          page.getByText(phrase, { exact: false }),
          flag
        );
      }

    } catch (err) {
      console.error('Flag detection failed:', flag, err.message);
    }
  }

  return boxes;
}

module.exports = { collectAIBoundingBoxes };
