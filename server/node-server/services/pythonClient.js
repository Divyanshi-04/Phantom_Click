
const axios = require("axios");

const PYTHON_URL = process.env.PYTHON_URL || "http://localhost:8001";

/**
 * Get AI explanation for a security/report object
 */
async function getAIExplanation(report) {
  const res = await axios.post(
    `${PYTHON_URL}/explain-report`,
    report,
    { timeout: 20000 }
  );

  return res.data;
}

/**
 * Analyze raw HTML and return AI flags/issues
 */
async function getAIFlags(html) {
  const res = await axios.post(
    `${PYTHON_URL}/ai-page-analysis`,
    { html }
  );

  return res.data;
}

/**
 * Analyze multiple replay pages with AI
 */
async function analyzePagesWithAI(pages) {
  const { data } = await axios.post(
    `${PYTHON_URL}/ai/analyze-replay`,
    { pages }
  );

  return data; // AI results per page
}

module.exports = {
  getAIExplanation,
  getAIFlags,
  analyzePagesWithAI
};
