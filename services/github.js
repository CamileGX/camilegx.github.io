export async function getGitHubSummary(username) {
  if (!username) return null;
  const [profile,repos,events] = await Promise.all([
    fetch(`https://api.github.com/users/${encodeURIComponent(username)}`).then(r=>r.ok?r.json():null),
    fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=4`).then(r=>r.ok?r.json():[]),
    fetch(`https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=4`).then(r=>r.ok?r.json():[])
  ]);
  return { profile, repos, events };
}
