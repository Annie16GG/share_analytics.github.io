const express = require('express');
const app = express();
const url = require('url');
const cors = require('cors');  // Importa CORS
const fs = require('fs');
app.use(cors());
const http = require('http');
const https = require('https');
const crypto = require('crypto');
app.use(express.json());
// const corsOptions = {
//   origin: 'https://portal.shareanalytics.com.mx',// Cambia esto al origen correcto
//   methods: ['GET', 'POST', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
// };
// app.use(cors(corsOptions));

var appconfig = JSON.parse(fs.readFileSync('server/api/embedConfig.json'));

      // Get the embedSecret key from Bold BI
      var embedSecret = appconfig.EmbedSecret;

      var configjson ={"DashboardId": appconfig.DashboardId, "ServerUrl": appconfig.ServerUrl, "SiteIdentifier": appconfig.SiteIdentifier, "Environment": appconfig.Environment, "EmbedType": appconfig.EmbedType};

      //Enter your BoldBI credentials here
      var userEmail = appconfig.UserEmail;

      app.post('/embeddetail/get', function (req, response) {
      var embedQuerString = req.body.embedQuerString;
      var dashboardServerApiUrl = req.body.dashboardServerApiUrl;

      embedQuerString += "&embed_user_email=" + userEmail;
      embedQuerString += "&embed_server_timestamp=" + Math.round((new Date()).getTime() / 1000);
      var embedSignature = "&embed_signature=" + GetSignatureUrl(embedQuerString);
      var embedDetailsUrl = "/embed/authorize?" + embedQuerString+embedSignature;

      var serverProtocol = url.parse(dashboardServerApiUrl).protocol == 'https:' ? https : http;
      serverProtocol.get(dashboardServerApiUrl+embedDetailsUrl, function(res){
           var str = '';
           res.on('data', function (chunk) {
               str += chunk;
           });
           res.on('end', function () {
               response.send(str);
           });
       });
       })

       function GetSignatureUrl(queryString)
       {
         var keyBytes = Buffer.from(embedSecret);
         var hmac = crypto.createHmac('sha256', keyBytes);
         data = hmac.update(queryString);
         gen_hmac= data.digest().toString('base64');

         return gen_hmac;
       }

       app.get("/",function (request, response) {

       var pathname = url.parse(request.url).pathname;
       console.log("Request for " + pathname + " received.");

       response.writeHead(200);

       if(pathname == "/") {
       html = fs.readFileSync("index.html", "utf8");
       html = html.replace("<script>","<script>var configjsonstring='"+JSON.stringify(configjson)+"';var configjson=JSON.parse(configjsonstring);");
       response.write(html);
       }
       response.end();
       })

       var server = app.listen(8080, function () {
       var host = server.address().address
       var port = server.address().port
       console.log("Example app listening at http://%s:%s", host, port)
       })