const mysql = require("mysql");

var client = mysql.createConnection({
  host: "vipin-db-1.cilxjjdyc3mv.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "vipin2107",
  port: "3306",
  database: "photo_gallery_db",
});

module.exports = client;
