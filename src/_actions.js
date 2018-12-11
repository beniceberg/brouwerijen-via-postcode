import { getBreweries } from "./_selectors";
import { today } from "./utils/contants";

const googleMapsKey = process.env.GOOGLE_MAPS_API_KEY;

export const SET_BREWERIES = "SET_BREWERIES";
export const SET_BEERS = "SET_BEERS";
export const SET_LAT_LONG = "SET_LAT_LONG";
export const SET_OPEN_BREWERIES = "SET_OPEN_BREWERIES";
export const SET_CURRENT = "SET_CURRENT";
export const SET_DIRECTIONS = "SET_DIRECTIONS";

const setBreweries = list => ({
  type: SET_BREWERIES,
  list
});
const setBeers = list => ({
  type: SET_BEERS,
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
const setCurrent = location => ({
  type: SET_CURRENT,
  location
});
const setDirections = directions => ({
  type: SET_DIRECTIONS,
  directions
});

// fetching breweries from given api
export const fetchBreweries = () => dispatch => {
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
// fetching beers from given api
export const fetchBeers = () => dispatch => {
  // using a heroku proxyurl to work around client cors issues
  const proxyUrl = `https://cors-anywhere.herokuapp.com/`;
  const url = `https://download.oberon.nl/opdracht/bieren.js`;
  fetch(proxyUrl + url)
    .then(resp => resp.json())
    .then(json => dispatch(setBeers(json.beers)))
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

export const getLatLongInput = postalCode => (dispatch, getState) => {
  const currentLocation = fetchBreweryLatLong(postalCode.split(" ").join("+"));
  currentLocation.then(location =>
    dispatch(setCurrent({ zipcode: postalCode, latLong: location }))
  );
};

export const getDistances = (postalCode, google, isNL) => (
  dispatch,
  getState
) => {
  // credits: https://stackoverflow.com/a/32261167/9094722
  const breweries = getBreweries(getState());
  const service = new google.maps.DistanceMatrixService();
  // makes it more specific
  const origins = `${postalCode}, ${isNL ? `Netherlands` : `Belgium`}`;
  const serviceOptions = {
    origins: [origins],
    destinations: [],
    travelMode: google.maps.TravelMode.DRIVING
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
      response.rows[0].elements[0].status !== "ZERO_RESULTS" &&
      response.rows[0].elements[0].status !== "NOT_FOUND"
    ) {
      const { elements } = response.rows[0];
      elements.forEach((el, index) => {
        if (el.status === google.maps.DistanceMatrixStatus.OK) {
          distanceArray[index].distance = el.distance;
        }
      });
      dispatch(setOpenBreweries(distanceArray));
      dispatch(getLatLongInput(origins));
    } else {
      alert("Invalid zip code");
    }
  });
};

// calculate route, next step
export const calcRoute = (startPos, endPos, google) => (dispatch, getState) => {
  const directionsService = new google.maps.DirectionsService();
  const start = new google.maps.LatLng(
    startPos.latLong.lat,
    startPos.latLong.lng
  );
  const end = new google.maps.LatLng(endPos.latLong.lat, endPos.latLong.lng);
  const request = {
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, (response, status) => {
    if (status === google.maps.DirectionsStatus.OK) {
      // directionsDisplay.setDirections(response);
      // directionsDisplay.setMap(map);
      dispatch(setDirections(response));
    } else {
      alert(
        "Directions Request from " +
          start.toUrlValue(6) +
          " to " +
          end.toUrlValue(6) +
          " failed: " +
          status
      );
    }
  });
};
