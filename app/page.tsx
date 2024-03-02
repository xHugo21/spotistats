"use client";

import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } from "../lib/config";
import {
  generateRandomString,
  generateCodeChallenge,
  generateUrlWithSearchParams,
} from "../lib/pkce-utils.js";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [timeInterval, setTimeInterval] = useState<any>(null);
  const [topType, setTopType] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [userTopArtists, setUserTopArtists] = useState<any>(null);
  const [userTopTracks, setUserTopTracks] = useState<any>(null);

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      getUserData(localStorage.getItem("access_token"));
      setTimeInterval("short_term");
      setTopType("tracks");
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
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getTopItems = () => {
    fetch(
      `https://api.spotify.com/v1/me/top/${topType}?` +
        new URLSearchParams({
          time_range: timeInterval,
          limit: "20",
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
        if (topType === "tracks") {
          setUserTopArtists(null);
          setUserTopTracks(data);
        } else {
          setUserTopTracks(null);
          setUserTopArtists(data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  let access_token = localStorage.getItem("access_token");

  return (
    <main className="py-24 px-32 flex justify-center flex-col items-center">
      <h1 className="text-6xl font-bold mb-4">
        <span className="text-customprim">Hugo&apos;s</span> Spotify Stats
      </h1>

      <div className="flex w-full justify-between mt-8">
        <div className="flex flex-col gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Type</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Select One</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={topType}
                onValueChange={(value) => {
                  setTopType(value);
                  getTopItems();
                }}
              >
                <DropdownMenuRadioItem value="tracks">
                  Tracks
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="artists">
                  Artists
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Time Interval</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Select One</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={timeInterval}
                onValueChange={(value) => {
                  setTimeInterval(value);
                  getTopItems();
                }}
              >
                <DropdownMenuRadioItem value="short_term">
                  4 weeks
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="medium_term">
                  6 months
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="long_term">
                  All Time
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-64 gap-y-8 mt-8">
        {userTopTracks &&
          userTopTracks.items.map((track: any) => {
            return (
              <div key={track.id} className="flex items-center gap-4">
                <Image
                  className="aspect-square object-cover rounded-lg"
                  width="100"
                  height="100"
                  src={track.album.images[0].url}
                  alt={track.name}
                />
                <p className="font-bold">{track.name}</p>
              </div>
            );
          })}
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
                <p className="font-bold">{artist.name}</p>
              </div>
            );
          })}
      </div>
    </main>
  );
}
