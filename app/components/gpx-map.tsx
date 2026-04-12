"use client";

import { useEffect, useState, type ComponentType } from "react";

type GpxMapProps = {
  src: string;
  height?: number;
};

type LatLngTuple = [number, number];
type GpxMapLeafletProps = {
  points: LatLngTuple[];
  height: number;
};

function parseGpxTrackPoints(gpxText: string): LatLngTuple[] {
  const parser = new DOMParser();
  const xml = parser.parseFromString(gpxText, "application/xml");
  const trkpts = Array.from(xml.querySelectorAll("trkpt"));

  return trkpts
    .map((point) => {
      const lat = Number(point.getAttribute("lat"));
      const lon = Number(point.getAttribute("lon"));
      if (Number.isNaN(lat) || Number.isNaN(lon)) return null;
      return [lat, lon] as LatLngTuple;
    })
    .filter((point): point is LatLngTuple => point !== null);
}

export default function GpxMap({ src, height = 420 }: GpxMapProps) {
  const [points, setPoints] = useState<LatLngTuple[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [MapRenderer, setMapRenderer] = useState<ComponentType<GpxMapLeafletProps> | null>(null);

  useEffect(() => {
    let cancelled = false;

    import("./gpx-map-leaflet")
      .then((mod) => {
        if (!cancelled) {
          setMapRenderer(() => mod.default);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Failed to load map renderer");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch(src);
        if (!response.ok) {
          throw new Error(`Could not load route (${response.status})`);
        }

        const gpxText = await response.text();
        const parsed = parseGpxTrackPoints(gpxText);

        if (!cancelled) {
          if (parsed.length === 0) {
            setError("No track points found in GPX.");
            return;
          }
          setPoints(parsed);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load GPX route");
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [src]);

  if (error) {
    return <div className="gpx-map p-3 text-sm">{error}</div>;
  }

  if (points.length === 0) {
    return <div className="gpx-map p-3 text-sm">Loading map...</div>;
  }

  if (!MapRenderer) {
    return <div className="gpx-map p-3 text-sm">Loading map renderer...</div>;
  }

  return <MapRenderer points={points} height={height} />;
}
