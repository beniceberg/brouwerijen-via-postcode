import React, { Component } from "react";
import { GoogleApiWrapper } from "google-maps-react";
import PropTypes from "prop-types";

import { regexBE, regexNL } from "../utils/contants";

const googleMapsKey = process.env.GOOGLE_MAPS_API_KEY;

class Input extends Component {
  state = { postalCode: "" };

  handleChange = event => this.setState({ postalCode: event.target.value });
  doSeachClick = () =>
    this.props.doOnSeach(
      this.state.postalCode,
      this.props.google,
      this.state.postalCode.match(regexNL)
    );
  doKeyPress = e =>
    e.key === "Enter" &&
    (this.state.postalCode.match(regexNL) ||
      this.state.postalCode.match(regexBE)) &&
    this.doSeachClick();

  render() {
    const { postalCode } = this.state;
    const disableButton =
      !postalCode.match(regexNL) && !postalCode.match(regexBE);
    return (
      <div>
        <h1 className="title">The Brewery Search Engine</h1>
        <div className="inputContainer">
          <input
            className="searchInput"
            type="text"
            placeholder="Type your zipcode"
            value={postalCode}
            onChange={this.handleChange}
            onKeyPress={this.doKeyPress}
          />
          <button
            className={`searchButton ${disableButton ? `disabled` : ""}`}
            onClick={this.doSeachClick}
            disabled={disableButton}
          >
            Search Breweries
          </button>
        </div>
      </div>
    );
  }
}

Input.propTypes = {
  google: PropTypes.func,
  doOnSeach: PropTypes.func
};

export default GoogleApiWrapper({ apiKey: googleMapsKey })(Input);
