import React, { Component } from "react";
import { GoogleApiWrapper } from "google-maps-react";

import { regexBE, regexNL } from "../utils/contants";

const googleMapsKey = process.env.GOOGLE_MAPS_API_KEY;

class Input extends Component {
  state = { postalCode: "" };

  handleChange = event => {
    this.setState({ postalCode: event.target.value });
  };
  doSeachClick = () => {
    this.props.doOnSeach(this.state.postalCode, this.props.google);
  };

  render() {
    const { postalCode } = this.state;
    const disableButton =
      !postalCode.match(regexNL) && !postalCode.match(regexBE);
    return (
      <div className="inputContainer">
        <h1>The Brewery Search Engine</h1>
        <input
          type="text"
          placeholder="Type your location's zip"
          value={postalCode}
          onChange={this.handleChange}
        />
        <button onClick={this.doSeachClick} disabled={disableButton}>
          Search Breweries
        </button>
      </div>
    );
  }
}

export default GoogleApiWrapper({ apiKey: googleMapsKey })(Input);
