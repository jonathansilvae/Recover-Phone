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
    language: nav.language || nav.userLanguage || "N/A",
    os: os,
    deviceType: isMobile,
    userAgent: userAgent
  };
}

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
        timeout: 15000,
        maximumAge: 0
      }
    );
  });
}

// 3. Captura y envío del formulario a Firebase Firestore + Webhook (Make)
const recoveryForm = document.getElementById("recoveryForm");
const MAKE_WEBHOOK_URL = "https://hook.eu1.make.com/trhbqon23gv9pdoqns36fbp17g97pu80";

if (recoveryForm) {
  recoveryForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const contactInput = document.getElementById("contactInfo");
    const messageInput = document.getElementById("message");
    const submitBtn = document.getElementById("submitBtn");

    const systemData = captureDeviceInfo();

    const locationPayload = locationData ? locationData : {
      latitude: "N/A",
      longitude: "N/A",
      accuracy: "Not provided",
      googleMapsUrl: "No location attached"
    };

    const reportPayload = {
      deviceInfo: systemData,
      location: locationPayload,
      contact: contactInput && contactInput.value.trim() !== "" ? contactInput.value.trim() : "No contact provided",
      message: messageInput && messageInput.value.trim() !== "" ? messageInput.value.trim() : "No message provided",
      createdAt: new Date().toISOString()
    };

    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    if (window.sendToFirebase) {
      const success = await window.sendToFirebase(reportPayload);
      if (success) {
        fetch(MAKE_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reportPayload)
        }).catch(err => console.error("Error al enviar webhook:", err));

        alert("Thank you! Your report has been saved successfully.");
        recoveryForm.reset();
        
        locationData = null;
        if (statusLocation) statusLocation.textContent = "";
        if (locationBtn) locationBtn.style.backgroundColor = "";
      } else {
        alert("There was an error saving your report. Please try again.");
      }
    } else {
      console.log("🚀 Payload listo (simulación sin Firebase):", reportPayload);
      
      fetch(MAKE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportPayload)
      }).catch(err => console.error("Error al enviar webhook:", err));

      alert("Thank you! Your report has been submitted.");
      recoveryForm.reset();
      
      locationData = null;
      if (statusLocation) statusLocation.textContent = "";
      if (locationBtn) locationBtn.style.backgroundColor = "";
    }

    submitBtn.textContent = "Send Report";
    submitBtn.disabled = false;
  });
}

// 4. Generación dinámica del Código QR
function generateDynamicQR() {
  const qrContainer = document.getElementById("qrcode-container");
  
  if (!qrContainer) return;

  qrContainer.innerHTML = "";

  const currentUrl = window.location.href;

  new QRCode(qrContainer, {
    text: currentUrl,
    width: 200,
    height: 200,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });

  console.log("🔗 QR generado automáticamente para:", currentUrl);
}

document.addEventListener("DOMContentLoaded", generateDynamicQR);
