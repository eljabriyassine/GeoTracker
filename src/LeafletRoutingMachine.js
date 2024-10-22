import { useEffect, useState } from "react";
import L, { marker } from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { useMap } from "react-leaflet";

const LeafletRoutingMachine = ({ markers, onStartRoute }) => {
  const map = useMap();
  let taxiIcon = L.icon({
    iconUrl: "/taxi.png",
    iconSize: [70, 70],
  });

  useEffect(() => {
    if (onStartRoute) StartRoute();
  }, [onStartRoute]);

  const StartRoute = () => {
    if (markers.length === 0) return;
    var marker1 = L.marker([35.62224166666667, 10.737660000000002], {
      icon: taxiIcon,
    }).addTo(map);

    L.Routing.control({
      waypoints: [
        L.latLng(35.62224166666667, 10.737660000000002),
        L.latLng(35.62457833333334, 10.760291666666667),
        L.latLng(35.827815, 10.64319),
      ],
      lineOptions: {
        styles: [
          {
            color: "blue",
            weight: 4,
            opacity: 0.7,
          },
        ],
      },
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: true,
    })
      .on("routesfound", function (e) {
        e.routes[0].coordinates.forEach((c, i) => {
          setTimeout(() => {
            marker1.setLatLng([c.lat, c.lng]);
          }, 100 * i);
        });
      })
      .addTo(map);
  };

  return null;
};

export default LeafletRoutingMachine;
