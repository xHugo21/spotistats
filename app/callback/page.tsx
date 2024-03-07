"use client";

import { useSearchParams } from "next/navigation";
import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } from "../../lib/config";
import { Suspense, useEffect } from "react";

const Callback = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  async function addThrowErrorToFetch(response: Response) {
    if (response.ok) {
      return response.json();
    } else {
      throw { response, error: await response.json() };
    }
  }

  useEffect(() => {
    const exchangeCodeForToken = async () => {
      const code_verifier = localStorage.getItem("code_verifier");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      if (code && code_verifier)
        fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: new URLSearchParams({
            client_id: SPOTIFY_CLIENT_ID,
            grant_type: "authorization_code",
            code,
            redirect_uri: SPOTIFY_REDIRECT_URI,
            code_verifier,
          }),
        })
          .then(addThrowErrorToFetch)
          .then((data) => {
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("refresh_token", data.refresh_token);
            localStorage.setItem("expires_at", data.expires_at);
            localStorage.removeItem("code_verifier");

            if (process.env.NODE_ENV === "production") {
              window.location.href = "/spotistats-clone";
            } else {
              window.location.href = "/";
            }
          });
    };

    if (code) {
      exchangeCodeForToken();
    } else {
      if (process.env.NODE_ENV === "production") {
        window.location.href = "/spotistats-clone";
      } else {
        window.location.href = "/";
      }
    }
  });

  return (
    <Suspense>
      <div>Callback Page</div>
    </Suspense>
  );
};

export default Callback;
