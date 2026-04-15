# in-Genio Web

Sitio web corporativo de **in-Genio** con frontend moderno y backend para formulario de contacto.

- Frontend: React + Vite
- Backend: Node.js + Express
- Envio de correo: Nodemailer (SMTP configurable)

## Tabla de contenido
- [Tecnologias](#tecnologias)
- [Requisitos](#requisitos)
- [Instalacion](#instalacion)
- [Configuración de entorno](#configuracion-de-entorno)
- [Ejecución en desarrollo](#ejecucion-en-desarrollo)
- [Build y producción](#build-y-produccion)
- [Scripts disponibles](#scripts-disponibles)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Assets de marca e imágenes](#assets-de-marca-e-imagenes)
- [API](#api)
- [Despliegue (hosting)](#despliegue-hosting)
- [Troubleshooting](#troubleshooting)
- [Licencia](#licencia)

## Tecnologías
- React 18
- Vite 5
- Express 4
- Nodemailer
- CSS custom (sin framework)

## Requisitos
- Node.js 20+ (recomendado LTS)
- npm 10+

Verifica versiones:

```bash
node -v
npm -v
```

## Instalacion
Desde la raiz del proyecto:

```bash
npm install
```

## Configuracion de entorno
1. Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

En PowerShell:

```powershell
Copy-Item .env.example .env
```

2. Edita `.env` con tus valores.

Variables principales:

- `VITE_API_URL`: URL base del backend para frontend (ej: `http://localhost:8080`)
- `PORT`: Puerto del backend (ej: `8080`)
- `ALLOWED_ORIGIN`: Origen permitido por CORS (ej: `http://localhost:5173`)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`: credenciales SMTP
- `CONTACT_TO`: correo destino de formularios
- `CONTACT_FROM`: correo remitente

### Modo sin SMTP
Si no configuras SMTP, el endpoint de contacto responde correctamente pero registra la solicitud en consola (modo simulación).

## Ejecución en desarrollo
Ejecuta frontend y backend al mismo tiempo:

```bash
npm run dev
```

Servicios:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`
- Healthcheck API: `http://localhost:8080/api/health`

## Build y produccion
Generar build del frontend:

```bash
npm run build
```

Levantar backend en modo produccion (sirviendo `client/dist`):

```bash
npm start
```

## Scripts disponibles
- `npm run dev`: ejecuta backend y frontend en paralelo
- `npm run dev:server`: backend con watch
- `npm run dev:client`: frontend Vite
- `npm run build`: build de frontend
- `npm start`: backend en modo produccion

## Estructura del proyecto

```text
in-genio/
|- client/
|  |- public/
|  |  |- assets/
|  |- src/
|  |  |- App.jsx
|  |  |- main.jsx
|  |  `- styles.css
|  |- index.html
|  `- vite.config.js
|- server/
|  `- index.js
|- .env.example
|- package.json
`- README.md
```

## Assets de marca e imagenes
Ubicacion esperada:

- `client/public/assets/logo-in-genio.png` (o `.jpg`, fallback a `.svg`)
- `client/public/assets/faena-real.jpg` (fallback a `.png` / `.svg`)
- Imagenes de carrusel en `client/public/assets/`

## API
### `GET /api/health`
Devuelve estado del servicio.

Respuesta ejemplo:

```json
{
  "ok": true,
  "service": "in-genio-api"
}
```

### `POST /api/contact`
Recibe formulario de contacto.

Body ejemplo:

```json
{
  "name": "Nombre Apellido",
  "company": "Empresa",
  "email": "correo@empresa.com",
  "message": "Mensaje del formulario"
}
```

Respuestas:
- `200`: solicitud recibida/enviada
- `400`: validacion de campos
- `500`: error interno

## Despliegue (hosting)
Puedes desplegar en Render, Railway, VPS o similar.

Checklist:
1. Configurar variables de entorno en el proveedor.
2. Build command: `npm run build`
3. Start command: `npm start`
4. Exponer puerto definido por `PORT`.
5. Ajustar `ALLOWED_ORIGIN` al dominio real del frontend.
6. Configurar SMTP real para envio de correos.

## Troubleshooting
### En PowerShell aparece error con `npm.ps1`
Usa:

```powershell
npm.cmd run dev
npm.cmd run build
```

### No se envia correo
- Verifica `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- Revisa si tu proveedor requiere TLS/SSL (`SMTP_SECURE=true`)
- Confirma `CONTACT_TO` y `CONTACT_FROM`

### El frontend no conecta con API
- Revisa `VITE_API_URL`
- Verifica `ALLOWED_ORIGIN`
- Confirma que backend este levantado

## Licencia
Uso interno y exclusivo de in-Genio.