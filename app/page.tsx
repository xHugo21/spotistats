"use client";

import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../components/ui/button";
import { Artist } from "../components/Artist";
import { CustomAlert } from "../components/CustomAlert";
import { Track } from "../components/Track";
import { User } from "../components/User";

import { useState } from "react";
import useSpotifyAuth from "../hooks/useSpotifyAuth";
import useSpotifyData from "../hooks/useSpotifyData";

export default function Home() {
  const [timeInterval, setTimeInterval] = useState<string>("short_term");
  const [topType, setTopType] = useState<string>("tracks");

  const { accessToken, handleLogin } = useSpotifyAuth();
  const {
    userData,
    userTopTracks,
    userTopArtists,
    errorResponse,
    loadMoreItems,
  } = useSpotifyData(accessToken, topType, timeInterval);

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
          <div className="flex flex-col items-center gap-6">
            <Tabs defaultValue="tracks" onValueChange={setTopType}>
              <TabsList>
                <TabsTrigger value="tracks">Tracks</TabsTrigger>
                <TabsTrigger value="artists">Artists</TabsTrigger>
              </TabsList>
            </Tabs>

            <Tabs defaultValue="short_term" onValueChange={setTimeInterval}>
              <TabsList>
                <TabsTrigger value="short_term">4 Weeks</TabsTrigger>
                <TabsTrigger value="medium_term">6 Months</TabsTrigger>
                <TabsTrigger value="long_term">All Time</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}

        <h1 className="text-6xl font-bold mb-4 text-center">
          <span className="text-customprim">Hugo&apos;s</span> Spotify Stats
        </h1>

        <div className="flex flex-col gap-4 items-center">
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
            return (
              <Track
                key={track.id}
                track={track}
                index={index}
                isExplicit={track.explicit ? true : false}
              />
            );
          })}
        {userTopArtists &&
          userTopArtists.items.map((artist: any, index: number) => {
            return <Artist key={artist.id} artist={artist} index={index} />;
          })}
      </div>
      {(userTopTracks || userTopArtists) && (
        <Button className="w-32 mt-16" onClick={loadMoreItems}>
          Load More
        </Button>
      )}
    </main>
  );
}
