const fs = require('fs');
const crypto = require('crypto');
const url = require('url');
const http = require('http');
const https = require('https');
const express = require('express');
const cors = require('cors');  // Importa CORS
const boldbiRoutes = require('./server/routes/boldbiRoutes');

// Inicializa la aplicación Express
const app = express();

// Configura CORS
const corsOptions = {
  origin: 'https://share-analytics.vercel.app',  // Tu dominio en Vercel
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));  // Aplica la configuración de CORS

app.use(express.json());
app.use(express.static('public'));
app.use('/api', boldbiRoutes);

// Exportar la función handler para que funcione como una API en Vercel
export default function handler(req, res) {
  if (req.method === 'POST') {
    const appconfig = JSON.parse(fs.readFileSync('/embedConfig.json'));
    const embedSecret = appconfig.EmbedSecret;
    const configjson = {
      "DashboardId": appconfig.DashboardId,
      "ServerUrl": appconfig.ServerUrl,
      "SiteIdentifier": appconfig.SiteIdentifier,
      "Environment": appconfig.Environment,
      "EmbedType": appconfig.EmbedType
    };

    const userEmail = appconfig.UserEmail;
    console.log(userEmail);

    let embedQuerString = req.body.embedQuerString;
    let dashboardServerApiUrl = req.body.dashboardServerApiUrl;

    embedQuerString += "&embed_user_email=" + userEmail;
    embedQuerString += "&embed_server_timestamp=" + Math.round((new Date()).getTime() / 1000);
    const embedSignature = "&embed_signature=" + GetSignatureUrl(embedQuerString, embedSecret);
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
  } else {
    res.status(405).send('Method Not Allowed');
  }
}

function GetSignatureUrl(queryString, embedSecret) {
  const keyBytes = Buffer.from(embedSecret);
  const hmac = crypto.createHmac('sha256', keyBytes);
  const data = hmac.update(queryString);
  return data.digest().toString('base64');
}
