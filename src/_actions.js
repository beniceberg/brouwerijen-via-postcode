import { getBreweries } from "./_selectors";
import { today } from "./utils/contants";

const googleMapsKey = process.env.GOOGLE_MAPS_API_KEY;

export const SET_BREWERIES = "SET_BREWERIES";
export const SET_LAT_LONG = "SET_LAT_LONG";
export const SET_OPEN_BREWERIES = "SET_OPEN_BREWERIES";

const setBreweries = list => ({
  type: SET_BREWERIES,
  list
});

const setLatLongList = list => ({
  type: SET_LAT_LONG,
  list
});
const setOpenBreweries = list => ({
  type: SET_OPEN_BREWERIES,
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

export const getDistances = (postalCode, google) => (dispatch, getState) => {
  // credits: https://stackoverflow.com/a/32261167/9094722
  const breweries = getBreweries(getState());
  const service = new google.maps.DistanceMatrixService();
  const serviceOptions = {
    origins: [postalCode],
    destinations: [],
    travelMode: "DRIVING"
  };

  const distanceArray = breweries.reduce((acc, el) => {
    if (el.open.includes(today)) {
      serviceOptions.destinations.push(`${el.address}, ${el.zipcode}`);
      acc.push(el);
    }
    return acc;
  }, []);

  service.getDistanceMatrix(serviceOptions, (response, status) => {
    if (
      status === google.maps.DistanceMatrixStatus.OK &&
      response.rows[0].elements[0].status !== "ZERO_RESULTS"
    ) {
      const { elements } = response.rows[0];
      elements.forEach((el, index) => {
        if (el.status === google.maps.DistanceMatrixStatus.OK) {
          distanceArray[index].distance = el.distance;
        }
      });
    }
    dispatch(setOpenBreweries(distanceArray));
  });
};
