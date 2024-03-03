import Image from "next/image";

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
    <div className="flex items-center gap-4">
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
            <p className="text-customacc font-bold">{artist.popularity}</p>
          </div>
        </div>
        <p className="text-sm">
          {parseFollowers(artist.followers.total)} followers
        </p>
      </div>
    </div>
  );
}
