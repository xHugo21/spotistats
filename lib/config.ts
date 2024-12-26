export const BASE_PATH = "/spotistats";
export const ITEMS_PER_PAGE = 20;
export const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
export const SPOTIFY_REDIRECT_URI =
  process.env.NODE_ENV === "development"
    ? `http://localhost:3000${BASE_PATH}/callback`
    : `https://xhugo21.github.io${BASE_PATH}/callback`;
