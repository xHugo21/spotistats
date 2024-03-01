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
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [userData, setUserData] = useState<any>(null);
  const [userTopArtists, setUserTopArtists] = useState<any>(null);

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      getUserData(localStorage.getItem("access_token"));
    }
  }, []);

  const handleLogin = () => {
    const codeVerifier = generateRandomString(64);

    generateCodeChallenge(codeVerifier).then((code_challenge) => {
      window.localStorage.setItem("code_verifier", codeVerifier);

      window.location.href = generateUrlWithSearchParams(
        "https://accounts.spotify.com/authorize",
        {
          response_type: "code",
          client_id: SPOTIFY_CLIENT_ID,
          scope: "user-read-private user-read-email user-top-read",
          code_challenge_method: "S256",
          code_challenge,
          redirect_uri: SPOTIFY_REDIRECT_URI,
        }
      );
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const getUserData = (access_token: string | null) => {
    fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    })
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw await response.json();
        }
      })
      .then((data) => {
        setUserData(data);
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getTopItems = () => {
    fetch(
      "https://api.spotify.com/v1/me/top/artists?" +
        new URLSearchParams({
          time_range: "medium_term",
          limit: "10",
          offset: "5",
        }),
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      }
    )
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw await response.json();
        }
      })
      .then((data) => {
        setUserTopArtists(data);
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
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

        <div className="flex flex-col gap-4">
          {!access_token && <Button onClick={handleLogin}>Login</Button>}
          {access_token && userData && (
            <>
              <Button onClick={handleLogout}>Logout</Button>
              <div className="flex flex-col items-center">
                <Image
                  width="100"
                  height="100"
                  src={userData.images[0].url}
                  alt="User Profile"
                />
                <p className="text-lg font-bold">{userData.display_name}</p>
                <p className="text-lg">{userData.id}</p>
              </div>
            </>
          )}
        </div>
      </div>

      <Button onClick={getTopItems}>Get Top Items</Button>

      <div className="flex flex-col gap-4 mt-8">
        <p className="text-lg font-bold">Top Artists</p>
        {userTopArtists &&
          userTopArtists.items.map((artist: any) => {
            return (
              <div key={artist.id} className="flex items-center gap-4">
                <Image
                  className="aspect-square object-cover rounded-lg"
                  width="100"
                  height="100"
                  src={artist.images[0].url}
                  alt={artist.name}
                />
                <p>{artist.name}</p>
              </div>
            );
          })}
      </div>
    </main>
  );
}
