import { SET_BREWERIES } from "./actions";

const initialState = {
  breweries: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BREWERIES:
      return {
        ...state,
        breweries: action.list
      };
    default:
      return state;
  }
};

export default reducer;
