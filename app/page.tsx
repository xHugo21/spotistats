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
import {
  generateRandomString,
  generateCodeChallenge,
  generateUrlWithSearchParams,
} from "../lib/pkce-utils.js";

export default function Home() {
  const handleLogin = () => {
    const codeVerifier = generateRandomString(64);

    generateCodeChallenge(codeVerifier).then((code_challenge) => {
      window.localStorage.setItem("code_verifier", codeVerifier);

      window.location.href = generateUrlWithSearchParams(
        "https://accounts.spotify.com/authorize",
        {
          response_type: "code",
          client_id: SPOTIFY_CLIENT_ID,
          scope: "user-read-private user-read-email",
          code_challenge_method: "S256",
          code_challenge,
          redirect_uri: SPOTIFY_REDIRECT_URI,
        }
      );
    });
  };

  let timeInterval = "4w";
  let access_token = localStorage.getItem("access_token");

  return (
    <main className="p-24 flex justify-center flex-col items-center">
      <h1 className="text-4xl font-bold mb-4">Spotify Stats</h1>

      <div className="flex w-full justify-between">
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

        <div className="flex gap-4">
          <Button onClick={handleLogin}>Login</Button>
          {access_token && (
            <div className="bg-green-400 rounded-md p-2">Logged in</div>
          )}
        </div>
      </div>

      <div className="bg-slate-500 p-4 rounded-md">
        <span>Access Token: {access_token}</span>
      </div>
    </main>
  );
}
