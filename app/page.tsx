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

import { generateRandomString, sha256, base64encode } from "../lib/pkce";
import { getToken } from "../lib/auth";

export default function Home() {
  let timeInterval: string = "4w"; // TODO: manage on value change DropdownRadioGroup

  const codeVerifier = generateRandomString(64);
  const hashed = async () => await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  window.localStorage.setItem("code_verifier", codeVerifier);

  const clientId = "TODO";
  const redirectUri = "http://localhost:3000/";

  const scope = "user-read-private user-read-email";
  const authUrl = new URL("https://accounts.spotify.com/authorize");

  const authParams = {
    response_type: "code",
    client_id: clientId,
    scope,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  };

  const authorizationPopUp = () => {
    authUrl.search = new URLSearchParams(authParams).toString();
    window.location.href = authUrl.toString();
  };

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("code")) {
    const code = urlParams.get("code");
    const callbackParams = new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    });

    console.log(callbackParams);

    console.log(code);
    getToken(code, callbackParams);
  }

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

      <Button onClick={authorizationPopUp}>Login</Button>
    </main>
  );
}
