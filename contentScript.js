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
    const { domain, url } = obj;

    // Clean up previous page's resources
    cleanup();

    // Initialize observer for the new page
    initializeObserver();
  });

  function removeYTShortsElements() {
    const shortsLinks = document.querySelectorAll('a#endpoint[title="Shorts"]');
    if (shortsLinks.length) {
      for (let shortsLink of shortsLinks) shortsLink.style.display = "none";
    }

    const shortsContiners = document.querySelectorAll(
      "ytd-rich-section-renderer, ytd-reel-shelf-renderer"
    );
    if (shortsContiners.length) {
      for (let shortsContiner of shortsContiners)
        shortsContiner.style.display = "none";
    }

    const shortsTitle = Array.from(
      document.querySelectorAll(
        "span#title.style-scope.ytd-rich-shelf-renderer"
      )
    ).find((el) => el.textContent.trim() === "Shorts");

    if (shortsTitle) {
      if (shortsTitle.style.display !== "none") {
        shortsTitle.style.display = "none";
        let parent = shortsTitle;
        while (parent && parent.tagName !== "ytd-rich-section-renderer") {
          parent = parent.parentElement;
        }
        if (parent) {
          parent.style.display = "none";
        }
      }
    }
  }

  function removeSalesElements() {
    const merchShelves = document.querySelectorAll("ytd-merch-shelf-renderer");
    if (merchShelves.length) {
      for (let merchShelf of merchShelves) {
        merchShelf.style.display = "none";
      }
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

  function scanYoutubeMutationsList(mutationsList) {
    const url = window.location.href;

    for (const mutation of mutationsList) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        removeYTShortsElements();
        if (url.startsWith("https://www.youtube.com/watch")) {
          removeSalesElements();
        }
      }
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
        removeFBShorts();
      }
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

  function handleNewElements(mutationsList, observer) {
    let domain = window.location.hostname.replace(/^www\./, "");

    switch (domain) {
      case "facebook.com":
        scanFacebookMutationsList(mutationsList);
        break;
      case "youtube.com":
        scanYoutubeMutationsList(mutationsList);
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
