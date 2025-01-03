// server/app.js
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const formRoutes = require('./routes/formRoutes');
const permissionRoutes = require('./routes/permissionRoutes');
const boldbiRoutes = require('./routes/boldbiRoutes');
const dashboardsRoutes = require('./routes/dashboardsRoutes');
const groupesRoutes = require('./routes/groupsRoutes');
const viajesRoutes = require('./routes/viajesRoutes');
const tareas_ACPRoutes = require('./routes/tareas_ACPRoutes');
const estudiantesRoutes = require('./routes/estudiantesRoutes');
const agileRoutes = require('./routes/agileRoutes');

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
app.use('/api/viaje', viajesRoutes)
app.use('/api/tareas', tareas_ACPRoutes)
app.use('/api/estudiantes', estudiantesRoutes)
app.use('/api/agile', agileRoutes)

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


// var url = require("url");
// var cors = require('cors');
// var fs = require("fs");
// app.use(cors());
// var http = require("http");
// var https = require("https");
// var crypto = require('crypto');
// // Parse JSON bodies (as sent by API clients)
// app.use(express.json());

// var appconfig = JSON.parse(fs.readFileSync('server/api/embedConfig.json'));

// // Get the embedSecret key from Bold BI
// var embedSecret = appconfig.EmbedSecret;

// var configjson ={"DashboardId": appconfig.DashboardId, "ServerUrl": appconfig.ServerUrl, "SiteIdentifier": appconfig.SiteIdentifier, "Environment": appconfig.Environment, "EmbedType": appconfig.EmbedType};

// //Enter your BoldBI credentials here
// var userEmail = appconfig.UserEmail;

// app.post('/embeddetail/get', function (req, response) {
// var embedQuerString = req.body.embedQuerString;
// var dashboardServerApiUrl = req.body.dashboardServerApiUrl;

// embedQuerString += "&embed_user_email=" + userEmail;
// embedQuerString += "&embed_server_timestamp=" + Math.round((new Date()).getTime() / 1000);
// var embedSignature = "&embed_signature=" + GetSignatureUrl(embedQuerString);
// var embedDetailsUrl = "/embed/authorize?" + embedQuerString+embedSignature;

// var serverProtocol = url.parse(dashboardServerApiUrl).protocol == 'https:' ? https : http;
// serverProtocol.get(dashboardServerApiUrl+embedDetailsUrl, function(res){
//      var str = '';
//      res.on('data', function (chunk) {
//          str += chunk;
//      });
//      res.on('end', function () {
//          response.send(str);
//      });
//  });
//  })

//  function GetSignatureUrl(queryString)
//  {
//    var keyBytes = Buffer.from(embedSecret);
//    var hmac = crypto.createHmac('sha256', keyBytes);
//    data = hmac.update(queryString);
//    gen_hmac= data.digest().toString('base64');

//    return gen_hmac;
//  }

//  app.get("/",function (request, response) {

//  var pathname = url.parse(request.url).pathname;
//  console.log("Request for " + pathname + " received.");

//  response.writeHead(200);

//  if(pathname == "/") {
//  html = fs.readFileSync("index.html", "utf8");
//  html = html.replace("<script>","<script>var configjsonstring='"+JSON.stringify(configjson)+"';var configjson=JSON.parse(configjsonstring);");
//  response.write(html);
//  }
//  response.end();
//  })

//  var server = app.listen(8080, function () {
//  var host = server.address().address
//  var port = server.address().port
//  console.log("Example app listening at http://%s:%s", host, port)
//  })
