import { SET_BREWERIES, SET_LAT_LONG, SET_OPEN_BREWERIES } from "./_actions";

const initialState = {
  breweries: [],
  openBreweries: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BREWERIES:
      return {
        ...state,
        breweries: action.list
      };
    case SET_OPEN_BREWERIES:
      return {
        ...state,
        openBreweries: action.list.sort(
          (a, b) => a.distance.value - b.distance.value
        )
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
