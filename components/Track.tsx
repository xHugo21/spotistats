import { motion } from "framer-motion";
import Image from "next/image";

interface TrackProps {
  track: any;
  index: number;
}

export function Track(props: TrackProps) {
  const { track, index } = props;

  return (
    <motion.div
      className="flex items-center gap-4"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
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
      <div className="flex flex-col gap-2 min-w-[150px] md:min-w-[200px]">
        <p className="font-bold truncate">{track.name}</p>
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
    </motion.div>
  );
}
