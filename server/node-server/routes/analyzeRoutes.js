const express = require('express');
const router = express.Router();

const { analyzeUrl, generateReport } = require('../controllers/analyzeController');

router.post('/', analyzeUrl);
router.post('/generate-report', generateReport);

module.exports = router;
