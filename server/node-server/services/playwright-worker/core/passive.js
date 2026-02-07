const { chromium } = require('playwright');
const { attachNetworkLogger } = require('./networkLogger');
const { extractForms } = require('./formExtractor');
const { runInteraction } = require('./interaction');
const { createEventCollector } = require('./eventCollector');
const { collectAIBoundingBoxes } = require('./aiBoxDetector');

async function runPassiveScan(url) {
  let browser, context, page;

  try {
    browser = await chromium.launch({
      headless: true,

      // 🔥 CRITICAL: disable Chrome blocking for phishing/malware test pages
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--no-sandbox',

        '--disable-features=SafeBrowsing,IsolateOrigins,site-per-process',
        '--ignore-certificate-errors',
        '--allow-running-insecure-content',
        '--disable-web-security'
      ]
    });

    context = await browser.newContext({
      viewport: { width: 1280, height: 720 },

      // 🔥 allow suspicious content for testing
      ignoreHTTPSErrors: true,
      acceptDownloads: true
    });

    page = await context.newPage();
    page.setDefaultTimeout(10000);

    const networkLog = attachNetworkLogger(page);
    const collector = createEventCollector();

    const start = Date.now();

    // extra safe navigation
    await page.goto(url, {
      waitUntil: 'domcontentloaded'
    });

    const pagesData = [];

    let step = 0;
    const MAX_STEPS = 6;

    while (step < MAX_STEPS) {
      step++;

      collector.add('page_loaded', { url: page.url() });

      const html = await page.content();
      const forms = await extractForms(page);

      const screenshotBuffer = await page.screenshot({
        fullPage: true,
        type: 'png'
      });

      const boxes = await collectAIBoundingBoxes(page, html);

      pagesData.push({
        url: page.url(),
        screenshot: screenshotBuffer.toString('base64'),
        html: html.substring(0, 5000),
        forms,
        boxes
      });

      if (!forms.length) break;

      await runInteraction(page, collector);

      await page.waitForLoadState('domcontentloaded').catch(() => {});
    }

    return {
      success: true,
      loadTime: Date.now() - start,
      pages: pagesData,
      networkLog,
      events: collector.getEvents()
    };

  } catch (err) {
    return {
      success: false,
      error: err.message
    };

  } finally {
    if (page) await page.close();
    if (context) await context.close();
    if (browser) await browser.close();
  }
}

module.exports = { runPassiveScan };
