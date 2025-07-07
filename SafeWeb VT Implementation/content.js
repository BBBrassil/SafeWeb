// Ask background.js to scan using VirusTotal
const isVirusTotalSuspicious = async (url) => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "scan_url", url }, (response) => {
      if (chrome.runtime.lastError || !response || response.error) {
        console.warn("VT scan failed:", chrome.runtime.lastError || response.message);
        resolve(false); // Fail-safe: treat as safe if API fails
      } else {
        const stats = response.stats;
        resolve(stats.malicious > 0 || stats.suspicious > 0);
      }
    });
  });
};

// Create warning icon
const makeWarningIcon = () => {
  const icon = document.createElement("span");
  icon.innerText = "⚠️";
  icon.classList.add("safeweb-warningText");
  return icon;
};

// Scan and mark suspicious links
const scanLinks = async () => {
  const anchors = document.querySelectorAll("a");

  for (const anchor of anchors) {
    const href = anchor.getAttribute("href");
    if (!href || !href.startsWith("http")) continue;

    const isFlagged = await isVirusTotalSuspicious(href);

    if (isFlagged) {
      anchor.classList.add("safeweb-warning");
      anchor.parentNode?.insertBefore(makeWarningIcon(), anchor.nextSibling);
    }
  }
};

scanLinks();
