import axios from "axios";

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

export async function searchSpotifyTracks(
  trackName: string,
  accessToken: string
) {
  const searchParams = { q: trackName, type: "track", limit: 1 };

  const res = await axios.get("https://api.spotify.com/v1/search", {
    params: searchParams,
    headers: { Authorization: "Bearer " + accessToken },
  });
  const items: SpotifyApi.TrackSearchResponse = res.data;
  const track = items.tracks.items.map((track) => {
    return {
      trackId: track.id,
      track: track.name,
      artist: track.artists.map((artist) => {
        return {
          artist: artist.name,
          url: artist.external_urls.spotify,
          artistId: artist.id,
        };
      }),
      trackUrl: track.external_urls.spotify,
      album: { name: track.album.name, id: track.album.id },
    };
  });

  return track[0];
}
