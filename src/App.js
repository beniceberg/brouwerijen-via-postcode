import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { GoogleApiWrapper } from "google-maps-react";

import MapContainer from "./components/MapContainer";
import Input from "./components/Input";
import "./App.css";

import {
  fetchBreweries,
  getLatAndLongs,
  getDistances,
  calcRoute
} from "./_actions";
import {
  getBreweries,
  getCurrentLocation,
  getOpenBreweries,
  getDirections
} from "./_selectors";

const googleMapsKey = process.env.GOOGLE_MAPS_API_KEY;

class App extends Component {
  constructor(props) {
    super(props);
    this.getBrewery();
  }

  componentWillReceiveProps(nextProps) {
    const {
      breweries,
      dispatch,
      openBreweries,
      currentLocation,
      google
    } = this.props;
    !breweries.length &&
      nextProps.breweries.length &&
      dispatch(getLatAndLongs());
    !currentLocation.latLong &&
      nextProps.currentLocation.latLong &&
      dispatch(calcRoute(nextProps.currentLocation, openBreweries[0], google));
  }

  getBrewery() {
    this.props.dispatch(fetchBreweries());
  }

  doOnSeach = (postalCode, google) => {
    this.props.dispatch(getDistances(postalCode, google));
  };

  render() {
    const {
      breweries,
      currentLocation,
      openBreweries,
      directions
    } = this.props;
    const nearest = openBreweries[0];
    return (
      <div className="App">
        <section>
          <Input doOnSeach={this.doOnSeach} openBreweries={openBreweries} />
        </section>
        {openBreweries.length ? (
          <section>
            <p>{`The nearest brewery open today is ${nearest.name}.`}</p>
            <p>{`It's open:`}</p>
            <ul>
              {nearest.open.map(el => (
                <li key={el}>{el}</li>
              ))}
            </ul>
            <p>{`Address: ${nearest.address}, ${nearest.city}, ${
              nearest.zipcode
            }`}</p>
          </section>
        ) : null}
        <section>
          <MapContainer
            breweries={breweries}
            currentLocation={currentLocation}
            directions={directions}
          />
        </section>
      </div>
    );
  }
}

App.propTypes = {
  breweries: PropTypes.array,
  dispatch: PropTypes.func,
  currentLocation: PropTypes.object,
  openBreweries: PropTypes.array,
  directions: PropTypes.object
};

const mapStateToProps = state => {
  return {
    breweries: getBreweries(state),
    currentLocation: getCurrentLocation(state),
    openBreweries: getOpenBreweries(state),
    directions: getDirections(state)
  };
};
const mapDispatchToProps = dispatch => {
  return {
    dispatch
  };
};

export default GoogleApiWrapper({
  apiKey: googleMapsKey
})(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
