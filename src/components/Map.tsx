import { useRef, useEffect, useState } from "react";
import mapboxgl, { Map } from "mapbox-gl";
import type { LngLatLike } from "mapbox-gl";
import { Box, Paper } from "@mui/material";

// Default map settings
const DEFAULT_CENTER: [number, number] = [-74.006, 40.7128];
const DEFAULT_ZOOM = 1.5;

export default function MapBox() {
  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const [center] = useState<[number, number]>(DEFAULT_CENTER);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: center as LngLatLike,
      zoom: DEFAULT_ZOOM,
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
      }}
    >
      <Box
        ref={mapContainerRef}
        sx={{
          height: "100%",
          width: "100%",
          "& .mapboxgl-canvas": {
            borderRadius: "inherit",
          },
        }}
      />
    </Paper>
  );
}
