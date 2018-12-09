import React, { Component } from "react";
import { connect } from "react-redux";
import "./App.css";

import { fetchBreweries } from "./actions";

class App extends Component {
  constructor(props) {
    super(props);
    this.getBrewery();
  }

  getBrewery() {
    this.props.dispatch(fetchBreweries());
  }

  render() {
    return <div className="App" />;
  }
}

const mapStateToProps = state => {
  return {};
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
