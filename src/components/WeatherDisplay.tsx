import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Switch,
  FormControlLabel,
} from "@mui/material";
import React, { useState } from "react";
import useRealTimeWeather from "../hooks/useRealTimeWeather";
import { format } from "date-fns";
import { MapCoordinate } from "../atoms/mapCoordinates";
import { useAtom } from "jotai";
import { useQueryClient } from "@tanstack/react-query";

type Units = "metric" | "imperial";

interface WeatherData {
  data: {
    time: string;
    values: {
      altimeterSetting: number;
      cloudBase: number;
      cloudCeiling: number;
      cloudCover: number;
      dewPoint: number;
      freezingRainIntensity: number;
      humidity: number;
      precipitationProbability: number;
      pressureSeaLevel: number;
      pressureSurfaceLevel: number;
      rainIntensity: number;
      sleetIntensity: number;
      snowIntensity: number;
      temperature: number;
      temperatureApparent: number;
      uvHealthConcern: number;
      uvIndex: number;
      visibility: number;
      weatherCode: number;
      windDirection: number;
      windGust: number;
      windSpeed: number;
    };
  };
}

export default function WeatherDisplay() {

  const [coordinates] = useAtom(MapCoordinate);
  const [units, setUnits] = useState<Units>("imperial");

  const queryClient = useQueryClient();
  const coordString = `${coordinates[1]},${coordinates[0]}`;
  const { status, data, error, refetch } = useRealTimeWeather(
    coordString,
    units
  );
  const weatherData = data as WeatherData;

  const handleUnitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUnits = event.target.checked ? "metric" : "imperial";
    setUnits(newUnits);
    queryClient.setQueryData(["weather"], null);
  };

  const handleFetchWeather = () => {
    refetch();
  };

  const formatTime = (timeString: string) => {
    return format(new Date(timeString), "MMMM dd, yyyy HH:mm");
  };

  if (status === "error") {
    return <span>Error: {error.message}</span>;
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button variant="contained" onClick={handleFetchWeather}>
            Get Realtime Weather
          </Button>
          <FormControlLabel
            control={
              <Switch
                checked={units === "metric"}
                onChange={handleUnitChange}
                color="primary"
              />
            }
            label={units === "metric" && "Metric" || "Imperial"}
          />
        </Box>
        <Typography variant="h6">
          {weatherData && formatTime(weatherData.data.time)}
        </Typography>
      </Box>

      <Stack direction="row" spacing={2}>
        {/* Temperature Card */}
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Temperature
            </Typography>
            <Typography>
              Actual:{" "}
              {weatherData && 
                `${weatherData.data.values.temperature}${units === "metric" && "°C" || "°F"}`}
            </Typography>
            <Typography>
              Feels Like:{" "}
              {weatherData && 
                `${weatherData.data.values.temperatureApparent}${units === "metric" && "°C" || "°F"}`}
            </Typography>
            <Typography>
              Dew Point:{" "}
              {weatherData && 
                `${weatherData.data.values.dewPoint}${units === "metric" && "°C" || "°F"}`}
            </Typography>
            <Typography>
              Humidity:{" "}
              {weatherData && `${weatherData.data.values.humidity}%`}
            </Typography>
          </CardContent>
        </Card>

        {/* Clouds & Visibility Card */}
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Clouds & Visibility
            </Typography>
            <Typography>
              Cloud Cover:{" "}
              {weatherData && `${weatherData.data.values.cloudCover}%`}
            </Typography>
            <Typography>
              Cloud Base:{" "}
              {weatherData && 
                `${weatherData.data.values.cloudBase}${units === "metric" && "km" || "mi"}`}
            </Typography>
            <Typography>
              Cloud Ceiling:{" "}
              {weatherData && 
                `${weatherData.data.values.cloudCeiling}${units === "metric" && "km" || "mi"}`}
            </Typography>
            <Typography>
              Visibility:{" "}
              {weatherData && 
                `${weatherData.data.values.visibility}${units === "metric" && "km" || "mi"}`}
            </Typography>
          </CardContent>
        </Card>

        {/* Wind Card */}
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Wind
            </Typography>
            <Typography>
              Speed:{" "}
              {weatherData && `${weatherData.data.values.windSpeed}m/s`}
            </Typography>
            <Typography>
              Direction:{" "}
              {weatherData && `${weatherData.data.values.windDirection}°`}
            </Typography>
            <Typography>
              Gust:{" "}
              {weatherData && `${weatherData.data.values.windGust}m/s`}
            </Typography>
          </CardContent>
        </Card>

        {/* Precipitation Card */}
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Precipitation
            </Typography>
            <Typography>
              Probability:{" "}
              {weatherData
                ? `${weatherData.data.values.precipitationProbability}%`
                : "--"}
            </Typography>
            <Typography>
              Rain:{" "}
              {weatherData
                ? `${weatherData.data.values.rainIntensity}mm/hr`
                : "--"}
            </Typography>
            <Typography>
              Snow:{" "}
              {weatherData
                ? `${weatherData.data.values.snowIntensity}mm/hr`
                : "--"}
            </Typography>
            <Typography>
              Sleet:{" "}
              {weatherData
                ? `${weatherData.data.values.sleetIntensity}mm/hr`
                : "--"}
            </Typography>
          </CardContent>
        </Card>

        {/* Pressure Card */}
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Pressure
            </Typography>
            <Typography>
              Sea Level:{" "}
              {weatherData
                ? `${weatherData.data.values.pressureSeaLevel}hPa`
                : "--"}
            </Typography>
            <Typography>
              Surface:{" "}
              {weatherData
                ? `${weatherData.data.values.pressureSurfaceLevel}hPa`
                : "--"}
            </Typography>
            <Typography>
              Altimeter:{" "}
              {weatherData
                ? `${weatherData.data.values.altimeterSetting}inHg`
                : "--"}
            </Typography>
          </CardContent>
        </Card>

        {/* UV & Weather Card */}
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              UV & Weather
            </Typography>
            <Typography>
              UV Index: {weatherData ? weatherData.data.values.uvIndex : "--"}
            </Typography>
            <Typography>
              Health Concern:{" "}
              {weatherData ? weatherData.data.values.uvHealthConcern : "--"}
            </Typography>
            <Typography>
              Weather Code:{" "}
              {weatherData ? weatherData.data.values.weatherCode : "--"}
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </>
  );
}
