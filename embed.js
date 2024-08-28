const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const http = require('http');
const https = require('https');
const crypto = require('crypto');
const url = require('url');
const boldbiRoutes = require('./server/routes/boldbiRoutes');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Usa el router de boldbiRoutes
app.use('/api', boldbiRoutes);

const appconfig = JSON.parse(fs.readFileSync('./embedConfig.json'));
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

app.post('/embeddetail/get', function (req, response) {
  let embedQuerString = req.body.embedQuerString;
  let dashboardServerApiUrl = req.body.dashboardServerApiUrl;

  embedQuerString += "&embed_user_email=" + userEmail;
  embedQuerString += "&embed_server_timestamp=" + Math.round((new Date()).getTime() / 1000);
  const embedSignature = "&embed_signature=" + GetSignatureUrl(embedQuerString);
  const embedDetailsUrl = "/embed/authorize?" + embedQuerString + embedSignature;

  const serverProtocol = url.parse(dashboardServerApiUrl).protocol == 'https:' ? https : http;
  serverProtocol.get(dashboardServerApiUrl + embedDetailsUrl, function (res) {
    let str = '';
    res.on('data', function (chunk) {
      str += chunk;
    });
    res.on('end', function () {
      response.send(str);
    });
  });
});

function GetSignatureUrl(queryString) {
  const keyBytes = Buffer.from(embedSecret);
  const hmac = crypto.createHmac('sha256', keyBytes);
  const data = hmac.update(queryString);
  return data.digest().toString('base64');
}

const server = app.listen(8080, '0.0.0.0', function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
