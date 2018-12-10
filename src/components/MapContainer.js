import React from "react";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";

const googleMapsKey = process.env.GOOGLE_MAPS_API_KEY;

const MapContainer = ({ google, breweries }) => (
  <Map
    google={google}
    // central Asmterdam
    initialCenter={{ lat: 52.368, lng: 4.9036 }}
    zoom={8}
    gestureHandling="cooperative"
    className="mapContainer"
  >
    {breweries.map(
      ({ latLong }) =>
        latLong && (
          <Marker position={latLong} key={`${latLong.lat}+${latLong.lng}`} />
        )
    )}
  </Map>
);

export default GoogleApiWrapper({
  apiKey: googleMapsKey,
  libraries: ["geometry"]
})(MapContainer);
