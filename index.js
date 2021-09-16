var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const mysql = require("mysql");
const DB_CLIENT = require("./config/Database");
var path = require("path");

DB_CLIENT.connect(function (err) {
  if (err) {
    console.error("Database connection failed" + err.stack);
    return;
  }
  console.log("connected to database");
});

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "POST, GET, PUT,PATCH, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-api-key"
  );
  next();
});

app.use("/api", require("./routes/routes"));

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Node backend listening at http://%s:%s", host, port);
});
