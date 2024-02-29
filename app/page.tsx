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

import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } from "../lib/config";
import { generateRandomString, sha256, base64encode } from "../lib/pkce.js";

export default function Home() {
  const handleLogin = () => {
    const authEndpoint = "https://accounts.spotify.com/authorize";
    const clientId = SPOTIFY_CLIENT_ID;
    const redirectUri = SPOTIFY_REDIRECT_URI;
    const responseType = "code";
    const scope = "user-read-private user-read-email"; // Add additional scopes if needed

    const codeChallengeMethod = "S256"; // PKCE
    const codeVerifier = generateRandomString(32); // Generate a random string
    localStorage.setItem("codeVerifier", codeVerifier);
    const hashed = async () => await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);

    const queryParams = {
      client_id: clientId,
      response_type: responseType,
      redirect_uri: redirectUri,
      scope: scope,
      code_challenge_method: codeChallengeMethod,
      code_challenge: codeChallenge,
    };

    const queryString = new URLSearchParams(queryParams).toString();
    const authUrl = `${authEndpoint}?${queryString}`;

    window.location.href = authUrl;
  };

  let timeInterval = "4w";

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

      <Button onClick={handleLogin}>Login</Button>
    </main>
  );
}
