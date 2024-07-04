document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("codeforces-friends").addEventListener("click", () => {
    showFriendsList("codeforces");
  });

  document.getElementById("leetcode-friends").addEventListener("click", () => {
    showFriendsList("leetcode");
  });

  function showFriendsList(site) {
    chrome.storage.sync.get(`${site}Friends`, (data) => {
      const friendsList = data[`${site}Friends`] || [];
      const friendsListContainer = document.getElementById("friends-list");
      friendsListContainer.innerHTML = "";
      friendsList.forEach((friend) => {
        const li = document.createElement("li");
        const span = document.createElement("span");
        span.textContent = friend.username;
        li.appendChild(span);
        
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.addEventListener("click", () => {
          removeFriend(friend.username, site);
          li.remove();
        });
        li.appendChild(removeButton);

        friendsListContainer.appendChild(li);
      });
    });
  }

  function removeFriend(username, site) {
    chrome.storage.sync.get([`${site}Friends`], (data) => {
      let friendsList = data[`${site}Friends`] || [];
      friendsList = friendsList.filter((friend) => friend.username !== username);
      chrome.storage.sync.set({ [`${site}Friends`]: friendsList }, () => {
        console.log(`Removed ${username} from ${site} friends`);
      });
    });
  }
});
