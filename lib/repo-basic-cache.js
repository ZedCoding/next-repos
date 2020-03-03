import LRU from "lru-cache";

const REPO_CACHE = new LRU({
  maxAge: 1000 * 60 * 10
});

export function setCache(repo) {
  const full_name = repo.full_name;
  REPO_CACHE.set(full_name, repo);
}

export function getCache(full_name) {
  return REPO_CACHE.get(full_name);
}

export function setCacheArray(repos) {
  if (repos && Array.isArray(repos)) {
    repos.forEach(repo => setCache(repo));
  }
}
