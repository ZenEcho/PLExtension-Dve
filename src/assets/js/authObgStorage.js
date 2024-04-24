
import { getChromeStorage } from '@/assets/js/public';
import COS from 'cos-js-sdk-v5';
import OSS from 'ali-oss';
import { S3Client } from "@aws-sdk/client-s3";
export async function initObjectStorageClient() {
    const ProgramConfigurations = await getChromeStorage("ProgramConfiguration");
    const actions = {
        'Tencent_COS':  () => {
            try {
                let getAuthorization = function (options, callback) {
                    let authorization = COS.getAuthorization({
                        SecretId: ProgramConfigurations.SecretId,
                        SecretKey: ProgramConfigurations.SecretKey,
                        Method: options.Method,
                        Pathname: options.Pathname,
                        Query: options.Query,
                        Headers: options.Headers,
                        Expires: 900,
                    });
                    callback({ Authorization: authorization });
                };
                return new COS({
                    getAuthorization: getAuthorization,
                    UploadCheckContentMd5: true,
                    protocol: 'https:' // 强制使用 HTTPS 协议
                });

            } catch (error) {
                return { error: error, message: "腾讯云对象存储,初始化失败！", type: "error" };
            }

        },
        'Aliyun_OSS':  () => {
            try {
                return new OSS({
                    accessKeyId: ProgramConfigurations.SecretId,
                    accessKeySecret: ProgramConfigurations.SecretKey,
                    bucket: ProgramConfigurations.Bucket,
                    endpoint: ProgramConfigurations.Endpoint,
                    region: ProgramConfigurations.Region,
                    secure: true //强制https
                });
            } catch (error) {
                return { error: error, message: "阿里云对象存储,初始化失败！", type: "error" };
            }
        },
        'AWS_S3':  () => {
            try {
                if (!ProgramConfigurations.Endpoint) {
                    ProgramConfigurations.Endpoint = "https://s3." + ProgramConfigurations.Region + ".amazonaws.com/"
                }
                return new S3Client({
                    region: ProgramConfigurations.Region,
                    credentials: {
                        accessKeyId: ProgramConfigurations.SecretId,
                        secretAccessKey: ProgramConfigurations.SecretKey
                    },
                    endpoint: ProgramConfigurations.Endpoint,
                });
           
            } catch (error) {
                return { error: error, message: `S3对象存储,初始化失败！`, type: "error" };
            }
        },

    };
    console.log(ProgramConfigurations.Program);
    if (actions.hasOwnProperty(ProgramConfigurations.Program)) {
        return await actions[ProgramConfigurations.Program]();
    } else {
        return { message: "好像没有这个对象存储", type: "error" }
    }
}