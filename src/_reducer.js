import { SET_BREWERIES, SET_LAT_LONG } from "./_actions";

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
    case SET_LAT_LONG:
      return {
        ...state,
        breweries: state.breweries.map((brewery, index) =>
          Object.assign({}, brewery, { latLong: action.list[index] })
        )
      };
    default:
      return state;
  }
};

export default reducer;
