import "./styles.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";

import { Icon } from "leaflet";

// create custom icon
const customIcon = new Icon({
  iconUrl: require("./icons/placeholder.png"),
  iconSize: [18, 18],
});

// markers

export default function App() {
  const [markers, setMarkers] = useState([]);
  const [viewMode, setViewMode] = useState("map");

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/coordinates");
        const data = await response.json();
        const mappedMarkers = data.map((item) => ({
          geocode: [item.latitude, item.longitude],
          popUp: `Date: ${item.date}, Device ID: ${item.idDevice}`,
        }));

        setMarkers(mappedMarkers);
        // setMarkers(mappedMarkers);
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    fetchCoordinates();
  }, []);

  useEffect(() => {
    console.log(markers);
  }, [markers]);

  return (
    <>
      <div className="button-container">
        <button onClick={() => setViewMode("map")}>Map View</button>
        <button onClick={() => setViewMode("satellite")}>Satellite View</button>
      </div>

      <MapContainer center={[35.62224166666667, 10.737660000000002]} zoom={16}>
        OPEN STREEN MAPS TILES
        {viewMode === "map" && (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        )}
        {viewMode === "satellite" && (
          <TileLayer
            attribution="Google Maps"
            url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}" // satellite
            maxZoom={20}
            subdomains={["mt0", "mt1", "mt2", "mt3"]}
          />
        )}
        {/* WATERCOLOR CUSTOM TILES */}
        <TileLayer
          attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg"
        />
        {markers.map((marker, index) => (
          <Marker key={index} position={marker.geocode} icon={customIcon}>
            <Popup>{marker.popUp}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}
