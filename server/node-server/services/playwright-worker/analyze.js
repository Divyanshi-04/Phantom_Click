/*
  Usage:
  node analyze.js https://example.com
*/

const { runPassiveScan } = require('./core/passive');

async function main() {
  const url = process.argv[2];
  
  if (!url) {
    console.error('Usage: node analyze.js <url>');
    process.exit(1);
  }

  const result = await runPassiveScan(url);
  
  // VERY IMPORTANT:
  // Always print JSON only (Node server will parse this later)
  console.log(JSON.stringify(result));
}

main();
