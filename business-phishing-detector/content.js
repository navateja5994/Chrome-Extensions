chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scan') {
    const url = window.location.href.toLowerCase();
    const bodyText = document.body.innerText.toLowerCase();
    const allText = bodyText + ' ' + document.title.toLowerCase();

    let riskScore = 0;
    let detectedTactics = [];
    let explanation = '';

    // Urgent payment demands
    if (allText.includes('urgent payment') || allText.includes('immediate payment') || allText.includes('pay now') || allText.includes('overdue invoice')) {
      riskScore += 20;
      detectedTactics.push('Urgent payment demands');
    }

    // Fake invoice alerts
    if (allText.includes('invoice attached') || allText.includes('invoice due') || allText.includes('invoice payment') || allText.includes('fake invoice')) {
      riskScore += 25;
      detectedTactics.push('Fake invoice alerts');
    }

    // Corporate login requests
    if (allText.includes('corporate login') || allText.includes('business account') || allText.includes('company portal') || allText.includes('employee login')) {
      riskScore += 20;
      detectedTactics.push('Corporate login requests');
    }

    // Vendor or supplier scams
    if (allText.includes('vendor update') || allText.includes('supplier verification') || allText.includes('partner login') || allText.includes('business partner')) {
      riskScore += 15;
      detectedTactics.push('Vendor or supplier scams');
    }

    // Business email compromise
    if (allText.includes('email compromise') || allText.includes('account takeover') || allText.includes('business email') || allText.includes('executive alert')) {
      riskScore += 25;
      detectedTactics.push('Business email compromise');
    }

    // Pressure to update business info
    if (allText.includes('update business info') || allText.includes('verify company details') || allText.includes('confirm partnership') || allText.includes('business verification')) {
      riskScore += 20;
      detectedTactics.push('Pressure to update business info');
    }

    // Cap at 100
    riskScore = Math.min(riskScore, 100);

    if (detectedTactics.length > 0) {
      explanation = `Detected tactics: ${detectedTactics.join(', ')}. These exploit trust in business communications and create urgency to bypass verification.`;
    } else {
      explanation = 'No significant business phishing indicators detected.';
    }

    const result = riskScore >= 50 ? 'Fake' : 'Good';

    sendResponse({ result: result, riskScore: riskScore, explanation: explanation });
  }
  return true;
});
