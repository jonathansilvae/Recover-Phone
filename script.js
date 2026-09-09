// Variables globales
let locationData = null;

// 1. Captura automática de información técnica
function captureDeviceInfo() {
  const nav = navigator;
  const userAgent = nav.userAgent;

  let os = "Unknown OS";
  if (userAgent.indexOf("Win") !== -1) os = "Windows";
  if (userAgent.indexOf("Mac") !== -1) os = "MacOS";
  if (userAgent.indexOf("Linux") !== -1) os = "Linux";
  if (userAgent.indexOf("Android") !== -1) os = "Android";
  if (userAgent.indexOf("like Mac") !== -1) os = "iOS (iPhone/iPad)";

  const isMobile = /Mobi|Android|iPhone|iPad/i.test(userAgent) ? "Mobile" : "Desktop";

  return {
    timestamp: new Date().toISOString(),
    localTime: new Date().toLocaleString(),
    language: nav.language || nav.userLanguage,
    os: os,
    deviceType: isMobile,
    userAgent: userAgent
  };
}

const systemData = captureDeviceInfo();
console.log("Información técnica del dispositivo:", systemData);


// 2. Evento para obtener la ubicación GPS
const locationBtn = document.getElementById("locationBtn");
const statusLocation = document.getElementById("status-location");

if (locationBtn) {
  locationBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
      statusLocation.textContent = "❌ Geolocation is not supported by your browser.";
      statusLocation.style.color = "#dc2626";
      return;
    }

    statusLocation.textContent = "⏳ Requesting location...";
    statusLocation.style.color = "#2563eb";

    navigator.geolocation.getCurrentPosition(
      (position) => {
        locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy + " meters"
        };

        statusLocation.textContent = "✅ Location saved successfully!";
        statusLocation.style.color = "#059669";
        locationBtn.style.backgroundColor = "#059669";
        console.log("Coordenadas GPS capturadas:", locationData);
      },
      (error) => {
        console.warn("Error obtaining location:", error.message);
        statusLocation.textContent = "⚠️ Location permission denied or unavailable.";
        statusLocation.style.color = "#dc2626";
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
}


// 3. Captura y envío del formulario (Fase 3)
const recoveryForm = document.getElementById("recoveryForm");

if (recoveryForm) {
  recoveryForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Previene que la página se recargue

    const contactInput = document.getElementById("contactInfo");
    const messageInput = document.getElementById("message");

    // Construcción del objeto final con todos los datos recopilados
    const reportPayload = {
      deviceInfo: systemData,
      location: locationData || "No location provided",
      contact: contactInput ? contactInput.value : "N/A",
      message: messageInput.value
    };

    console.log("🚀 Payload final listo para enviar a Firebase:", reportPayload);
    alert("Thank you! Your report has been submitted.");
  });
}
