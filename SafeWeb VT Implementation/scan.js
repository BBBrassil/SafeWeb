const API_KEY = 'YOUR_API_HERE';

const params = new URLSearchParams(window.location.search);
const urlToScan = params.get('url');
const resultDiv = document.getElementById('result');

if (!urlToScan) {
  resultDiv.textContent = "No URL provided.";
} else {
  scanUrl(urlToScan);
}

async function scanUrl(url) {
  try {
    const submitResp = await fetch('https://www.virustotal.com/api/v3/urls', {
      method: 'POST',
      headers: {
        'x-apikey': API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `url=${encodeURIComponent(url)}`
    });

    if (!submitResp.ok) {
      throw new Error('Failed to submit URL to VirusTotal');
    }

    const submitData = await submitResp.json();
    const analysisId = submitData.data.id;

    let analysis;
    for (let i = 0; i < 10; i++) {
      const analysisResp = await fetch(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
        headers: { 'x-apikey': API_KEY }
      });
      if (!analysisResp.ok) throw new Error('Failed to get analysis from VirusTotal');
      analysis = await analysisResp.json();
      if (analysis.data.attributes.status === 'completed') break;
      await new Promise(res => setTimeout(res, 1500));
    }

    const stats = analysis.data.attributes.stats;
    const malicious = stats.malicious || 0;
    const harmless = stats.harmless || 0;
    const suspicious = stats.suspicious || 0;

    if (malicious > 0) {
      resultDiv.innerHTML = `<span class="danger">Warning: This site is flagged as malicious by ${malicious} engines.</span>`;
    } else if (suspicious > 0) {
      resultDiv.innerHTML = `<span class="danger">Caution: This site is flagged as suspicious by ${suspicious} engines.</span>`;
    } else {
      resultDiv.innerHTML = `<span class="safe">This site appears safe (${harmless} engines found it harmless).</span>`;
    }
  } catch (err) {
    resultDiv.textContent = "Error scanning the URL: " + err;
  }
}
