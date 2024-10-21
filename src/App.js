import "./styles.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useEffect, useState } from "react";

import { Icon, divIcon, point } from "leaflet";

// create custom icon
const customIcon = new Icon({
  //   iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
  iconUrl: require("./icons/placeholder.png"),
  iconSize: [18, 18], // size of the icon
});

// markers

export default function App() {
  const [markers, setMarkers] = useState([]);

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
    <MapContainer center={[35.62224166666667, 10.737660000000002]} zoom={16}>
      OPEN STREEN MAPS TILES
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* WATERCOLOR CUSTOM TILES */}
      <TileLayer
        attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg"
      />
      {/* GOOGLE MAPS TILES */}
      <TileLayer
        attribution="Google Maps"
        // url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" // regular
        // url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}" // satellite
        url="http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}" // terrain
        maxZoom={20}
        subdomains={["mt0", "mt1", "mt2", "mt3"]}
      />
      {markers.map((marker, index) => (
        <Marker key={index} position={marker.geocode} icon={customIcon}>
          <Popup>{marker.popUp}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
