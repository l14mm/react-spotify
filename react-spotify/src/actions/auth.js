export const USER_DETAILS = "USER_DETAILS";
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

export function setAccessToken(payload) {
  return { type: SET_ACCESS_TOKEN, payload };
}
