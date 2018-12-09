export const SET_BREWERIES = "SET_BREWERIES";

const setBreweries = list => ({
  type: SET_BREWERIES,
  list
});

// fetching breweries from given api
export const fetchBreweries = () => (dispatch, getState) => {
  // using a heroku proxyurl to work around client cors issues
  const proxyUrl = `https://cors-anywhere.herokuapp.com/`;
  const url = `https://download.oberon.nl/opdracht/brouwerijen.js`;
  fetch(proxyUrl + url, { method: "GET" })
    .then(resp => resp.json())
    .then(json => dispatch(setBreweries(json.breweries)))
    .catch(error => {
      console.log(error);
    });
};
