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
    document.querySelectorAll("span#title.style-scope.ytd-rich-shelf-renderer")
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

export function scanYoutubeMutationsList(mutationsList) {
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
