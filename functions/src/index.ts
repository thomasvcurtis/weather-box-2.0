import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import * as logger from "firebase-functions/logger";

const TomorrowIoApiKey = defineSecret("TOMORROWIO_API_KEY");
const mapBoxApiKey = defineSecret("VITE_MAPBOX_API_KEY");

export const realtimeWeather = onRequest({ secrets: [TomorrowIoApiKey] },async (request, response) => {
    const location = request.query.location;
    const units = request.query.units;
    const apiKey = TomorrowIoApiKey.value();

    if (!location) {
      response.status(400).send("Missing required query parameter: 'location'");
      return;
    }
    if (!units) {
      response.status(400).send("Missing required query parameter: 'units'");
      return;
    }

    try {
      logger.info("Calling realtimeWeather api");
      const baseUrl = "https://api.tomorrow.io/v4/weather/realtime";
      const url = `${baseUrl}?location=${location}&units=${units}&apikey=${apiKey}`;

      const weatherResponse = await fetch(url);
      const data = await weatherResponse.json();
      response.status(200).send(data);
    } catch (error) {
      logger.error("Unexpected error in realtimeWeather", error);
      response.status(500).send({ error: "Internal Server Error" });
    }
  }
);

export const reverseGeocoding = onRequest({ secrets: [mapBoxApiKey] },async (request, response) => {
    const longitude = request.query.longitude;
    const latitude = request.query.latitude;
    const apiKey = mapBoxApiKey.value();
    const types = "place" 

    if (!longitude) {
      response
        .status(400)
        .send("Missing required query parameter: 'longitude'");
      return;
    }
    if (!latitude) {
      response.status(400).send("Missing required query parameter: 'latitude'");
      return;
    }
    
    try {
      logger.info("Calling reverse geocoding api")
      const baseUrl = "https://api.mapbox.com/search/geocode/v6/reverse"
      const url = `${baseUrl}?longitude=${longitude}&latitude=${latitude}&access_token=${apiKey}&types=${types}`

      const geocodingResponse = await fetch(url)
      const data = await geocodingResponse.json()
      response.status(200).send(data);
      logger.info("Send response to client")
      
    } catch (error) {
      logger.error("Unexpected error in reverseGeocoding ", error);
      response.status(500).send({ error: "Internal Server Error" });
    }
  }
);


export const weatherBasedCoordinates = onRequest({ secrets: [mapBoxApiKey, TomorrowIoApiKey] }, async (request, response) => {
    const longitude = request.query.longitude;
    const latitude = request.query.latitude;
    const units = request.query.units;
    const mapApiKey = mapBoxApiKey.value();
    const weatherApiKey = TomorrowIoApiKey.value();
    const types = "place";

    if (!longitude) {
      response.status(400).send("Missing required query parameter: 'longitude'");
      return;
    }
    if (!latitude) {
      response.status(400).send("Missing required query parameter: 'latitude'");
      return;
    }
    if (!units) {
      response.status(400).send("Missing required query parameter: 'units'");
      return;
    }

    try {
      // First call reverse geocoding API
      logger.info("Calling reverse geocoding api");
      const geocodeBaseUrl = "https://api.mapbox.com/search/geocode/v6/reverse";
      const geocodeUrl = `${geocodeBaseUrl}?longitude=${longitude}&latitude=${latitude}&access_token=${mapApiKey}&types=${types}`;

      const geocodingResponse = await fetch(geocodeUrl);
      const geocodeData = await geocodingResponse.json();
      
      // Then call weather API
      logger.info("Calling realtimeWeather api");
      const weatherBaseUrl = "https://api.tomorrow.io/v4/weather/realtime";
      const locationFromCoordinate = `${latitude},${longitude}`;
      const weatherUrl = `${weatherBaseUrl}?location=${locationFromCoordinate}&units=${units}&apikey=${weatherApiKey}`;

      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await weatherResponse.json();

      // Combine and send response
      response.status(200).send({
        location: geocodeData,
        weather: weatherData
      });
      logger.info("Send response to client");
    } catch (error) {
      logger.error("Unexpected error in weatherBasedCoordinates", error);
      response.status(500).send({ error: "Internal Server Error" });
    }
});