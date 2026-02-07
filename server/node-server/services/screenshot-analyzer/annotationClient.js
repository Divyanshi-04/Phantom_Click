const axios = require('axios');
const path = require('path');
const fs = require('fs');

const PYTHON_URL = process.env.PYTHON_URL || "http://localhost:8001";

async function getAnnotatedScreenshot(flags, screenshotPath) {
  try {
    const filename = path.basename(screenshotPath);

    const absolutePath = path.resolve(
      __dirname,
      '../../storage/screenshots',
      filename
    );

    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Screenshot not found: ${absolutePath}`);
    }

    const res = await axios.post(
      `${PYTHON_URL}/annotate`,
      {
        flags,
        screenshot: absolutePath
      },
      { timeout: 20000 }
    );
     
    const annotatedPath = res.data.annotatedImage;
    return `${PYTHON_URL}${annotatedPath}`;

  } catch (err) {
    console.error('❌ annotate service failed:', err.message);
    throw err;
  }
}

module.exports = { getAnnotatedScreenshot };
