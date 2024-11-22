import {useEffect, useState} from "react";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand, S3 } from '@aws-sdk/client-s3';
import configJson from '../auth_config.json';
import {getConfig} from '../config';


const {
    s3Info =
        configJson.s3Info
} = getConfig();

const {
    bucketName = configJson.bucketName
} = getConfig();

const usePresignedImgQuery = (key, version) => {

    const [state, setState] = useState({
        url: null,
        isLoading: true,
        error: null
    });


    useEffect(() => {
        const fetch = async () => {

            const s3 = new S3(s3Info);
            var params = {
                Bucket: bucketName,
                Key: key,
                Expires: 60 * 5
            };

            if (version !== undefined && version !== null) {
                params.VersionId = version;
            }
            await getSignedUrl(s3, new GetObjectCommand(params)).then(function (err, url) {
                    setState(
                        {
                            url: url,
                            isLoading: false,
                            error: err
                        })
                });
        };
        fetch();
    }, [key, version]);


    return state;
};

export default usePresignedImgQuery