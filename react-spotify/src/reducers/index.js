import { USER_DETAILS, SET_ACCESS_TOKEN } from "../actions/auth";

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
    default:
      return state;
  }
}

export default rootReducer;
