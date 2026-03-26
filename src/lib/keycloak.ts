// lib/keycloak.js
import Keycloak from "keycloak-js";

const keycloakConfig = {
  url: "http://127.0.0.1:4000",
  // url: "https://your-keycloak-server/auth",
  realm: "sashti",
  clientId: "sashti_c",
};

const keycloak =
  typeof window !== "undefined" ? new Keycloak(keycloakConfig) : null;

export default keycloak;
