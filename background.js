chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ friends: [] });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "addFriend") {
    chrome.storage.sync.get("friends", (data) => {
      const friends = data.friends || [];
      friends.push(message.friend);
      chrome.storage.sync.set({ friends: friends });
      sendResponse({ status: "Friend added", friends: friends });
    });
    return true; // Keep the message channel open for sendResponse
  }
});
