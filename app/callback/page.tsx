"use client";
import { useSearchParams } from "next/navigation";
import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } from "../../lib/config";
import axios from "axios";

const Callback = () => {
  const searchParams = useSearchParams();

  const code = searchParams.get("code");

  const exchangeCodeForToken = async () => {
    const tokenEndpoint = "https://accounts.spotify.com/api/token";
    const clientId = SPOTIFY_CLIENT_ID;
    const redirectUri = SPOTIFY_REDIRECT_URI;
    const grantType = "authorization_code";
    const codeVerifier = localStorage.getItem("codeVerifier");

    try {
      const response = await axios.post(tokenEndpoint, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        params: {
          client_id: clientId,
          redirect_uri: redirectUri,
          code,
          grant_type: grantType,
          code_verifier: codeVerifier,
        },
      });

      console.log("Access Token:", response.data.access_token);
    } catch (error) {
      console.error("Error exchanging code for token:", error);
    }
  };

  if (code) {
    exchangeCodeForToken();
  }

  return <div>Callback Page</div>;
};

export default Callback;
