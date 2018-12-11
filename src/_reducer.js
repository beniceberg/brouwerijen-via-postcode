import {
  SET_BREWERIES,
  SET_LAT_LONG,
  SET_OPEN_BREWERIES,
  SET_CURRENT,
  SET_DIRECTIONS,
  SET_BEERS
} from "./_actions";

const initialState = {
  breweries: [],
  beers: [],
  openBreweries: [],
  currentLocation: {},
  directions: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BREWERIES:
      return {
        ...state,
        breweries: action.list
      };
    case SET_BEERS:
      return {
        ...state,
        beers: action.list
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
    case SET_CURRENT:
      return {
        ...state,
        currentLocation: action.location
      };
    case SET_DIRECTIONS:
      return {
        ...state,
        directions: action.directions
      };
    default:
      return state;
  }
};

export default reducer;
