export const getUserData = async (accessToken: string) => {
  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw await response.json();
  }

  return await response.json();
};

export const getTopItems = async (
  accessToken: string,
  topType: string,
  timeRange: string,
  limit: number,
  offset = 0,
) => {
  const response = await fetch(
    `https://api.spotify.com/v1/me/top/${topType}?` +
      new URLSearchParams({
        time_range: timeRange,
        limit: limit.toString(),
        offset: offset.toString(),
      }),
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw await response.json();
  }

  return await response.json();
};
