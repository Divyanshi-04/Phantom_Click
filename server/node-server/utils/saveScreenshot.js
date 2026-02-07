const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/*
  Saves base64 screenshot to disk

  Why here (Node side)?
  ----------------------
  Docker container is ephemeral.
  If we saved inside container, file disappears.

  So:
  Worker → sends base64
  Node → saves permanently
*/

function saveScreenshot(base64, prefix = 'scan') {
  if (!base64) return null;

  const id = crypto.randomUUID();

  const filename = `${prefix}-${id}.png`;

  const filePath = path.join(
    __dirname,
    '../storage/screenshots',
    filename
  );

  const buffer = Buffer.from(base64, 'base64');

  fs.writeFileSync(filePath, buffer);

  // return relative path (frontend can use later)
  return `/screenshots/${filename}`;
}

module.exports = { saveScreenshot };
