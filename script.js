// Variables globales
let locationData = null;

// 1. Captura automática de información técnica del dispositivo
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
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        locationData = {
          latitude: lat,
          longitude: lng,
          accuracy: position.coords.accuracy + " meters",
          googleMapsUrl: `https://www.google.com/maps?q=${lat},${lng}`
        };

        statusLocation.textContent = "✅ Location saved successfully!";
        statusLocation.style.color = "#059669";
        locationBtn.style.backgroundColor = "#059669";
        
        console.log("📍 Coordenadas capturadas con éxito:", locationData);
      },
      (error) => {
        console.warn("Error obtaining location:", error.message);
        statusLocation.textContent = "⚠️ Location permission denied or unavailable.";
        statusLocation.style.color = "#dc2626";
      },
      {
        enableHighAccuracy: true,
        timeout: 30000, // 30 segundos de margen para alta precisión
        maximumAge: 0
      }
    );
  });
}


// 3. Captura y envío del formulario a Firebase Firestore
const recoveryForm = document.getElementById("recoveryForm");

if (recoveryForm) {
  recoveryForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Previene la recarga de la página

    const contactInput = document.getElementById("contactInfo");
    const messageInput = document.getElementById("message");
    const submitBtn = document.getElementById("submitBtn");

    // Construcción del paquete de datos final
    const reportPayload = {
      deviceInfo: systemData,
      location: locationData ? locationData : "No location provided",
      contact: contactInput ? contactInput.value : "N/A",
      message: messageInput.value,
      createdAt: new Date().toISOString()
    };

    // Cambiar estado del botón mientras envía
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    // Guardar en la base de datos de Firebase
    if (window.sendToFirebase) {
      const success = await window.sendToFirebase(reportPayload);
      if (success) {
        alert("Thank you! Your report has been saved successfully.");
        recoveryForm.reset();
        
        // Resetear el estado de ubicación tras el envío
        locationData = null;
        if (statusLocation) statusLocation.textContent = "";
        if (locationBtn) locationBtn.style.backgroundColor = "";
      } else {
        alert("There was an error saving your report. Please try again.");
      }
    } else {
      console.log("🚀 Payload listo (simulación sin Firebase):", reportPayload);
      alert("Thank you! Your report has been submitted.");
    }

    // Restaurar botón
    submitBtn.textContent = "Send Report";
    submitBtn.disabled = false;
  });
}
