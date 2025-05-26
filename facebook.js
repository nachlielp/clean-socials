class Facebook {}

function hideReelsAndShortsParentContainer(feedItemEl) {
  const h3 = Array.from(feedItemEl.querySelectorAll("h3")).find(
    (el) => el.textContent.trim() === "Reels and short videos"
  );
  if (h3) {
    feedItemEl.style.display = "none";
  }
}

function hideFBSponsoredParentContainer(feedItemEl) {
  const span = Array.from(feedItemEl.querySelectorAll("span")).find(
    (el) => el.textContent.trim() === "Sponsored"
  );
  if (span) {
    feedItemEl.style.display = "none";
  }
}

function removeFBShorts() {
  const videoLink = document.querySelector('a[aria-label="Video"]');
  if (videoLink) {
    videoLink.parentElement.parentElement.parentElement.style.display = "none";
  }
  const gamesLink = document.querySelector('a[aria-label="Gaming"]');
  if (gamesLink) {
    gamesLink.parentElement.parentElement.parentElement.style.display = "none";
  }

  const storiesSection = document.querySelector('[aria-label="Stories"]');
  if (storiesSection) {
    storiesSection.style.display = "none";
  }

  const shortcutsSection = document.querySelector('[aria-label="Shortcuts"]');
  if (shortcutsSection) {
    shortcutsSection.style.display = "none";
  }
  const complementarySection = document.querySelector('[role="complementary"]');
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

export function scanFacebookMutationsList(mutationsList) {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
      mutation.addedNodes.forEach((node) => {
        if (node && node.nodeType === 1) {
          if (
            node.hasAttribute &&
            node.hasAttribute("data-pagelet") &&
            node.getAttribute("data-pagelet").startsWith("FeedUnit_")
          ) {
            hideReelsAndShortsParentContainer(node);
            hideFBSponsoredParentContainer(node);
          }
        }
      });
      removeFBShorts();
    }
  }
}
