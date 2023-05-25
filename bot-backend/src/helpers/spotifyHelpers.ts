export function getTopTrackNames(topTracks: SpotifyApi.UsersTopTracksResponse) {
  const trackNames = topTracks.items.map((tracks) => {
    return {
      name: tracks.name,
      trackUrl: tracks.external_urls.spotify,
      artist: tracks.artists.map((artist) => artist.name)[0],
    };
  });
  console.log(trackNames);
  return { items: trackNames };
}

export function getTopArtistsNames(
  topArtists: SpotifyApi.UsersTopArtistsResponse
) {
  const artistNames = topArtists.items.map((artist) => {
    return { artistName: artist.name, url: artist.external_urls.spotify };
  });
  console.log(artistNames);
  return { items: artistNames };
}
