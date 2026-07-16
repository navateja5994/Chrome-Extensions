document.getElementById('scan').addEventListener('click', () => {
  const resultDiv = document.getElementById('result');
  resultDiv.style.display = 'none';
  
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || !tabs[0]) return;
    
    chrome.tabs.sendMessage(tabs[0].id, { action: 'scan' }, (response) => {
      if (chrome.runtime.lastError || !response) {
        resultDiv.style.display = 'flex';
        resultDiv.innerHTML = `
          <div class="status-badge danger">
            <span>Scan Failed</span>
            <span class="risk-val">ERROR</span>
          </div>
          <div class="details">
            <div class="details-desc">Could not connect to the page. Please ensure the page is fully loaded and you are not scanning system (chrome://) pages.</div>
          </div>
        `;
        return;
      }
      
      resultDiv.style.display = 'flex';
      
      const score = response.riskScore;
      let badgeClass = 'safe';
      let badgeText = 'Safe';
      
      if (score >= 50) {
        badgeClass = 'danger';
        badgeText = 'High Risk';
      } else if (score > 0) {
        badgeClass = 'warning';
        badgeText = 'Low Risk';
      }
      
      resultDiv.innerHTML = `
        <div class="status-badge ${badgeClass}">
          <span>${badgeText}</span>
          <span class="risk-val">${score}/100</span>
        </div>
        <div class="details">
          <div class="details-title">Analysis Summary</div>
          <div class="details-desc">${response.explanation}</div>
        </div>
      `;
    });
  });
});
