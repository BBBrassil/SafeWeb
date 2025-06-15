chrome.contextMenus.onClicked.addListener(handleClick);

function handleClick(info: chrome.contextMenus.OnClickData){
    switch (info.menuItemId) {
        case "help":
            chrome.tabs.create({url: "help.html"});
            break;
        case "options":
            chrome.tabs.create({url: "options.html"});
            break;
        case "report":
            chrome.tabs.create({url: "report.html"});
            break;
        case "scan":
            chrome.tabs.create({url: "scan.html"});
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
        contexts: ["link"]
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