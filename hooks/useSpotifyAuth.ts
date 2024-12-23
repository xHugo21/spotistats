import { useEffect, useState } from "react";
import {
  generateRandomString,
  generateCodeChallenge,
  generateUrlWithSearchParams,
} from "@/lib/pkce-utils";
import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } from "@/lib/config";

const useSpotifyAuth = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setAccessToken(token);
  }, []);

  const handleLogin = () => {
    const codeVerifier = generateRandomString(64);

    generateCodeChallenge(codeVerifier).then((codeChallenge) => {
      localStorage.setItem("code_verifier", codeVerifier);

      window.location.href = generateUrlWithSearchParams(
        "https://accounts.spotify.com/authorize",
        {
          response_type: "code",
          client_id: SPOTIFY_CLIENT_ID,
          scope: "user-read-private user-read-email user-top-read",
          code_challenge_method: "S256",
          code_challenge: codeChallenge,
          redirect_uri: SPOTIFY_REDIRECT_URI,
        },
      );
    });
  };

  return { accessToken, handleLogin };
};

export default useSpotifyAuth;
