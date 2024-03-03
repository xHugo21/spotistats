import Image from "next/image";

interface TrackProps {
  track: any;
  index: number;
}

export function Track(props: TrackProps) {
  const { track, index } = props;

  return (
    <div className="flex items-center gap-4">
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
}
