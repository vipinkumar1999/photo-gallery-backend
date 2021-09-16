const express = require("express");
const api = express();
api.use(express.json());
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
// var jwtSecret = require("./../config/JWT").secret;
const mysql = require("mysql");
const DB_CLIENT = require("./../config/Database");

exports.registerUser = async (req, res, next) => {
  try {
    let { email, password, name, type } = req.body;
    let query = "Select * from users where EMAIL = " + "'" + email + "'";

    let emailExits = await DB_CLIENT.query(query, async function (err, result) {
      if (err) throw err;

      if (result.length >= 1) {
        return res.status(200).json({
          success: false,
          message: "Email already exists",
        });
      }

      var hashedPassword = bcrypt.hashSync(
        password,
        bcrypt.genSaltSync(8),
        null
      );

      var sql =
        "INSERT INTO users (NAME, EMAIL, TYPE, PASSWORD) VALUES ('" +
        name +
        "','" +
        email +
        "','" +
        type +
        "','" +
        hashedPassword +
        "')";

      await DB_CLIENT.query(sql, async function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        await DB_CLIENT.query(query, function (err, result) {
          if (err) throw err;
          return res.status(200).json({
            success: true,
            message: "User added",
            user: result[0],
          });
        });
      });
    });
  } catch (error) {
    console.error("registerUser:", error);
    return res.status(500).json({
      success: false,
      msg: "Invalid data",
    });
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    let hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

    let query = "Select * from users where EMAIL = " + "'" + email + "'";

    await DB_CLIENT.query(query, function (err, result) {
      if (err) throw err;
      let user = result[0];
      if (user) {
        console.log("User found");
        let validPassword = bcrypt.compareSync(password, user.PASSWORD);
        if (validPassword) {
          // let userObj = {
          //   _id: user.ID,
          //   email: user.EMAIL,
          // };
          // let token = jwt.sign(userObj, jwtSecret);
          return res.status(200).json({
            success: true,
            user,
            //   token,
          });
        } else {
          return res.status(200).json({
            success: false,
            message: "Inavlid password",
          });
        }
      } else {
        console.log("User not found");
        return res.status(200).json({
          success: false,
          message: "User not found",
        });
      }
    });
  } catch (error) {
    console.error("loginUser:", error);
    return res.status(500).json({
      success: false,
      msg: "Invalid data",
    });
  }
};
