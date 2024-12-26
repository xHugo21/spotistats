"use client";

import useSpotifyCallback from "../../hooks/useSpotifyCallback";

const Callback = () => {
  useSpotifyCallback();

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <p className="font-bold text-2xl">Fetching user...</p>
    </div>
  );
};

export default Callback;
