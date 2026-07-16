chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scan') {
    const url = window.location.href.toLowerCase();
    const bodyText = document.body.innerText.toLowerCase();
    const allText = bodyText + ' ' + document.title.toLowerCase();

    let riskScore = 0;
    let detectedTactics = [];
    let explanation = '';

    // Urgency
    if (allText.includes('urgent') || allText.includes('limited time') || allText.includes('act fast') || allText.includes('now or never')) {
      riskScore += 20;
      detectedTactics.push('Urgency');
    }

    // Airdrop pressure
    if (allText.includes('airdrop') || allText.includes('free tokens') || allText.includes('claim now') || allText.includes('exclusive offer')) {
      riskScore += 25;
      detectedTactics.push('Airdrop pressure');
    }

    // Wallet verification requests
    if (allText.includes('verify wallet') || allText.includes('connect wallet') || allText.includes('wallet update') || allText.includes('wallet security')) {
      riskScore += 20;
      detectedTactics.push('Wallet verification requests');
    }

    // Seed phrase prompts
    if (allText.includes('seed phrase') || allText.includes('recovery phrase') || allText.includes('backup phrase') || allText.includes('private keys')) {
      riskScore += 25;
      detectedTactics.push('Seed phrase prompts');
    }

    // Forced wallet interactions
    if (allText.includes('sign transaction') || allText.includes('approve transaction') || allText.includes('send funds') || allText.includes('transfer crypto')) {
      riskScore += 20;
      detectedTactics.push('Forced wallet interactions');
    }

    // Emotional manipulation
    if (allText.includes('miss out') || allText.includes('fomo') || allText.includes('opportunity of a lifetime') || allText.includes('don\'t miss')) {
      riskScore += 15;
      detectedTactics.push('Emotional manipulation');
    }

    // Cap at 100
    riskScore = Math.min(riskScore, 100);

    if (detectedTactics.length > 0) {
      explanation = `Detected tactics: ${detectedTactics.join(', ')}. These rush users into actions without verification, exploiting cognitive biases in crypto contexts.`;
    } else {
      explanation = 'No significant cognitive manipulation patterns detected.';
    }

    const result = riskScore >= 50 ? 'Fake' : 'Good';

    sendResponse({ result: result, riskScore: riskScore, explanation: explanation });
  }
  return true;
});
