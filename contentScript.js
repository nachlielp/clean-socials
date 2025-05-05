(() => {
  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, value, videoId } = obj;

    if (type === "MAIN") {
      setTimeout(() => removeShortsElements(), 2000);
    }
  });

  function removeShortsElements() {
    console.log("removeShortsElements");
    //Test remove shorts button
    const shortsLink = document.querySelector('a#endpoint[title="Shorts"]');

    if (shortsLink) {
      console.log("Removing Shorts Btn");
      shortsLink.style.display = "none";
    }

    const shortsContiner = document.querySelector("ytd-rich-section-renderer");
    if (shortsContiner) {
      console.log("Removing Shorts Continer");
      shortsContiner.style.display = "none";
    }
  }

  function handleNewElements(mutationsList, observer) {
    // for (const mutation of mutationsList) {
    //   if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
    //     mutation.addedNodes.forEach((node) => {
    //       console.log("Node: ", node);
    //       // Example: Check if the node is a video or comment element
    //       if (node.nodeType === 1) {
    //         // Element node
    //         // Replace with your selector or logic
    //         if (node.matches && node.matches(".your-target-selector")) {
    //           // Handle the new element
    //           console.log("New element detected:", node);
    //           node.style.display = "none";
    //         }
    //       }
    //     });
    //   }
    // }
  }

  const observer = new MutationObserver(handleNewElements);
  observer.observe(document.body, { childList: true, subtree: true });

  document.querySelectorAll(".your-target-selector").forEach((node) => {
    console.log("New element detected, first run:", node);
    node.style.display = "none";
  });
})();

const getTime = (t) => {
  const hours = Math.floor(t / 3600);
  const minutes = Math.floor((t % 3600) / 60);
  const seconds = Math.floor(t % 60);

  const pad = (num) => num.toString().padStart(2, "0");

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};
