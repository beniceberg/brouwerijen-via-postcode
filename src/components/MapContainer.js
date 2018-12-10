import React from "react";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";

const googleMapsKey = process.env.GOOGLE_MAPS_API_KEY;

const MapContainer = ({ google, breweries, currentLocation }) => (
  <Map
    google={google}
    // central Asmterdam
    initialCenter={currentLocation.latLong || { lat: 52.368, lng: 4.9036 }}
    zoom={8}
    gestureHandling="cooperative"
    className="mapContainer"
    center={currentLocation.latLong || { lat: 52.368, lng: 4.9036 }}
  >
    {breweries.map(
      ({ latLong }) =>
        latLong && (
          <Marker position={latLong} key={`${latLong.lat}+${latLong.lng}`} />
        )
    )}
    {currentLocation.latLong && (
      <Marker
        position={currentLocation.latLong}
        key={`${currentLocation.latLong.lat}+${currentLocation.latLong.lng}`}
      />
    )}
  </Map>
);

export default GoogleApiWrapper({
  apiKey: googleMapsKey,
  libraries: ["geometry"]
})(MapContainer);
