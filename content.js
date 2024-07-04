chrome.storage.sync.get(["codeforcesFriends", "leetcodeFriends"], (data) => {
  const codeforcesFriends = data.codeforcesFriends || [];
  const leetcodeFriends = data.leetcodeFriends || [];
  const url = document.location.href;

  if (url.includes("codeforces.com/contest/")) {
    const contestId = url.match(/contest\/(\d+)/)[1];
    showFriendsContestStats(contestId, codeforcesFriends);
  }

  if (url.includes("leetcode.com/contest/")) {
    const contestId = url.match(/contest\/(\d+)/)[1];
    showFriendsContestStatsLeetcode(contestId, leetcodeFriends);
  }
});

let lastApiCallTime = 0;

function showFriendsContestStats(contestId, friends) {
  const currentTime = Date.now();
  const timeSinceLastCall = currentTime - lastApiCallTime;

  if (timeSinceLastCall >= 2000) {
    lastApiCallTime = currentTime;

    fetch(
      `https://codeforces.com/api/contest.ratingChanges?contestId=${contestId}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "OK") {
          const ratingChanges = data.result;
          const friendsRatingChanges = ratingChanges.filter((change) =>
            friends.some((friend) => friend.username === change.handle)
          );

          const stats = document.createElement("div");
          stats.innerHTML = `<h2>Friends' Rating Changes</h2><ul>${friendsRatingChanges
            .map(
              (change) =>
                `<li>${change.handle}: Rating change: ${change.oldRating} -> ${change.newRating}</li>`
            )
            .join("")}</ul>`;
          document.body.appendChild(stats);
        }
      })
      .catch((error) => console.error("Error fetching rating changes:", error));
  } else {
    setTimeout(
      () => showFriendsContestStats(contestId, friends),
      2000 - timeSinceLastCall
    );
  }
}

function showFriendsContestStatsLeetcode(contestId, friends) {
  // Implement the function to show friends' stats for Leetcode contests
  // Currently, Leetcode does not provide a public API for contest rating changes
}

