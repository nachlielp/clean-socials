(() => {
  let observer = null;

  function cleanup() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  function initializeObserver() {
    observer = new MutationObserver(handleNewElements);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  chrome.runtime.onMessage.addListener((obj, sender) => {
    // const {} = obj;
    cleanup();
    initializeObserver();
  });

  async function handleNewElements(mutationsList, observer) {
    let domain = window.location.hostname.replace(/^www\./, "");
    const facebook = chrome.runtime.getURL("facebook.js");
    const facebookContentScript = await import(facebook);
    const youtube = chrome.runtime.getURL("youtube.js");
    const youtubeContentScript = await import(youtube);

    switch (domain) {
      case "facebook.com":
        facebookContentScript.scanFacebookMutationsList(mutationsList);
        break;
      case "youtube.com":
        youtubeContentScript.scanYoutubeMutationsList(mutationsList);
        break;
    }
  }
})();

const getTime = (t) => {
  const hours = Math.floor(t / 3600);
  const minutes = Math.floor((t % 3600) / 60);
  const seconds = Math.floor(t % 60);

  const pad = (num) => num.toString().padStart(2, "0");

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};
