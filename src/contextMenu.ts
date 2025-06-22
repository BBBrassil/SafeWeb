chrome.contextMenus.onClicked.addListener(handleClick);

const formatUrl = (baseUrl: string, params?: Record<string, string> | undefined) => {
    const urlSearchParams = new URLSearchParams(params);
    return `${baseUrl}?${urlSearchParams.toString()}`;
}

const getActiveTab = async () => {
  const queryOptions = { active: true, lastFocusedWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function handleClick(info: chrome.contextMenus.OnClickData) {
    const activeTab = await getActiveTab();
    switch (info.menuItemId) {
        case "help":
            chrome.tabs.create({ url: "help.html" });
            break;
        case "options":
            chrome.tabs.create({ url: "options.html" });
            break;
        case "report":
            chrome.tabs.create({ url: formatUrl("report.html", { target: activeTab.url ?? "" }) });
            break;
        case "scan":
            chrome.tabs.create({ url: formatUrl("scan.html", { target: activeTab.url ?? "" }) });
            break;
    }
}

chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        id: "scan",
        title: "Scan",
        contexts: ["link"]
    });
    chrome.contextMenus.create({
        id: "report",
        title: "Report",
        contexts: ["all"]
    });

    chrome.contextMenus.create({
        id: "separator1",
        type: "separator",
        contexts: ["all"]
    });

    chrome.contextMenus.create({
        id: "options",
        title: "Options",
        contexts: ["all"],
    });

    chrome.contextMenus.create({
        id: "separator2",
        type: "separator",
        contexts: ["all"]
    });

    chrome.contextMenus.create({
        title: "Help",
        contexts: ["all"],
        id: "help"
    });
});