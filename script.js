// Variable global para almacenar los datos del GPS cuando el usuario los comparta
let locationData = null;

// 1. CAPTURA AUTOMÁTICA DE DATOS DEL ENTORNO
function captureDeviceInfo() {
  const nav = navigator;
  const userAgent = nav.userAgent;

  // Identificar el sistema operativo
  let os = "Unknown OS";
  if (userAgent.indexOf("Win") !== -1) os = "Windows";
  if (userAgent.indexOf("Mac") !== -1) os = "MacOS";
  if (userAgent.indexOf("Linux") !== -1) os = "Linux";
  if (userAgent.indexOf("Android") !== -1) os = "Android";
  if (userAgent.indexOf("like Mac") !== -1) os = "iOS (iPhone/iPad)";

  // Tipo de dispositivo (Móvil vs Escritorio)
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

// Guardar la información técnica al cargar la página
const systemData = captureDeviceInfo();
console.log("Información técnica del dispositivo:", systemData);


// 2. CAPTURA DE GEOLOCALIZACIÓN GPS (AL HACER CLIC)
const locationBtn = document.getElementById("locationBtn");
const statusLocation = document.getElementById("status-location");

if (locationBtn) {
  locationBtn.addEventListener("click", () => {
    // Verificar si el navegador soporta geolocalización
    if (!navigator.geolocation) {
      statusLocation.textContent = "❌ Geolocation is not supported by your browser.";
      statusLocation.style.color = "#dc2626";
      return;
    }

    statusLocation.textContent = "⏳ Requesting location...";
    statusLocation.style.color = "#2563eb";

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Éxito al obtener coordenadas
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
        // Manejo de errores o permisos denegados
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
