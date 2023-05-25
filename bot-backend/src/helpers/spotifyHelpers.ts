export function getTopTrackNames(topTracks: SpotifyApi.UsersTopTracksResponse) {
  const trackNames = topTracks.items.map((tracks) => {
    return { name: tracks.name, artist: tracks.artists.map((artist) => artist.name)[0] };
  });
  console.log(trackNames);
  return { items: trackNames };
}
