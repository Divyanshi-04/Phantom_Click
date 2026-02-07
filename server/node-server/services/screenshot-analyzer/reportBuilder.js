
function buildReport(evidence) {
  const report = {};

  const pages = evidence.pages || [];

  const stolenFields = new Set();

  for (const page of pages) {
    (page.forms || []).forEach(form => {
      form.fields.forEach(f => {
        const name = (f.name || '').toLowerCase();

        if (/user|email|login|id/.test(name)) stolenFields.add('Username');
        if (/pass/.test(name)) stolenFields.add('Password');
        if (/otp|code|verify/.test(name)) stolenFields.add('OTP');
        if (/card|cc/.test(name)) stolenFields.add('Card Number');
        if (/cvv/.test(name)) stolenFields.add('CVV');
        if (/exp|expiry/.test(name)) stolenFields.add('Expiry Date');
      });
    });
  }


  const exfilTargets = evidence.exfiltrationTargets || [];

  const exfiltrationServer =
    exfilTargets.length ? exfilTargets[0].host : null;


  const behaviors = [];

  if (stolenFields.size)
    behaviors.push('Sensitive information requested via forms');

  if (exfilTargets.length)
    behaviors.push('Data sent to remote server after submission');

  if (pages.length > 1)
    behaviors.push('Multi-stage flow detected (redirect chain / OTP step)');

  if (stolenFields.size >= 3)
    behaviors.push('Multiple high-risk fields collected');


  /* =========================
     4. Timeline
  ========================= */

  const timeline = (evidence.events || []).map(e => ({
    time: e.timestamp,
    action: e.type
  }));


  /* =========================
     5. Risk scoring logic
  ========================= */

  let score = 0;

  score += stolenFields.size * 15;
  score += exfilTargets.length * 25;
  score += pages.length * 5; // more steps → more suspicious

  if (behaviors.length >= 3) score += 20;

  score = Math.min(score, 100);

  let riskLevel = 'LOW';

  if (score > 80) riskLevel = 'CRITICAL';
  else if (score > 60) riskLevel = 'HIGH';
  else if (score > 30) riskLevel = 'MEDIUM';


  /* =========================
     6. Attack flow narrative (page-wise)
  ========================= */

  const attackFlow = [];

  pages.forEach((p, i) => {
    attackFlow.push(`Step ${i + 1}: User visits ${p.url}`);
  });

  if (stolenFields.size)
    attackFlow.push(`Page requests: ${[...stolenFields].join(', ')}`);

  if (exfilTargets.length)
    attackFlow.push(`Data exfiltrated to ${exfiltrationServer}`);


  /* =========================
     7. Human summary
  ========================= */

  const summary = exfilTargets.length
    ? `This site performs a multi-step credential harvesting attack and exfiltrates sensitive information.`
    : `This site requests sensitive information and shows phishing-like behavior.`;


  /* =========================
     8. Merge screenshots + boxes
  ========================= */

  const screenshots = pages.map(p => ({
    url: p.url,
    screenshot: p.screenshot,
    annotated: p.annotated
  }));


  report.verdict = {
    score,
    riskLevel,
    type: 'credential_harvesting',
    confidence: Math.min(0.6 + score / 100, 0.99)
  };

  report.summary = summary;

  report.attackFlow = attackFlow;

  report.evidence = {
    stolenDataTypes: [...stolenFields],
    exfiltrationServer,
    suspiciousBehaviors: behaviors,
    timeline,
    screenshots,
    pageCount: pages.length
  };

  return report;
}

module.exports = { buildReport };

