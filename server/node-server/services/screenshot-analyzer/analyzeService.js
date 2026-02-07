const { runAirlock } = require('./playwrightRunner');
const { saveScreenshot } = require('../../utils/saveScreenshot');
const { buildReport } = require('./reportBuilder');
const { getAIExplanation } = require('../pythonClient');
const { getAnnotatedScreenshot } = require('./annotationClient');

async function analyzeUrlService(url) {

  const evidence = await runAirlock(url);
  const processedPages = [];
  
  for (let i = 0; i < (evidence.pages || []).length; i++) {
    const page = evidence.pages[i];

    const screenshotPath = saveScreenshot(page.screenshot, `page-${i}`);

    delete page.screenshot;

    
    let annotatedPath = null;
        
    try {
      annotatedPath = await getAnnotatedScreenshot(
      page.boxes,
      screenshotPath
    );

    } catch (err) {
      console.log(`⚠️ Annotation failed for page ${i}`);
    }
    
    processedPages.push({
      ...page,
      screenshot: screenshotPath,
      annotated: annotatedPath
    });
  }


  const report = buildReport({
    ...evidence,
    pages: processedPages
  });


  let aiExplanation = null;

  try {
    //aiExplanation = await getAIExplanation(report);
  } catch {
    console.log('⚠️ Python AI unavailable');
  }

  
  return {
    success: true,
    ...report,
    pages: processedPages,
    aiExplanation
  };
}

module.exports = { analyzeUrlService };
