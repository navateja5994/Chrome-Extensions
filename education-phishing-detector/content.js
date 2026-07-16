chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scan') {
    const url = window.location.href.toLowerCase();
    const bodyText = document.body.innerText.toLowerCase();
    const allText = bodyText + ' ' + document.title.toLowerCase();

    let riskScore = 0;
    let detectedTactics = [];
    let explanation = '';

    // Urgent enrollment pressure
    if (allText.includes('enroll now') || allText.includes('limited seats') || allText.includes('deadline approaching') || allText.includes('last chance') || allText.includes('registration closing')) {
      riskScore += 20;
      detectedTactics.push('Urgent enrollment pressure');
    }

    // Fake scholarship offers
    if (allText.includes('scholarship awarded') || allText.includes('free tuition') || allText.includes('financial aid') || allText.includes('grant opportunity') || allText.includes('claim scholarship')) {
      riskScore += 25;
      detectedTactics.push('Fake scholarship offers');
    }

    // Exam help scams
    if (allText.includes('cheat sheet') || allText.includes('exam answers') || allText.includes('guaranteed pass') || allText.includes('test prep') || allText.includes('exam cheat')) {
      riskScore += 15;
      detectedTactics.push('Exam help scams');
    }

    // Student portal verification
    if (allText.includes('student portal') || allText.includes('university login') || allText.includes('verify student id') || allText.includes('academic account') || allText.includes('student verification')) {
      riskScore += 20;
      detectedTactics.push('Student portal login requests');
    }

    // Diploma or certificate scams
    if (allText.includes('instant degree') || allText.includes('fake diploma') || allText.includes('certification offer') || allText.includes('online degree') || allText.includes('buy degree')) {
      riskScore += 20;
      detectedTactics.push('Diploma or certificate scams');
    }

    // Pressure to update academic info
    if (allText.includes('update transcript') || allText.includes('verify grades') || allText.includes('academic records') || allText.includes('student verification')) {
      riskScore += 20;
      detectedTactics.push('Pressure to update academic info');
    }

    // Cap at 100
    riskScore = Math.min(riskScore, 100);

    if (detectedTactics.length > 0) {
      explanation = `Detected tactics: ${detectedTactics.join(', ')}. These exploit student desires for scholarships, grade improvements, or quick credentials to steal credentials or payments.`;
    } else {
      explanation = 'No significant education-related phishing indicators detected.';
    }

    const result = riskScore >= 50 ? 'Fake' : 'Good';

    sendResponse({ result: result, riskScore: riskScore, explanation: explanation });
  }
  return true;
});
