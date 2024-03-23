import { motion } from "framer-motion";
import Image from "next/image";

import { BASE_PATH } from "../lib/config";

interface TrackProps {
  track: any;
  index: number;
  isExplicit: boolean;
}

export function Track(props: TrackProps) {
  const { track, index, isExplicit } = props;

  return (
    <motion.div
      className="flex items-center gap-4 w-100"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 * (index % 20) }}
    >
      <p className="font-bold text-customprim">{index + 1}</p>
      <a href={track.external_urls.spotify} target="_blank">
        <Image
          className="aspect-square object-cover rounded-lg min-w-[100px]"
          width="100"
          height="100"
          src={track.album.images[0].url}
          alt={track.name}
          unoptimized
        />
      </a>
      <div className="flex flex-col gap-2 max-w-[120px] md:max-w-[200px]">
        <div className="flex gap-1 items-center">
          <p className="font-bold truncate">{track.name}</p>
          {isExplicit && (
            <Image
              src={`${BASE_PATH}/assets/explicit.png`}
              alt="Explicit Icon"
              width="16"
              height="16"
              unoptimized
            />
          )}
        </div>
        <div className="flex flex-wrap gap-1 truncate">
          {track.artists.map((artist: any, artistIndex: number) => {
            return (
              <a
                key={artist.id}
                href={artist.external_urls.spotify}
                target="_blank"
                className="cursor-pointer hover:underline"
              >
                <p className="text-sm">
                  {artist.name}
                  {artistIndex !== track.artists.length - 1 && ","}
                </p>
              </a>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
