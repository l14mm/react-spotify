import {
  USER_DETAILS,
  SET_ACCESS_TOKEN,
  USER_PLAYLISTS,
  USER_PLAYLIST
} from "../actions/auth";

const initialState = {
  username: "",
  accessToken: ""
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case USER_DETAILS:
      return { ...state, userDetails: action.payload };
    case SET_ACCESS_TOKEN:
      return { ...state, accessToken: action.payload };
    case USER_PLAYLISTS:
      return { ...state, playlists: action.payload };
    case USER_PLAYLIST:
      return { ...state, playlist: action.payload };
    default:
      return state;
  }
}

export default rootReducer;
