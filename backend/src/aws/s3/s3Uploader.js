const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.S3_REGION,
});

const s3 = new AWS.S3();

// const uploadFile = async (bucketName, fileKey, fileStream, contentType) => {
//   const params = {
//     Bucket: bucketName,
//     Key: fileKey,
//     Body: fileStream,
//     ContentType: contentType,
//   };
//   return s3.upload(params).promise();
// };

const getPresignedUrl = async (bucketName, fileKey, fileType) => {
  const params = {
    Bucket: bucketName,
    Key: fileKey,
    Expires: 60,
    ContentType: fileType,
  };
  return s3.getSignedUrlPromise("putObject", params);
};

module.exports = { getPresignedUrl , s3};
