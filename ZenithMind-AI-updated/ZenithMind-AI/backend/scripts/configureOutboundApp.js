import axios from "axios";

const projectId = process.env.DESCOPE_PROJECT_ID;
const managementKey = process.env.DESCOPE_MANAGEMENT_KEY;
const outboundAppId = process.env.OUTBOUND_APP_ID_GOOGLE;
const apiBase = process.env.DESCOPE_API_BASE || "https://api.descope.com";

if (!projectId || !managementKey || !outboundAppId) {
  console.error("❌ Missing required ENV variables: DESCOPE_PROJECT_ID, DESCOPE_MANAGEMENT_KEY, OUTBOUND_APP_ID_GOOGLE");
  process.exit(1);
}

async function configureGoogleOutboundApp() {
  try {
    const url = `${apiBase}/v1/management/outbound/apps/${outboundAppId}`;
    const response = await axios.patch(
      url,
      {
        provider: "google",
        config: {
          scopes: [
            "https://www.googleapis.com/auth/calendar",
            "https://www.googleapis.com/auth/calendar.events"
          ]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${projectId}:${managementKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Google Outbound App configured successfully!");
    console.log("Response:", response.data);
  } catch (error) {
    console.error("❌ Failed to configure Outbound App:", error.response?.data || error.message);
    process.exit(1);
  }
}

configureGoogleOutboundApp();
