import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import MapContainer from "./components/MapContainer";
import Input from "./components/Input";
import "./App.css";

import { fetchBreweries, getLatAndLongs, getDistances } from "./_actions";
import { getBreweries } from "./_selectors";

class App extends Component {
  constructor(props) {
    super(props);
    this.getBrewery();
  }

  componentWillReceiveProps(nextProps) {
    const { breweries, dispatch } = this.props;
    !breweries.length &&
      nextProps.breweries.length &&
      dispatch(getLatAndLongs());
  }

  getBrewery() {
    this.props.dispatch(fetchBreweries());
  }

  doOnSeach = (postalCode, google) => {
    this.props.dispatch(getDistances(postalCode, google));
  };

  render() {
    const { breweries } = this.props;
    return (
      <div className="App">
        <section>
          <Input doOnSeach={this.doOnSeach} breweries={breweries} />
        </section>
        <section>
          <MapContainer breweries={breweries} />
        </section>
      </div>
    );
  }
}

App.propTypes = {
  breweries: PropTypes.array,
  dispatch: PropTypes.func
};

const mapStateToProps = state => {
  return {
    breweries: getBreweries(state)
  };
};
const mapDispatchToProps = dispatch => {
  return {
    dispatch
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
