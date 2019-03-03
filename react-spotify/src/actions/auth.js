export const USER_DETAILS = "USER_DETAILS";
export const USER_PLAYLISTS = "USER_PLAYLISTS";
export const USER_PLAYLIST = "USER_PLAYLIST";
export const SET_ACCESS_TOKEN = "SET_ACCESS_TOKEN";

export const userDetails = payload => async dispatch => {
  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${payload}`,
      Accept: "application/json"
    }
  });
  const data = await response.json();
  dispatch({ type: USER_DETAILS, payload: data });
};

export const loadPlaylists = payload => async dispatch => {
  const response = await fetch("https://api.spotify.com/v1/me/playlists", {
    headers: {
      Authorization: `Bearer ${payload}`,
      Accept: "application/json"
    }
  });
  const data = await response.json();
  dispatch({ type: USER_PLAYLISTS, payload: data.items });
};

export const loadPlaylist = (accessToken, playlistID) => async dispatch => {
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json"
      }
    }
  );
  const data = await response.json();
  dispatch({ type: USER_PLAYLIST, payload: data.items });
};

export function setAccessToken(payload) {
  return { type: SET_ACCESS_TOKEN, payload };
}
