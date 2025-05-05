// chrome.tabs.onUpdated.addListener((tabId, tab) => {
//   //on open new tab - not on refresh
//   // view in  chrome://extensions/ -> service worker
//   if (tab.url && tab.url.includes("youtube.com/watch")) {
//     const queryParameters = tab.url.split("?")[1];
//     const urlParameters = new URLSearchParams(queryParameters);

//     chrome.tabs.sendMessage(tabId, {
//       type: "NEW",
//       videoId: urlParameters.get("v"), //get the unieq YT video identefier
//     });
//   }
// });

//To handle reloads where the tab is undefined, reach out and get it

const socialMediaDomains = [
  "youtube.com",
  "instagram.com",
  "facebook.com",
  "twitter.com",
  "linkedin.com",
  "tiktok.com",
  "pinterest.com",
  "reddit.com",
  "snapchat.com",
  "twitch.tv",
  "youtube.com",
];

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") return; // Wait for page to finish loading

  const processTab = (tabInfo) => {
    const url = tabInfo.url;

    if (url && socialMediaDomains.some((domain) => url.includes(domain))) {
      chrome.tabs.sendMessage(tabId, {
        type: "MAIN",
      });
    }

    if (tab && tab.url) {
      processTab(tab);
    } else {
      chrome.tabs.get(tabId, processTab);
    }
  };
});
