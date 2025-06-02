import { Upload } from '@aws-sdk/lib-storage';
import { S3 } from '@aws-sdk/client-s3';
import { getConfig } from '../config';
import { logError } from './errorHandler';

// Get configuration from config.jsx which now uses environment variables
const config = getConfig();
const s3Info = config.s3Info;
const bucketName = config.bucketName;

s3Info.credentials = {
    accessKeyId: import.meta.env.VITE_MINIO_CREDS_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_MINIO_CREDS_SECRET_KEY
};

/**
 * Upload a file to S3 with proper error handling
 * @param {string} filename - The name to give the file in S3
 * @param {string} filelocation - The URL or path to the file to upload
 * @returns {Promise<Object>} - Promise resolving to the upload result
 * @throws {Error} - If the upload fails
 */
export const uploadToS3 = async (filename, filelocation) => {
  try {
    const s3 = new S3(s3Info);

    const resp = await fetch(filelocation);
    const imageBody = await resp.blob();

    const params = {
      Bucket: bucketName,
      Key: filename,
      Body: imageBody,
      ContentType: 'image/jpeg'
    };

    const upload = new Upload({
      client: s3,
      params
    });

    const result = await upload.done();

    // Log success without sensitive details
    if (process.env.NODE_ENV === 'development') {
      console.log(`Upload Success: ${filename}`);
    }

    return result;
  } catch (error) {
    // Log error safely
    logError(error, `uploadToS3: ${filename}`);
    throw error;
  }
};

/**
 * Get an object from S3 with proper error handling
 * @param {string} bucket - The S3 bucket name
 * @param {string} key - The key of the object to get
 * @returns {Promise<Object>} - Promise resolving to the object data
 * @throws {Error} - If the get operation fails
 */
export const getObject = async (bucket, key) => {
  try {
    const s3 = new S3(s3Info);
    const params = {
      Bucket: bucket,
      Key: key
    };

    const result = await s3.getObject(params);
    return result;
  } catch (error) {
    // Log error safely
    logError(error, `getObject: ${bucket}/${key}`);
    throw error;
  }
};

export default uploadToS3;
