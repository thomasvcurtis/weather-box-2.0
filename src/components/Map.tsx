import { useRef, useEffect, useState } from "react";
import mapboxgl, { Map } from "mapbox-gl";
import type { LngLatLike } from "mapbox-gl";
import { Box, Paper } from "@mui/material";
import { useAtom } from "jotai";
import { MapCoordinate } from '../atoms/mapCoordinates'

// Default map settings
const DEFAULT_CENTER: [number, number] = [-74.006, 40.7128];
const DEFAULT_ZOOM = 1.5;

export default function MapBox() {
  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const [center] = useState<[number, number]>(DEFAULT_CENTER);
  const [, setCoordinates] = useAtom(MapCoordinate);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: center as LngLatLike,
      zoom: DEFAULT_ZOOM,
    });

    mapRef.current.on("move", () => {
      if (!mapRef.current) return;
      const mapCenter = mapRef.current.getCenter();
      setCoordinates([mapCenter.lng, mapCenter.lat]);
    });
    
  }, []);

  return (
    <Paper
      elevation={3}
      sx={{
        height: "100%",
        width: "100%",
        borderRadius: 2,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        ref={mapContainerRef}
        sx={{
          height: "100%",
          width: "100%",
        }}
      />
      <Box
        component="img"
        src="/target.svg"
        alt="map target"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "40px",
          height: "40px",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
    </Paper>
  );
}
