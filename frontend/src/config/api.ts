const LOCAL_ORIGIN = "http://localhost:5003";
const PRODUCTION_ORIGIN = "https://gastronova-api.onrender.com";

function trimSlash(value: string) {
  return value.replace(/\/+$/, "");
}

const configuredApi = import.meta.env.VITE_API_URL?.trim();
const configuredSocket = import.meta.env.VITE_SOCKET_URL?.trim();
const defaultOrigin = import.meta.env.PROD ? PRODUCTION_ORIGIN : LOCAL_ORIGIN;

export const API_URL = trimSlash(configuredApi || `${defaultOrigin}/api`);

export const SOCKET_URL = trimSlash(
  configuredSocket ||
    (configuredApi ? configuredApi.replace(/\/api$/, "") : defaultOrigin)
);
