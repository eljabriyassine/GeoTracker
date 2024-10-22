import "./styles.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

import LeafletRoutingMachine from "./LeafletRoutingMachine";

const App = () => {
  const [markers, setMarkers] = useState([]);
  const [viewMode, setViewMode] = useState("map");
  const [startView, setStartView] = useState(false); // New state for tracking start

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
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    fetchCoordinates();
  }, []);

  return (
    <>
      <div className="button-container">
        <button onClick={() => setViewMode("map")}>Map View</button>
        <button onClick={() => setViewMode("satellite")}>Satellite View</button>
        <button onClick={() => setStartView(true)}>Start view</button>
      </div>

      <MapContainer center={[35.62224166666667, 10.737660000000002]} zoom={16}>
        {viewMode === "map" && (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        )}
        {viewMode === "satellite" && (
          <TileLayer
            attribution="Google Maps"
            url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
            maxZoom={20}
            subdomains={["mt0", "mt1", "mt2", "mt3"]}
          />
        )}
        <LeafletRoutingMachine markers={markers} onStartRoute={startView} />
        start View
        {markers.map((marker, index) => (
          <Marker key={index} position={marker.geocode} icon={DefaultIcon}>
            <Popup>{marker.popUp}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
};

let DefaultIcon = L.icon({
  iconUrl: "/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
});

L.Marker.prototype.options.icon = DefaultIcon;
export default App;
