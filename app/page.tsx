"use client";

import { motion } from "framer-motion";

import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Artist } from "../components/Artist";
import { CustomAlert } from "../components/CustomAlert";
import { Track } from "../components/Track";
import { User } from "../components/User";

import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } from "../lib/config";
import {
  generateRandomString,
  generateCodeChallenge,
  generateUrlWithSearchParams,
} from "../lib/pkce-utils.js";
import { useState, useEffect } from "react";
import { error } from "console";

export default function Home() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [timeInterval, setTimeInterval] = useState<any>(null);
  const [topType, setTopType] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [userTopArtists, setUserTopArtists] = useState<any>(null);
  const [userTopTracks, setUserTopTracks] = useState<any>(null);
  const [errorResponse, setErrorResponse] = useState<any>(null);

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
        setErrorResponse(error.error);
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
        setErrorResponse(error.error);
      });
  };

  useEffect(() => {
    function getTopItems() {
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
          setErrorResponse(error.error);
        });
    }

    setAccessToken(localStorage.getItem("access_token"));

    if (accessToken) {
      getUserData(accessToken);
    }

    if (accessToken && topType && timeInterval) {
      getTopItems();
    }
  }, [accessToken, topType, timeInterval]);

  return (
    <main
      className={`py-8 px-8 md:py-16 md:px-28 flex justify-center flex-col items-center ${
        !accessToken ? "h-screen" : ""
      }`}
    >
      {errorResponse && (
        <CustomAlert
          title={errorResponse.status}
          description={errorResponse.message}
        />
      )}
      <motion.div
        layout
        className={`flex flex-col gap-8 justify-around items-center w-full ${
          accessToken ? "md:flex-row" : ""
        }`}
      >
        {accessToken && (
          <div className="flex md:flex-col gap-4 items-center order-2 md:order-1">
            <Select onValueChange={setTopType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tracks">Tracks</SelectItem>
                <SelectItem value="artists">Artists</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={setTimeInterval}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Time Interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short_term">4 Weeks</SelectItem>
                <SelectItem value="medium_term">6 Months</SelectItem>
                <SelectItem value="long_term">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <h1 className="text-6xl font-bold mb-4 text-center order-1 md:order-2">
          <span className="text-customprim">Hugo&apos;s</span> Spotify Stats
        </h1>

        <div className="flex flex-col gap-4 items-center order-3">
          {!accessToken && (
            <Button className="w-32" onClick={handleLogin}>
              Login
            </Button>
          )}
          {accessToken && userData && <User userData={userData} />}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-32 gap-y-8 mt-16">
        {userTopTracks &&
          userTopTracks.items.map((track: any, index: number) => {
            return <Track key={track.id} track={track} index={index} />;
          })}
        {userTopArtists &&
          userTopArtists.items.map((artist: any, index: number) => {
            return <Artist key={artist.id} artist={artist} index={index} />;
          })}
      </div>
      {(userTopTracks || userTopArtists) && (
        <Button className="w-32 mt-16" onClick={getMoreItems}>
          Load More
        </Button>
      )}
    </main>
  );
}
