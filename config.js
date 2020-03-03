const GITHUB_OAUTH_URL = "https://github.com/login/oauth/authorize";
const SCOPE = "user";
const client_id = "f6671112d585815d5905";

module.exports = {
  github: {
    client_id,
    client_secret: "5b1e9d65e7ed54eec6d90ba14dd420422b6c170f",
    request_token_url: "https://github.com/login/oauth/access_token",
    GITHUB_OAUTH_URL,
    OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${client_id}&scope=${SCOPE}`
  }
};
