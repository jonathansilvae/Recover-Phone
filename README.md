# Recover-Phone
Este es el link del prototipo : https://jonathansilvae.github.io/Recover-Phone/

Roadmap:
- index,style,script,githubpages,repository,primera pagina publicada y accesible creada.
Proximos pasos:
- conectar style.css con index.html
- mejorar aspecto visual
- disenyo respectivo para moviles
- agregar iconos, logos

Fase 2 funcionalidad
- Conectar script.js
- capturar automaticamente:
- fecha,hora,idoma,navegador,sistema operatio, tipo de dispositivo.
- agregar boton:
- compartir ubicacion GPS
- solicitar permiso de ubicacion
- capturar coordenadas gps si el usuario acepta

Fase 3 Formulario
campos:
- nombre,email.mensaje,ubicacion manual, numero de telefono, informacion adicional

Fase 4- Base de datos
usar Firebase:
guardar:
device id,fecha,hora,navegador,sistema operativo,gps,mensaje,datos del remitente

Fase 5- notificaciones
cuando alguien envie e formulario:
-enviar email al propietario
-o enviar mensaje mediante telegram bot

Fase 6 - QR dinamico
cada dispositivo tendra: https://jonathansilvae.github.io/Recover-Phone/

Fase 7 - seguridad
No almacenar informacion sensible
anadir politica de privacidad
validar datos del formulario
evitar spam

Objetivo final
flujo:
persona encuentra tlf -> escanea qr -> abre recover-phone->introduce mensaje->compartir ubicacion opcional->pulsar enviar->firebase guarda informacion->propietario recibe informacion.

Tecnologias: github pages, html, css, javascript,firebase,qrcode,geolocalitation api, email o telegram bot

