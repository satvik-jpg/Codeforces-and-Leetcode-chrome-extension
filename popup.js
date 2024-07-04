document.addEventListener("DOMContentLoaded", () => {
  let selectedSite = "codeforces";

  document.querySelectorAll(".site-button").forEach((button) => {
    button.addEventListener("click", () => {
      selectedSite = button.id.split("-")[0];
      document
        .querySelectorAll(".site-button")
        .forEach((btn) => btn.classList.remove("highlight"));
      button.classList.add("highlight");
    });
  });

  document.getElementById("add-friend").addEventListener("click", () => {
    const name = document.getElementById("friend-name").value.trim();
    if (name) {
      chrome.storage.sync.get([`${selectedSite}Friends`], (data) => {
        const friendsList = data[`${selectedSite}Friends`] || [];

        if (friendsList.some((friend) => friend.username === name)) {
          alert(
            `User ${name} already added to the ${selectedSite} friend list`
          );
        } else {
          checkUserExists(name, selectedSite)
            .then((exists) => {
              if (exists) {
                addFriend(name, selectedSite);
              } else {
                alert(`User ${name} not found on ${selectedSite}`);
              }
            })
            .catch((error) => {
              console.error("Error checking user existence:", error);
              alert("Error checking user existence. Please try again.");
            });
        }
      });
    } else {
      alert("Please enter a username");
    }
  });

  document
    .getElementById("show-codeforces-friends")
    .addEventListener("click", () => {
      showFriendsList("codeforces");
    });

  document
    .getElementById("show-leetcode-friends")
    .addEventListener("click", () => {
      showFriendsList("leetcode");
    });

  document
    .getElementById("show-rating-changes")
    .addEventListener("click", () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          const url = tabs[0].url;
          const contestId = url.match(/contest\/(\d+)/)?.[1];
          const currentSite = url.includes("codeforces")
            ? "codeforces"
            : url.includes("leetcode")
            ? "leetcode"
            : null; // Adjust as needed for other sites

          if (contestId && currentSite) {
            fetchRatingChanges(contestId, currentSite, selectedSite);
          } else {
            alert(
              "Please navigate to a contest page on Codeforces or Leetcode"
            );
          }
        } else {
          alert("No active tab found");
        }
      });
    });

  // Function to display friends list
  function showFriendsList(site) {
    chrome.storage.sync.get([`${site}Friends`], (data) => {
      const friendsList = data[`${site}Friends`] || [];
      const friendsListContainer = document.getElementById("friends-list");
      friendsListContainer.innerHTML = "";
      friendsList.forEach((friend) => {
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.textContent = friend.username;
        link.href = getProfileUrl(friend.username, site);
        link.target = "_blank"; // Open link in new tab
        link.rel = "noopener noreferrer"; // Security best practice for opening new tabs
        li.appendChild(link);
        friendsListContainer.appendChild(li);
      });
    });
  }

  // Function to fetch and display rating changes for friends only
  function fetchRatingChanges(contestId, currentSite, selectedSite) {
    let apiUrl;
    if (currentSite === "codeforces") {
      apiUrl = `https://codeforces.com/api/contest.ratingChanges?contestId=${contestId}`;
    } else if (currentSite === "leetcode") {
      // Leetcode does not provide public API for contest rating changes, handle accordingly
      alert("Leetcode does not provide public API for contest rating changes.");
      return;
    }

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "OK") {
          const ratingChanges = data.result;
          chrome.storage.sync.get([`${selectedSite}Friends`], (data) => {
            const friendsList = data[`${selectedSite}Friends`] || [];
            const filteredChanges = ratingChanges.filter((change) =>
              friendsList.some((friend) => friend.username === change.handle)
            );
            displayRatingChanges(filteredChanges);
          });
        } else {
          console.error("Error fetching rating changes:", data.comment);
          alert("Error fetching rating changes. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error fetching rating changes:", error);
        alert("Error fetching rating changes. Please try again.");
      });
  }

  // Function to display rating changes
  function displayRatingChanges(changes) {
    const changesContainer = document.createElement("div");
    changesContainer.innerHTML = `<h2>Rating Changes</h2><ul>${changes
      .map(
        (change) =>
          `<li>${change.handle}: Rating change: ${change.oldRating} -> ${change.newRating}</li>`
      )
      .join("")}</ul>`;
    document.body.appendChild(changesContainer);
  }

  // Function to construct profile URL based on site
  function getProfileUrl(username, site) {
    if (site === "codeforces") {
      return `https://codeforces.com/profile/${username}`;
    } else if (site === "leetcode") {
      return `https://leetcode.com/${username}/`;
    }
    return "#"; // Default to "#" if site is not recognized
  }

  // Function to check if user exists on Codeforces or Leetcode
  function checkUserExists(username, site) {
    if (site === "codeforces") {
      return fetch(`https://codeforces.com/api/user.info?handles=${username}`)
        .then((response) => response.json())
        .then((data) => data.status === "OK")
        .catch(() => false);
    } else if (site === "leetcode") {
      return fetch(`https://leetcode.com/${username}/`)
        .then((response) => response.ok)
        .catch(() => false);
    }
    return Promise.resolve(false);
  }

  // Function to add friend to storage
  function addFriend(name, site) {
    chrome.storage.sync.get([`${site}Friends`], (data) => {
      let friendsList = data[`${site}Friends`] || [];
      friendsList.push({ username: name });

      const updatedData = { [`${site}Friends`]: friendsList };

      chrome.storage.sync.set(updatedData, () => {
        console.log(`Added ${name} to ${site} friends`);
      });
    });
  }
  document.getElementById("manage-friends").addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });
});
