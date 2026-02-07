const { analyzeUrlService } = require('../services/screenshot-analyzer/analyzeService');
const reportService = require('../services/forensic-report/reportService');

exports.analyzeUrl = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const result = await analyzeUrlService(url);

    res.json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Analysis failed' });
  }
};

exports.generateReport = async (req, res) => {
  try {
    const { stage1, stage2, stage3 } = req.body;

    if (!stage3 || stage3.verdict?.riskLevel !== 'CRITICAL') {
      return res.status(400).json({ error: 'Report generation requires CRITICAL risk level from Stage 3' });
    }

    const caseId = `CASE-${Date.now()}`;
    const narrative = await reportService.generateNarrative({ stage1, stage2, stage3 });
    const fileName = await reportService.generatePDF({ stage1, stage2, stage3 }, narrative, caseId);

    res.json({
      success: true,
      caseId,
      fileName,
      downloadUrl: `/reports/${fileName}`
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Report generation failed' });
  }
};
