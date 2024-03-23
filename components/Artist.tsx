import { motion } from "framer-motion";
import Image from "next/image";

import { BASE_PATH } from "../lib/config";

interface ArtistProps {
  artist: any;
  index: number;
}

export function Artist(props: ArtistProps) {
  const { artist, index } = props;

  const parseFollowers = (followers: number): string => {
    if (followers >= 1000000) {
      return `${(followers / 1000000).toFixed(1)}M`;
    }
    if (followers >= 1000) {
      return `${(followers / 1000).toFixed(1)}K`;
    }
    return followers.toString();
  };

  return (
    <motion.div
      className="flex items-center gap-4"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 * (index % 20) }}
    >
      <p className="font-bold text-customprim">{index + 1}</p>
      <a href={artist.external_urls.spotify} target="_blank">
        <Image
          width="100"
          height="100"
          className="aspect-square object-cover rounded-lg min-w-[100px]"
          src={artist.images[0].url}
          alt={artist.name}
          unoptimized
        />
      </a>
      <div className="flex flex-col gap-2 min-w-[150px] md:min-w-[200px]">
        <div className="flex gap-2">
          <p className="font-bold truncate">{artist.name}</p>
          <div className="flex gap-1 items-center">
            <Image
              src={`${BASE_PATH}/assets/bolt.svg`}
              alt="Bolt icon"
              width="16"
              height="16"
              unoptimized
            />
            <p className="text-customacc font-bold">{artist.popularity}</p>
          </div>
        </div>
        <p className="text-sm">
          {parseFollowers(artist.followers.total)} followers
        </p>
      </div>
    </motion.div>
  );
}
