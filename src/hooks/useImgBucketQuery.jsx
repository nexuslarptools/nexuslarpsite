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

const useImgBucketQuery = (bucketname, key, options) => {

    const [state, setState] = useState({
        data: null,
        isLoading: true,
        error: ''
    });

    const enabled = options?.enabled ?? true;

    useEffect(() => {
      if (!enabled) {
        setState({ data: null, isLoading: false, error: '' });
        return;
      }
      const fetch = async () => {
        const s3 = new S3(s3Info);
        var bucketParams = {
          Bucket: bucketname,
        };
        await s3.listObjects(bucketParams, function(err, data) {
          setState({
            data: data,
            isLoading: false,
            error: err
          })
        });
      };
      fetch();
    },[bucketname, key, enabled]);

    return state;
};

export default useImgBucketQuery
