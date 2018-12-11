export const getBreweries = state => state.breweries;

export const getOpenBreweries = state => state.openBreweries;

export const getCurrentLocation = state => state.currentLocation;

export const getDirections = state => state.directions;

export const getBeers = state => state.beers;

export const getBeersFromNearestBrewery = state => {
  const { openBreweries, beers } = state;
  return (
    openBreweries.length &&
    beers.length &&
    beers.filter(el => el.brewery === openBreweries[0].name)
  );
};
