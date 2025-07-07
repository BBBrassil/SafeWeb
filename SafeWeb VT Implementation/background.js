const API_KEY = "API_KEY_HERE";

// Create context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "scan",
    title: "Scan this page with VirusTotal",
    contexts: ["page"]
  });
});

// Open scan.html with URL in query param
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "scan") {
    chrome.tabs.create({
      url: `scan.html?url=${encodeURIComponent(tab.url)}`
    });
  }
});

// Listen for scan requests from content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "scan_url") {
    (async () => {
      try {
        const submitResp = await fetch("https://www.virustotal.com/api/v3/urls", {
          method: "POST",
          headers: {
            "x-apikey": API_KEY,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: `url=${encodeURIComponent(message.url)}`
        });

        if (!submitResp.ok) throw new Error("Failed to submit URL");
        const submitData = await submitResp.json();
        const analysisId = submitData.data.id;

        let result;
        for (let i = 0; i < 10; i++) {
          const analysisResp = await fetch(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
            headers: { "x-apikey": API_KEY }
          });

          result = await analysisResp.json();
          if (result.data.attributes.status === "completed") break;
          await new Promise(res => setTimeout(res, 1500));
        }

        const stats = result.data.attributes.stats;
        sendResponse({ stats });
      } catch (err) {
        console.error("Scan error:", err);
        sendResponse({ error: true, message: err.message });
      }
    })();

    return true; // Keep sendResponse alive for async use
  }
});
