const { analyzePagesWithAI } = require("../pythonClient");
const stageBuilder = require("./stageBuilderService");

exports.buildReplay = async (report) => {

  // 1️⃣ AI analysis
  const aiPages = await analyzePagesWithAI(report.pages);

  // 2️⃣ Build stages
  const stages = stageBuilder.buildStages(report, aiPages);

  // 3️⃣ Build summary
  const summary = buildAttackSummary(stages, report);

  return {
    verdict: report.verdict,
    attackSummary: summary,
    stages
  };
};



function buildAttackSummary(stages, report) {
  return {
    attackType: humanizeType(report.verdict.type),
    totalStages: stages.length,
    estimatedAttackTimeSec: stages.length * 3,
    riskLevel: report.verdict.riskLevel,
    confidence: report.verdict.confidence,
    description:
      "This attack gradually collects credentials, bypasses OTP protection, and compromises the victim’s account without visible warning."
  };
}


function humanizeType(type) {
  if (type.includes("credential")) return "Credential Harvesting + OTP Relay";
  return "Phishing Attack";
}
