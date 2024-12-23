import { useState, useEffect } from "react";
import { getUserData, getTopItems } from "@/services/spotifyService";
import { ITEMS_PER_PAGE } from "@/lib/config";

const useSpotifyData = (
  accessToken: string | null,
  topType: string,
  timeInterval: string,
) => {
  const [userData, setUserData] = useState<any>(null);
  const [userTopTracks, setUserTopTracks] = useState<any>(null);
  const [userTopArtists, setUserTopArtists] = useState<any>(null);
  const [errorResponse, setErrorResponse] = useState<any>(null);

  useEffect(() => {
    if (!accessToken) return;

    const fetchData = async () => {
      try {
        const data = await getUserData(accessToken);
        setUserData(data);
      } catch (error) {
        setErrorResponse(error.error);
        localStorage.clear();
      }
    };

    const fetchTopItems = async () => {
      try {
        const data = await getTopItems(
          accessToken,
          topType,
          timeInterval,
          ITEMS_PER_PAGE,
        );
        if (topType === "tracks") {
          setUserTopTracks(data);
          setUserTopArtists(null);
        } else {
          setUserTopArtists(data);
          setUserTopTracks(null);
        }
      } catch (error) {
        setErrorResponse(error.error);
      }
    };

    fetchData();
    fetchTopItems();
  }, [accessToken, topType, timeInterval]);

  const loadMoreItems = async () => {
    try {
      const data = await getTopItems(
        accessToken!,
        topType,
        timeInterval,
        ITEMS_PER_PAGE,
        topType === "tracks"
          ? userTopTracks.items.length
          : userTopArtists.items.length,
      );
      if (topType === "tracks") {
        setUserTopTracks({
          items: userTopTracks.items.concat(data.items),
        });
      } else {
        setUserTopArtists({
          items: userTopArtists.items.concat(data.items),
        });
      }
    } catch (error) {
      setErrorResponse(error.error);
    }
  };

  return {
    userData,
    userTopTracks,
    userTopArtists,
    errorResponse,
    loadMoreItems,
  };
};

export default useSpotifyData;
