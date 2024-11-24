import { useEffect, useState } from "react";
import { S3 } from '@aws-sdk/client-s3';
import configJson from '../auth_config.json';
import { getConfig } from '../config';


const {
    s3Info =
    configJson.s3Info
  } = getConfig();

s3Info.credentials = {
    accessKeyId: import.meta.env.VITE_MINIO_CREDS_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_MINIO_CREDS_SECRET_KEY
};

console.log(s3Info);

const useImgQuery = (bucketname, key) => {

    const [state, setState] = useState({
        data: null,
        isLoading: true,
        error: ''
    });


    useEffect(() => {
   const fetch = async () => {
   
    const s3 = new S3(s3Info);
    var params = {
      Bucket: bucketname,
      Key: key
    };
    await s3.getObject(params, function(err, data) {
        setState(
            {
                data: data,
                isLoading: false,
                error: err
            })
      });
};
     fetch();
    },[bucketname, key]);

    return state;
};

export default useImgQuery
