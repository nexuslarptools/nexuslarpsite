import { S3 } from 'aws-sdk';
import configJson from '../auth_config.json';
import { getConfig } from '../config';


const {
  s3Info =
  configJson.s3Info
} = getConfig();

const {
  bucketName = configJson.bucketName
}= getConfig();

 export const uploadToS3 = async (filename, filelocation) => {
  const s3 = new S3(s3Info);

  const resp = await fetch(filelocation);
  const imageBody = await resp.blob();

    const params = {
      Bucket: bucketName,
      Key: filename,
      Body: imageBody,
      ContentType: 'image/jpeg'
    };

    await s3.upload(params, function (err, data) {
       if (err) {
      console.log("Error", err);
    }
    if (data) {
      console.log("Upload Success", data.Location);
    }
   });
  };


  export const getObject = async (bucketName, key) => {
    const s3 = new S3(s3Info);
    var params = {
      Bucket: bucketName,
      Key: key
    };
    await s3.getObject(params, function(err, data) {
      return ({
        data: data,
        error: err
      })
      });
  };


  export default uploadToS3;