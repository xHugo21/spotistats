export const BASE_PATH = "/spotistats";
export const ITEMS_PER_PAGE = 20;
export const SPOTIFY_CLIENT_ID = "_REMOVED";
export const SPOTIFY_REDIRECT_URI =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/spotistats/callback"
    : "https://xhugo21.github.io/spotistats/callback";
