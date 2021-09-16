const express = require("express");
const api = express();
api.use(express.json());
const mysql = require("mysql");
const DB_CLIENT = require("./../config/Database");
const aws = require("aws-sdk");
const s3 = new aws.S3();
const s3_keys = require("./../config/Aws_s3");

exports.getImageIds = async (req, res, next) => {
  try {
    let imageIds = [];
    let { userId } = req.params;
    let publicImageIdQuery = "select ID from image_table where ISPRIVATE=false";
    let privateImageQuery =
      "select ID from image_access where USER_ID='" + userId + "'";

    await DB_CLIENT.query(publicImageIdQuery, function (err, result) {
      if (err) throw err;
      if (result) {
        console.log(result);
        result.map((r) => {
          imageIds.push(r.ID);
        });

         DB_CLIENT.query(privateImageQuery, function (err, result) {
          if (err) throw err;
          if (result && result.length >= 1) {
            result.map((r) => {
              imageIds.push(r.IMAGE_ID);
            });
          }
        });
      }
      return res.status(200).json({
        success: true,
        imageIds,
      });
    });
  } catch (e) {
    console.log(e);
  }
};

exports.getImage = async (req, res, next) => {
  try {
    const url = s3.getSignedUrl("getObject", {
      Bucket: s3_keys.BUCKET_NAME,
      Key: req.params.imageId,
    });
    console.log(url);

    return res.status(200).json({
      success: true,
      url,
    });
  } catch (e) {
    console.log(e);
  }
};
