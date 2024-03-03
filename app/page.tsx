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
      getTopItems();
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
        localStorage.clear();
        console.error(error);
        window.location.href = "/";
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

  const getMoreItems = () => {
    fetch(
      `https://api.spotify.com/v1/me/top/${topType}?` +
        new URLSearchParams({
          time_range: timeInterval,
          limit: "20",
          offset:
            topType === "tracks"
              ? userTopTracks.items.length
              : userTopArtists.items.length,
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
          setUserTopTracks({
            items: userTopTracks.items.concat(data.items),
          });
        } else {
          setUserTopArtists({
            items: userTopArtists.items.concat(data.items),
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const parseFollowers = (followers: number): string => {
    if (followers >= 1000000) {
      return `${(followers / 1000000).toFixed(1)}M`;
    }
    if (followers >= 1000) {
      return `${(followers / 1000).toFixed(1)}K`;
    }
    return followers.toString();
  };

  let access_token = localStorage.getItem("access_token");

  return (
    <main className="py-8 px-16 md:py-16 md:px-28 flex justify-center flex-col items-center">
      <div className="flex flex-col gap-8 md:flex-row md:gap-32 justify-between mt-8">
        <div className="flex flex-col gap-4 items-center order-2 md:order-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="w-32">
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
            <DropdownMenuTrigger asChild className="w-32">
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

        <h1 className="text-6xl font-bold mb-4 text-center order-1 md:order-2">
          <span className="text-customprim">Hugo&apos;s</span> Spotify Stats
        </h1>

        <div className="flex flex-col gap-4 items-center order-3">
          {!access_token && (
            <Button className="w-32" onClick={handleLogin}>
              Login
            </Button>
          )}
          {access_token && userData && (
            <>
              <Button className="w-32" onClick={handleLogout}>
                Logout
              </Button>
              <div className="flex flex-col items-center gap-4">
                <Image
                  width="100"
                  height="100"
                  src={userData.images[0].url}
                  alt="User Profile"
                  className="rounded-lg"
                />
                <p className="text-lg font-bold">{userData.display_name}</p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-8 items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-32 gap-y-8 mt-8">
          {userTopTracks &&
            userTopTracks.items.map((track: any, index: number) => {
              return (
                <div key={track.id} className="flex items-center gap-4">
                  <p className="font-bold text-customprim">{index + 1}</p>
                  <a href={track.external_urls.spotify} target="_blank">
                    <Image
                      className="aspect-square object-cover rounded-lg"
                      width="100"
                      height="100"
                      src={track.album.images[0].url}
                      alt={track.name}
                    />
                  </a>
                  <div className="flex flex-col gap-2">
                    <p className="font-bold">{track.name}</p>
                    <div className="flex flex-wrap gap-1 w-40">
                      {track.artists.map((artist: any, artistIndex: number) => {
                        return (
                          <p key={artist.id} className="text-sm">
                            {artist.name}
                            {artistIndex !== track.artists.length - 1 && ","}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          {userTopArtists &&
            userTopArtists.items.map((artist: any, index: number) => {
              return (
                <div key={artist.id} className="flex items-center gap-4">
                  <p className="font-bold text-customprim">{index + 1}</p>
                  <a href={artist.external_urls.spotify} target="_blank">
                    <Image
                      className="aspect-square object-cover rounded-lg"
                      width="100"
                      height="100"
                      src={artist.images[0].url}
                      alt={artist.name}
                    />
                  </a>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <p className="font-bold">{artist.name}</p>
                      <div className="flex gap-1 items-center">
                        <Image
                          src="assets/bolt.svg"
                          alt="Bolt icon"
                          width="16"
                          height="16"
                        />
                        <p className="text-customacc font-bold">
                          {artist.popularity}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm">
                      {parseFollowers(artist.followers.total)} followers
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
        {(userTopTracks || userTopArtists) && (
          <Button className="w-32" onClick={getMoreItems}>
            Load More
          </Button>
        )}
      </div>
    </main>
  );
}
