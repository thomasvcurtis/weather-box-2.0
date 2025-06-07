import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import * as logger from "firebase-functions/logger";

const TomorrowIoApiKey = defineSecret("TOMORROWIO_API_KEY");

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
      const data = await weatherResponse.json()
      response.status(200).send(data);
    } catch (error) {
      logger.error("Unexpected error in realtimeWeather", error);
      response.status(500).send({ error: "Internal Server Error" });
    }
  }
);
