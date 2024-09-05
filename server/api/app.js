// server/app.js
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const formRoutes = require('./routes/formRoutes');
const permissionRoutes = require('./routes/permissionRoutes');
const boldbiRoutes = require('./routes/boldbiRoutes');
const dashboardsRoutes = require('./routes/dashboardsRoutes');
const groupesRoutes = require('./routes/groupsRoutes');
// const googleTrends = require('google-trends-api');
const categoryRoutes = require('./routes/categoryRoutes');



const path = require('path');
const morgan = require('morgan');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use(morgan('dev'));
app.use('/api', formRoutes);
app.use('/api/perm', permissionRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/groups', groupesRoutes)
// app.use('/api/dashboards', boldbiRoutes)
app.use('/api/dash', dashboardsRoutes)
app.use('/api/category', categoryRoutes)

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, '..', '..', 'public')));

// Handle requests to the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// const cors = require('cors');
// const fs = require('fs');
// const http = require('http');
// const https = require('https');
// const crypto = require('crypto');
// const url = require('url');

// app.use(cors());
// app.use(express.json());
// app.use(express.static('public'));

// // Usa el router de boldbiRoutes
// app.use('/api', boldbiRoutes);
// const appconfig = JSON.parse(fs.readFileSync('./server/api/embedConfig.json'));
// const embedSecret = appconfig.EmbedSecret;
// const configjson = {
//   "DashboardId": appconfig.DashboardId,
//   "ServerUrl": appconfig.ServerUrl,
//   "SiteIdentifier": appconfig.SiteIdentifier,
//   "Environment": appconfig.Environment,
//   "EmbedType": appconfig.EmbedType
// };

// const userEmail = appconfig.UserEmail;
// console.log(userEmail);

// app.post('/embeddetail/get', function (req, response) {
//   let embedQuerString = req.body.embedQuerString;
//   let dashboardServerApiUrl = req.body.dashboardServerApiUrl;

//   embedQuerString += "&embed_user_email=" + userEmail;
//   embedQuerString += "&embed_server_timestamp=" + Math.round((new Date()).getTime() / 1000);
//   const embedSignature = "&embed_signature=" + GetSignatureUrl(embedQuerString);
//   const embedDetailsUrl = "/embed/authorize?" + embedQuerString + embedSignature;

//   const serverProtocol = url.parse(dashboardServerApiUrl).protocol == 'https:' ? https : http;
//   serverProtocol.get(dashboardServerApiUrl + embedDetailsUrl, function (res) {
//     let str = '';
//     res.on('data', function (chunk) {
//       str += chunk;
//     });
//     res.on('end', function () {
//       response.send(str);
//     });
//   });
// });

// function GetSignatureUrl(queryString) {
//   const keyBytes = Buffer.from(embedSecret);
//   const hmac = crypto.createHmac('sha256', keyBytes);
//   const data = hmac.update(queryString);
//   return data.digest().toString('base64');
// }

// const server = app.listen(8080, 'https://share-analytics.vercel.app/', function () {
//   const host = server.address().address;
//   const port = server.address().port;
//   console.log("Example app listening at http://%s:%s", host, port);
// });
