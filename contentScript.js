(() => {
  // const activeTab = getActiveTabURL();

  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, domain } = obj;
    if (domain === "youtube.com") {
      setTimeout(() => removeYTShortsElements(), 2000);
    }
    switch (domain) {
      case "youtube.com":
        setTimeout(() => removeYTShortsElements(), 2000);
        break;
      case "facebook.com":
        setTimeout(() => removeFBShorts(), 1);
    }
  });

  function removeYTShortsElements() {
    const shortsLink = document.querySelector('a#endpoint[title="Shorts"]');

    if (shortsLink) {
      shortsLink.style.display = "none";
    }

    const shortsContiner = document.querySelector("ytd-rich-section-renderer");
    if (shortsContiner) {
      shortsContiner.style.display = "none";
    }
  }

  function removeFBShorts() {
    const videoLink = document.querySelector('a[aria-label="Video"]');
    if (videoLink) {
      videoLink.parentElement.parentElement.parentElement.style.display =
        "none";
    }
    const gamesLink = document.querySelector('a[aria-label="Gaming"]');
    if (gamesLink) {
      gamesLink.parentElement.parentElement.parentElement.style.display =
        "none";
    }

    const storiesSection = document.querySelector('[aria-label="Stories"]');
    if (storiesSection) {
      storiesSection.style.display = "none";
    }

    const shortcutsSection = document.querySelector('[aria-label="Shortcuts"]');
    if (shortcutsSection) {
      shortcutsSection.style.display = "none";
    }
    const complementarySection = document.querySelector(
      '[role="complementary"]'
    );
    if (complementarySection) {
      complementarySection.style.display = "none";
    }
    //<div data-pagelet="FeedUnit_{n}">

    const h3 = Array.from(document.querySelectorAll("h3")).find(
      (el) => el.textContent.trim() === "Reels and short videos"
    );
    if (!h3) {
      return;
    }
    let parent = h3.parentElement;
    let shortsEl = null;
    while (parent) {
      if (
        parent.tagName === "DIV" &&
        parent.hasAttribute("data-pagelet") &&
        parent.getAttribute("data-pagelet").startsWith("FeedUnit_")
      ) {
        shortsEl = parent;
        break;
      }
      parent = parent.parentElement;
    }

    if (shortsEl) {
      shortsEl.style.display = "none";
    }
  }

  function findAndHideReelsAndShortsParentContainer(feedItemEl) {
    const h3 = Array.from(feedItemEl.querySelectorAll("h3")).find(
      (el) => el.textContent.trim() === "Reels and short videos"
    );
    if (h3) {
      feedItemEl.style.display = "none";
    }
  }

  function scanFacebookMutationsList(mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node && node.nodeType === 1) {
            if (
              node.hasAttribute &&
              node.hasAttribute("data-pagelet") &&
              node.getAttribute("data-pagelet").startsWith("FeedUnit_")
            ) {
              findAndHideReelsAndShortsParentContainer(node);
            }
          }
        });
      }
    }
  }

  function handleNewElements(mutationsList, observer) {
    let domain = window.location.hostname.replace(/^www\./, "");

    switch (domain) {
      case "facebook.com":
        scanFacebookMutationsList(mutationsList);
        break;
    }
  }

  const observer = new MutationObserver(handleNewElements);
  observer.observe(document.body, { childList: true, subtree: true });
})();

const getTime = (t) => {
  const hours = Math.floor(t / 3600);
  const minutes = Math.floor((t % 3600) / 60);
  const seconds = Math.floor(t % 60);

  const pad = (num) => num.toString().padStart(2, "0");

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};
