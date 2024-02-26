"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { generateRandomString, sha256, base64encode } from "../lib/auth";
import { useEffect } from "react";

export default function Home() {
  const clientId = "_REMOVED";
  const redirectUri = "http://localhost:3000/";

  const scope = "user-read-private user-read-email";
  const authUrl = new URL("https://accounts.spotify.com/authorize");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (!localStorage.getItem("code_verifier")) {
      const codeVerifier = generateRandomString(64);
      const hashed = async () => await sha256(codeVerifier);
      const codeChallenge = base64encode(hashed);

      window.localStorage.setItem("code_verifier", codeVerifier);

      const params = {
        response_type: "code",
        client_id: clientId,
        scope,
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
        redirect_uri: redirectUri,
      };

      authUrl.search = new URLSearchParams(params).toString();
      window.location.href = authUrl.toString();
    } else if (urlParams.get("code")) {
      const code = urlParams.get("code");

      getToken(code);
    } else if (urlParams.get("error")) {
      alert("Error when trying to log in using Spotify Authorization");
    }
  });
  let timeInterval: string = "4w"; // TODO: manage on value change DropdownRadioGroup

  const getToken = async (code: any) => {
    let codeVerifier = localStorage.getItem("code_verifier");

    const url = "https://accounts.spotify.com/api/token";

    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier ?? "",
      }),
    };

    const body = await fetch(url, payload);
    const response = await body.json();

    localStorage.setItem("access_token", response.access_token);
  };

  return (
    <main className="p-24">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Time Interval</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Select One</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={timeInterval}>
            <DropdownMenuRadioItem value="4w">4 weeks</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="6m">6 months</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="at">All Time</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button>Login</Button>
    </main>
  );
}
