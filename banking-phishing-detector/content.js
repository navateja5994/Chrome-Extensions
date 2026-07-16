chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scan') {
    const url = window.location.href.toLowerCase();
    const bodyText = document.body.innerText.toLowerCase();
    const allText = bodyText + ' ' + document.title.toLowerCase();

    let riskScore = 0;
    let detectedTactics = [];
    let explanation = '';

    // Banking urgency
    if (allText.includes('urgent') || allText.includes('immediate action') || allText.includes('act now') || allText.includes('time sensitive') || allText.includes('critical alert')) {
      riskScore += 20;
      detectedTactics.push('Urgency');
    }

    // Fear of financial loss
    if (allText.includes('account suspended') || allText.includes('funds at risk') || allText.includes('financial loss') || allText.includes('money lost') || allText.includes('unauthorized transaction')) {
      riskScore += 25;
      detectedTactics.push('Fear of financial loss');
    }

    // Account suspension threats
    if (allText.includes('account will be suspended') || allText.includes('suspension') || allText.includes('locked') || allText.includes('blocked') || allText.includes('restricted access')) {
      riskScore += 20;
      detectedTactics.push('Account suspension threats');
    }

    // Authority impersonation
    if (allText.includes('bank security') || allText.includes('official notice') || allText.includes('from your bank') || allText.includes('security department')) {
      riskScore += 15;
      detectedTactics.push('Authority impersonation');
    }

    // Pressure to log in or verify
    if (allText.includes('log in now') || allText.includes('verify your account') || allText.includes('confirm identity') || allText.includes('update information') || allText.includes('credentials update')) {
      riskScore += 20;
      detectedTactics.push('Pressure to log in or verify');
    }

    // Cap at 100
    riskScore = Math.min(riskScore, 100);

    if (detectedTactics.length > 0) {
      explanation = `Detected tactics: ${detectedTactics.join(', ')}. These mimic urgent banking notifications designed to steal account credentials and security details.`;
    } else {
      explanation = 'No significant banking phishing patterns detected.';
    }

    const result = riskScore >= 50 ? 'Fake' : 'Good';

    sendResponse({ result: result, riskScore: riskScore, explanation: explanation });
  }
  return true;
});
