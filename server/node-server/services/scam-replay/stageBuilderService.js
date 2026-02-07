exports.buildStages = (report, aiPages) => {

  const stages = [];

  aiPages.forEach((ai, index) => {

    stages.push({
      id: index + 1,

      label: ai.attackStageName,
      subtitle: ai.stageGoal,

      screenshot: report.pages[index]?.screenshot || null,

      riskScore: ai.riskScore,

      stolenData: ai.sensitiveFields,

      attackerActions: ai.attackerActions,

      whatUserSees: ai.userViewExplanation,
      whatAttackerDoes: ai.attackerExplanation,

      caption: ai.educationalCaption
    });

  });

  // Hidden exfiltration stage (auto-added)
  stages.push({
    id: stages.length + 1,
    label: "Data Exfiltration",
    subtitle: "Invisible transfer",
    screenshot: null,
    attackerActions: ["Uploading stolen information to attacker server"],
    caption:
      "All captured information is silently transmitted to attacker infrastructure."
  });

  return stages;
};
