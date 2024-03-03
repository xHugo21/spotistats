export const SPOTIFY_CLIENT_ID = "_REMOVED";
export const SPOTIFY_REDIRECT_URI =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/callback"
    : "https://xhugo21.github.io/spotistats-clone/callback";
