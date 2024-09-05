const cors = require('cors');
const fs = require('fs');
const http = require('http');
const https = require('https');
const crypto = require('crypto');
const url = require('url');
const express = require('express');
const boldbiRoutes = require('./server/api/routes/boldbiRoutes');  // Asegúrate de ajustar la ruta si es necesario.

const app = express();

// Configurar CORS
const corsOptions = {
  origin: 'https://share-analytics.vercel.app',  // Asegúrate de que esté apuntando a tu frontend
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));


// Middleware
app.use(express.json());
app.use(express.static('public'));

// Usa el router de boldbiRoutes
app.use('/api', boldbiRoutes);

// Configuración de BoldBI
const appconfig = JSON.parse(fs.readFileSync('./server/api/embedConfig.json'));
const embedSecret = appconfig.EmbedSecret;
const configjson = {
  "DashboardId": appconfig.DashboardId,
  "ServerUrl": appconfig.ServerUrl,
  "SiteIdentifier": appconfig.SiteIdentifier,
  "Environment": appconfig.Environment,
  "EmbedType": appconfig.EmbedType
};

const userEmail = appconfig.UserEmail;

// Ruta para obtener los detalles del embed
app.post('/embeddetail/get', function (req, res) {
  let embedQuerString = req.body.embedQuerString;
  let dashboardServerApiUrl = req.body.dashboardServerApiUrl;

  embedQuerString += "&embed_user_email=" + userEmail;
  embedQuerString += "&embed_server_timestamp=" + Math.round((new Date()).getTime() / 1000);
  const embedSignature = "&embed_signature=" + GetSignatureUrl(embedQuerString);
  const embedDetailsUrl = "/embed/authorize?" + embedQuerString + embedSignature;

  const serverProtocol = url.parse(dashboardServerApiUrl).protocol === 'https:' ? https : http;
  serverProtocol.get(dashboardServerApiUrl + embedDetailsUrl, function (response) {
    let str = '';
    response.on('data', function (chunk) {
      str += chunk;
    });
    response.on('end', function () {
      res.status(200).send(str);
    });
  }).on('error', (e) => {
    res.status(500).send(e.message);
  });
});

// Función para generar la firma del embed
function GetSignatureUrl(queryString) {
  const keyBytes = Buffer.from(embedSecret);
  const hmac = crypto.createHmac('sha256', keyBytes);
  const data = hmac.update(queryString);
  return data.digest().toString('base64');
}

// Exportar la función handler para que Vercel la utilice
module.exports = app;
