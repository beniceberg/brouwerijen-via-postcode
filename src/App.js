import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { GoogleApiWrapper } from "google-maps-react";

import MapContainer from "./components/MapContainer";
import Input from "./components/Input";
import Beerslist from "./components/Beerslist";
import "./App.css";

import {
  fetchBreweries,
  fetchBeers,
  getLatAndLongs,
  getDistances,
  calcRoute
} from "./_actions";
import {
  getBreweries,
  getCurrentLocation,
  getOpenBreweries,
  getDirections,
  getBeersFromNearestBrewery
} from "./_selectors";
import BreweryCard from "./components/BreweryCard";

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
    this.props.dispatch(fetchBeers());
  }

  doOnSeach = (postalCode, google, isNL) => {
    this.props.dispatch(getDistances(postalCode, google, isNL));
  };

  render() {
    const {
      breweries,
      currentLocation,
      openBreweries,
      directions,
      beers
    } = this.props;
    return (
      <div className="App">
        <section className="inputSection">
          <Input doOnSeach={this.doOnSeach} />
        </section>
        {openBreweries.length ? (
          <section className="brewerySection">
            <BreweryCard brewery={openBreweries[0]} />
          </section>
        ) : null}
        <section className="beerlistSection">
          <Beerslist beers={beers} />
        </section>
        <section className="mapSection">
          <MapContainer
            breweries={breweries}
            currentLocation={currentLocation}
            directions={directions}
            closestBrewery={openBreweries[0]}
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
  directions: PropTypes.object,
  beers: PropTypes.array
};

const mapStateToProps = state => {
  return {
    breweries: getBreweries(state),
    currentLocation: getCurrentLocation(state),
    openBreweries: getOpenBreweries(state),
    directions: getDirections(state),
    beers: getBeersFromNearestBrewery(state)
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
