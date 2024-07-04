chrome.storage.sync.get("friends", (data) => {
    const friends = data.friends || [];
    const url = window.location.href;
  
    if (url.includes("codeforces.com/problemset/problem")) {
      // Codeforces Problem Page
      const solvedByFriends = friends.filter(friend => friend.site === 'codeforces' && hasSolvedProblem(friend.username));
      injectDropdown(solvedByFriends);
    } else if (url.includes("codeforces.com/contests")) {
      // Codeforces Dashboard
      showFriendsContestStats(friends.filter(friend => friend.site === 'codeforces'));
    } else if (url.includes("leetcode.com/problems")) {
      // Leetcode Problem Page
      const solvedByFriends = friends.filter(friend => friend.site === 'leetcode' && hasSolvedProblem(friend.username));
      injectDropdown(solvedByFriends);
    } else if (url.includes("leetcode.com/contest")) {
      // Leetcode Dashboard
      showFriendsContestStats(friends.filter(friend => friend.site === 'leetcode'));
    }
  });
  
  function hasSolvedProblem(username) {
    // Logic to determine if the user has solved the problem
    return true;  // Placeholder
  }
  
  function injectDropdown(friends) {
    const dropdown = document.createElement('div');
    dropdown.innerHTML = `<select>${friends.map(friend => `<option>${friend.username}</option>`)}</select>`;
    document.body.appendChild(dropdown);
  }
  
  function showFriendsContestStats(friends) {
    const stats = document.createElement('div');
    stats.innerHTML = `<ul>${friends.map(friend => `<li>${friend.username}: Rating change, Problems solved</li>`)}</ul>`;
    document.body.appendChild(stats);
  }
  