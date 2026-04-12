"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, Polyline, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type LatLngTuple = [number, number];

type GpxMapLeafletProps = {
  points: LatLngTuple[];
  height: number;
};

function FitBounds({ points }: { points: LatLngTuple[] }) {
  const map = useMap();
  const bounds = useMemo(() => L.latLngBounds(points), [points]);

  useEffect(() => {
    map.fitBounds(bounds, { padding: [20, 20] });
  }, [bounds, map]);

  return null;
}

export default function GpxMapLeaflet({ points, height }: GpxMapLeafletProps) {
  return (
    <div className="gpx-map overflow-hidden" style={{ height: `${height}px` }}>
      <MapContainer style={{ height: "100%", width: "100%" }} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={points} pathOptions={{ color: "#2563eb", weight: 4 }} />
        <FitBounds points={points} />
      </MapContainer>
    </div>
  );
}
