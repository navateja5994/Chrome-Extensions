chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scan') {
    const url = window.location.href.toLowerCase();
    const bodyText = document.body.innerText.toLowerCase();
    const allText = bodyText + ' ' + document.title.toLowerCase();

    let riskScore = 0;
    let detectedTactics = [];
    let explanation = '';

    // Banking tactics
    if (allText.includes('urgent') || allText.includes('immediate action') || allText.includes('act now') || allText.includes('time sensitive')) {
      riskScore += 10;
      detectedTactics.push('Urgency');
    }
    if (allText.includes('account suspended') || allText.includes('funds at risk') || allText.includes('financial loss') || allText.includes('money lost')) {
      riskScore += 15;
      detectedTactics.push('Fear of financial loss');
    }
    if (allText.includes('account will be suspended') || allText.includes('suspension') || allText.includes('locked') || allText.includes('blocked')) {
      riskScore += 10;
      detectedTactics.push('Account suspension threats');
    }
    if (allText.includes('bank security') || allText.includes('official notice') || allText.includes('from your bank') || allText.includes('authorized')) {
      riskScore += 10;
      detectedTactics.push('Authority impersonation');
    }
    if (allText.includes('log in now') || allText.includes('verify your account') || allText.includes('confirm identity') || allText.includes('update information')) {
      riskScore += 10;
      detectedTactics.push('Pressure to log in or verify');
    }

    // Business tactics
    if (allText.includes('urgent payment') || allText.includes('immediate payment') || allText.includes('pay now') || allText.includes('overdue invoice')) {
      riskScore += 10;
      detectedTactics.push('Urgent payment demands');
    }
    if (allText.includes('invoice attached') || allText.includes('invoice due') || allText.includes('invoice payment') || allText.includes('fake invoice')) {
      riskScore += 15;
      detectedTactics.push('Fake invoice alerts');
    }
    if (allText.includes('corporate login') || allText.includes('business account') || allText.includes('company portal') || allText.includes('employee login')) {
      riskScore += 10;
      detectedTactics.push('Corporate login requests');
    }
    if (allText.includes('vendor update') || allText.includes('supplier verification') || allText.includes('partner login') || allText.includes('business partner')) {
      riskScore += 10;
      detectedTactics.push('Vendor or supplier scams');
    }
    if (allText.includes('email compromise') || allText.includes('account takeover') || allText.includes('business email') || allText.includes('executive alert')) {
      riskScore += 15;
      detectedTactics.push('Business email compromise');
    }
    if (allText.includes('update business info') || allText.includes('verify company details') || allText.includes('confirm partnership') || allText.includes('business verification')) {
      riskScore += 10;
      detectedTactics.push('Pressure to update business info');
    }

    // Education tactics
    if (allText.includes('enroll now') || allText.includes('limited seats') || allText.includes('deadline approaching') || allText.includes('last chance')) {
      riskScore += 10;
      detectedTactics.push('Urgent enrollment pressure');
    }
    if (allText.includes('scholarship awarded') || allText.includes('free tuition') || allText.includes('financial aid') || allText.includes('grant opportunity')) {
      riskScore += 15;
      detectedTactics.push('Fake scholarship offers');
    }
    if (allText.includes('cheat sheet') || allText.includes('exam answers') || allText.includes('guaranteed pass') || allText.includes('test prep')) {
      riskScore += 10;
      detectedTactics.push('Exam help scams');
    }
    if (allText.includes('student portal') || allText.includes('university login') || allText.includes('verify student id') || allText.includes('academic account')) {
      riskScore += 10;
      detectedTactics.push('Student account verification');
    }
    if (allText.includes('instant degree') || allText.includes('fake diploma') || allText.includes('certification offer') || allText.includes('online degree')) {
      riskScore += 15;
      detectedTactics.push('Diploma or certificate scams');
    }
    if (allText.includes('update transcript') || allText.includes('verify grades') || allText.includes('academic records') || allText.includes('student verification')) {
      riskScore += 10;
      detectedTactics.push('Pressure to update academic info');
    }

    // Crypto tactics
    if (allText.includes('limited time') || allText.includes('act fast') || allText.includes('now or never')) {
      riskScore += 10;
      detectedTactics.push('Urgency');
    }
    if (allText.includes('airdrop') || allText.includes('free tokens') || allText.includes('claim now') || allText.includes('exclusive offer')) {
      riskScore += 15;
      detectedTactics.push('Airdrop pressure');
    }
    if (allText.includes('verify wallet') || allText.includes('connect wallet') || allText.includes('wallet update') || allText.includes('wallet security')) {
      riskScore += 10;
      detectedTactics.push('Wallet verification requests');
    }
    if (allText.includes('seed phrase') || allText.includes('recovery phrase') || allText.includes('backup phrase') || allText.includes('private keys')) {
      riskScore += 15;
      detectedTactics.push('Seed phrase prompts');
    }
    if (allText.includes('sign transaction') || allText.includes('approve transaction') || allText.includes('send funds') || allText.includes('transfer crypto')) {
      riskScore += 10;
      detectedTactics.push('Forced wallet interactions');
    }
    if (allText.includes('miss out') || allText.includes('fomo') || allText.includes('opportunity of a lifetime') || allText.includes('don\'t miss')) {
      riskScore += 10;
      detectedTactics.push('Emotional manipulation');
    }

    // Cap at 100
    riskScore = Math.min(riskScore, 100);

    if (detectedTactics.length > 0) {
      explanation = `Detected tactics: ${detectedTactics.join(', ')}. This combined analysis checks for phishing indicators across banking, business, education, and crypto domains.`;
    } else {
      explanation = 'No significant phishing indicators detected across domains.';
    }

    const result = riskScore >= 50 ? 'Fake' : 'Good';

    sendResponse({ result: result, riskScore: riskScore, explanation: explanation });
  }
  return true;
});
