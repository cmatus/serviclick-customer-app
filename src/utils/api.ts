import axios from "axios";

import { config } from "./config";

const apiInstance = axios.create({
  baseURL: `${config.apiURL}/api/v2`,
  headers: {
    id: config.apiKey,
  },
});

const apiAuthInstance = axios.create({
  baseURL: `${config.apiAuthURL}`,
  headers: {
    id: config.apiAuthKey,
  },
});

export { apiInstance, apiAuthInstance };
