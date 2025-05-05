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

  const url = tab?.url;
  console.log("Tab URL:", url);

  if (url && socialMediaDomains.some((domain) => url.includes(domain))) {
    console.log("Sending MAIN message to content script");
    chrome.tabs
      .sendMessage(tabId, {
        type: "MAIN",
      })
      .catch((err) => {
        console.log("Error sending message:", err);
      });
  }
});
