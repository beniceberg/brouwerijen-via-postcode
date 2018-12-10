import { getBreweries } from "./_selectors";

const googleMapsKey = process.env.GOOGLE_MAPS_API_KEY;

export const SET_BREWERIES = "SET_BREWERIES";
export const SET_LAT_LONG = "SET_LAT_LONG";

const setBreweries = list => ({
  type: SET_BREWERIES,
  list
});

const setLatLongList = list => ({
  type: SET_LAT_LONG,
  list
});

// fetching breweries from given api
export const fetchBreweries = () => (dispatch, getState) => {
  // using a heroku proxyurl to work around client cors issues
  const proxyUrl = `https://cors-anywhere.herokuapp.com/`;
  const url = `https://download.oberon.nl/opdracht/brouwerijen.js`;
  fetch(proxyUrl + url)
    .then(resp => resp.json())
    .then(json => dispatch(setBreweries(json.breweries)))
    .catch(error => {
      console.log(error);
    });
};

// fetch latitude and longitude for each brewery
const fetchBreweryLatLong = addressString => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${addressString}&key=${googleMapsKey}`;
  return fetch(url)
    .then(res => res.json())
    .then(response => {
      const { lat, lng } = response.results[0].geometry.location;
      return { lat, lng };
    })
    .catch(err => {
      console.log("err: ", err);
    });
};

export const getLatAndLongs = () => (dispatch, getState) => {
  const breweries = getBreweries(getState());
  const latLong = breweries.map(brewery => {
    const addressString = `${brewery.address
      .split(" ")
      .join("+")},+${brewery.zipcode.split(" ").join("+")}`;
    return fetchBreweryLatLong(addressString);
  });
  Promise.all(latLong).then(list => dispatch(setLatLongList(list)));
};
