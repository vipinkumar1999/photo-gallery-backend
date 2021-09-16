const express = require("express");
const api = express();
api.use(express.json());
const s3_keys = require("./../config/Aws_s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const DB_CLIENT = require("./../config/Database");

aws.config.update({
  accessKeyId: "AKIAXWJR6YVT6BFVURH3",
  secretAccessKey: "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",
});

const s3 = new aws.S3();

var upload = multer({
  storage: multerS3({
    s3,
    bucket: "codaglobal-vipin-s3-1",
    accessKeyId: "AKIAXWJR6YVT6BFVURH3",
    secretAccessKey: "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",
    key: function (req, file, cb) {
      cb(null, req.params.imageId);
    },
  }),
});

exports.getUsers = async (req, res, next) => {
  try {
    let query = "Select * from users where type='user'";
    DB_CLIENT.query(query, function (err, result) {
      if (err) throw err;
      if (result) {
        return res.status(200).json({
          success: true,
          data: result || [],
        });
      }
    });
  } catch (e) {
    console.log(e);
  }
};
exports.addImage = async (req, res, next) => {
  try {
    let { imageId } = req.params;
    let { access, category, accessPersons } = req.query;
    upload.single("image")(req, res, async function (err, response) {
      if (err) {
        console.log("error");
        return;
      }
      let isPrivate = "FALSE";
      if (access === "private") {
        isPrivate = "TRUE";
      }
      let newAccesspersons = [];
      if (accessPersons.length >= 1) {
        newAccesspersons = accessPersons.split("-");
      }

      let query =
        "INSERT INTO image_table (ID, ISPRIVATE, CATEGORY) VALUES ('" +
        imageId +
        "'," +
        isPrivate +
        ",'" +
        category +
        "')";
      await DB_CLIENT.query(query, function (err, result) {
        if (err) throw err;
        if (result) {
          if (newAccesspersons.length >= 1) {
            let accessQuery =
              "INSERT INTO image_access (IMAGE_ID, USER_ID) VALUES ('" +
              imageId +
              "'";
            newAccesspersons.map(async (per) => {
              accessQuery += ", '" + per + "')";
              await DB_CLIENT.query(accessQuery, function (err, result) {
                if (err) throw err;
              });
            });
          }
          return res.status(200).json({
            success: true,
          });
        }
      });
    });
  } catch (e) {
    console.log(e);
  }
};
