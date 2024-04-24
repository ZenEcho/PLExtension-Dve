import { dbHelper } from '@/assets/js/db';
import { getChromeStorage } from '@/assets/js/public';
import { initObjectStorageClient } from '@/assets/js/authObgStorage';
import HttpRequester from '@/assets/js/httpRequester';
import { ListObjectsV2Command, DeleteObjectCommand } from "@aws-sdk/client-s3";
export async function getNetworkImagesData(networkPage = 1) {
    try {
        const ProgramConfigurations = await getChromeStorage("ProgramConfiguration");
        const actions = {
            'Lsky': async () => {
                try {
                    const response = await HttpRequester.get(`https://${ProgramConfigurations.Host}/api/v1/images?page=${networkPage}`, {
                        headers: {
                            "Accept": "application/json",
                            "Authorization": ProgramConfigurations.Token
                        }
                    });
                    let imagesData = response.data.data.data;
                    let transformedData = imagesData.map(imageData => ({
                        "file_size": imageData.size * 1024,
                        "img_file_size": `宽:${imageData.width},高:${imageData.height}`,
                        "key": imageData.key,
                        "original_file_name": imageData.name,
                        "uploadExe": ProgramConfigurations.Program,
                        "uploadTime": imageData.date,
                        "upload_domain_name": ProgramConfigurations.Host,
                        "url": imageData.links.url,
                    }));
                    return {
                        data: transformedData,
                        page: response.data.data.current_page,
                        pageSize: response.data.data.per_page,
                        total: response.data.data.total,
                        type: "success"
                    };
                } catch (error) {
                    console.error("请求错误:", error);
                    if (error.response) {
                        let errorMessage;
                        switch (error.response.status) {
                            case 401:
                                errorMessage = "未登录或授权失败";
                                break;
                            case 403:
                                errorMessage = "管理员关闭了接口功能或没有该接口权限";
                                break;
                            case 429:
                                errorMessage = "超出请求配额，请求受限";
                                break;
                            case 500:
                                errorMessage = "服务端出现异常";
                                break;
                            default:
                                errorMessage = `未知错误，状态码: ${error.response.status}`;
                        }
                        return { message: errorMessage, type: "error" };
                    }
                }
            },
            'SM_MS': async () => {
                const response = await HttpRequester.get(`https://${ProgramConfigurations.Host}/api/v2/upload_history?page=${networkPage}`, {
                    headers: {
                        "Accept": "multipart/form-data",
                        "Authorization": ProgramConfigurations.Token
                    }
                });
                let imagesData = response.data.data
                if (!response.data.data) {
                    return { message: response.data.message, type: "error" }
                }
                let transformedData = imagesData.map(imageData => ({
                    "file_size": imageData.size,
                    "img_file_size": `宽:${imageData.width},高:${imageData.height}`,
                    "key": imageData.hash,
                    "original_file_name": imageData.filename,
                    "uploadExe": ProgramConfigurations.Program,
                    "uploadTime": imageData.created_at,
                    "upload_domain_name": ProgramConfigurations.Host,
                    "url": imageData.url,
                }));
                // 创建一个新的对象，包含图片数据数组和分页信息
                return {
                    data: transformedData,
                    page: response.data.CurrentPage,
                    pageSize: response.data.PerPage,
                    total: response.data.TotalPages,
                    type: "success"
                };
            },
            'Hellohao': async () => {
                const response = await HttpRequester.post(`https://${ProgramConfigurations.Host}/api/getimglist/`, {
                    "pageNum": networkPage,
                    "pageSize": 20,
                    "token": ProgramConfigurations.Token,
                }, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
                let imagesData = response.data.data.rows
                let transformedData = imagesData.map(imageData => ({
                    "file_size": imageData.sizes,
                    "img_file_size": `宽:不支持,高:不支持`,
                    "key": imageData.delkey,
                    "original_file_name": imageData.imgurl.match(/\/([^\/]+)\/?$/)[1],
                    "uploadExe": ProgramConfigurations.Program,
                    "uploadTime": imageData.updatetime,
                    "upload_domain_name": ProgramConfigurations.Host,
                    "url": imageData.imgurl,
                }));
                return {
                    data: transformedData,
                    page: networkPage,
                    pageSize: 20,
                    total: response.data.data.total,
                    type: "success"
                };
            },
            'Tencent_COS': async () => {
                // 腾讯云cos拼接
                if (!ProgramConfigurations.custom_DomainName) {
                    ProgramConfigurations.custom_DomainName = "https://" + ProgramConfigurations.Bucket + ".cos." + ProgramConfigurations.Region + ".myqcloud.com/";
                }
                try {
                    const ObjectStorage = await initObjectStorageClient();
                    if (ObjectStorage.type == "error") {
                        return { error: ObjectStorage.error, message: ObjectStorage.message, type: "error" };
                    }
                    const getBucketAsync = (params) => {
                        return new Promise((resolve, reject) => {
                            ObjectStorage.getBucket(params, function (err, data) {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(data);
                                }
                            });
                        });
                    };
                    const data = await getBucketAsync({
                        Bucket: ProgramConfigurations.Bucket,
                        Region: ProgramConfigurations.Region,
                        Prefix: ProgramConfigurations.UploadPath, // 列出某某开头文件
                        MaxKeys: 1000,
                    });
                    let imagesData = data.Contents
                    let transformedData = imagesData.map(imageData => ({
                        "file_size": imageData.Size,
                        "img_file_size": `宽:不支持,高:不支持`,
                        "key": imageData.Key,
                        "original_file_name": imageData.Key,
                        "uploadExe": ProgramConfigurations.Program,
                        "uploadTime": imageData.LastModified,
                        "upload_domain_name": ProgramConfigurations.custom_DomainName,
                        "url": ProgramConfigurations.custom_DomainName + imageData.Key,
                    }));
                    return {
                        data: transformedData,
                        page: 1,
                        pageSize: 20,
                        total: imagesData.length,
                        type: "success"
                    };
                } catch (error) {
                    return { error: error, message: `COS获取数据失败：${error.message}`, type: "error" };
                }
            },
            'Aliyun_OSS': async () => {
                //阿里云oss拼接
                if (!ProgramConfigurations.custom_DomainName) {
                    ProgramConfigurations.custom_DomainName = "https://" + ProgramConfigurations.Bucket + "." + ProgramConfigurations.Endpoint + "/"
                }

                try {
                    const ObjectStorage = await initObjectStorageClient();
                    if (ObjectStorage.type == "error") {
                        return { error: ObjectStorage.error, message: ObjectStorage.message, type: "error" };
                    }
                    const result = await ObjectStorage.listV2({
                        "max-keys": 1000,
                        prefix: ProgramConfigurations.UploadPath
                    });
                    let imagesData = result.objects
                    let transformedData = imagesData.map(imageData => ({
                        "file_size": imageData.size,
                        "img_file_size": `宽:不支持,高:不支持`,
                        "key": imageData.name,
                        "original_file_name": imageData.name,
                        "uploadExe": ProgramConfigurations.Program,
                        "uploadTime": imageData.lastModified,
                        "upload_domain_name": ProgramConfigurations.custom_DomainName,
                        "url": ProgramConfigurations.custom_DomainName + imageData.name,
                    }));
                    return {
                        data: transformedData,
                        page: 1,
                        pageSize: 20,
                        total: imagesData.length,
                        type: "success"
                    };
                } catch (error) {
                    return { error: error, message: `OSS获取数据失败：${error.message}`, type: "error" };
                }
            },
            'AWS_S3': async () => {
                //AWS S3拼接
                if (!ProgramConfigurations.custom_DomainName) {
                    ProgramConfigurations.custom_DomainName = "https://s3." + ProgramConfigurations.Region + ".amazonaws.com/" + ProgramConfigurations.Bucket + "/"
                }
                try {
                    const ObjectStorage = await initObjectStorageClient();
                    if (ObjectStorage.type == "error") {
                        return { error: ObjectStorage.error, message: ObjectStorage.message, type: "error" };
                    }
                    const params = {
                        Bucket: ProgramConfigurations.Bucket,
                        Prefix: ProgramConfigurations.UploadPath,
                        MaxKeys: 1000, // 使用数字而非字符串
                    };
                    const command = new ListObjectsV2Command(params);
                    const response = await ObjectStorage.send(command);
                    let imagesData = response.Contents
                    let transformedData = imagesData.map(imageData => ({
                        "file_size": imageData.Size,
                        "img_file_size": `宽:不支持,高:不支持`,
                        "key": imageData.Key,
                        "original_file_name": imageData.Key,
                        "uploadExe": ProgramConfigurations.Program,
                        "uploadTime": imageData.LastModified,
                        "upload_domain_name": ProgramConfigurations.custom_DomainName,
                        "url": ProgramConfigurations.custom_DomainName + imageData.Key,
                    }));
                    return {
                        data: transformedData,
                        page: 1,
                        pageSize: 20,
                        total: imagesData.length,
                        type: "success"
                    };
                } catch (error) {
                    return { error: error, message: `S3获取数据失败：${error.message}`, type: "error" };
                }
            },
            'GitHub': async () => {
                try {
                    const response = await HttpRequester.get(`https://api.github.com/repos/${ProgramConfigurations.Owner}/${ProgramConfigurations.Repository}/contents/${ProgramConfigurations.UploadPath}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": 'Bearer ' + ProgramConfigurations.Token
                        }
                    });
                    let imagesData = response.data;
                    let transformedData = imagesData.map(imageData => ({
                        "file_size": imageData.size,
                        "img_file_size": `宽:不支持,高:不支持`,
                        "key": imageData.sha,
                        "original_file_name": imageData.name,
                        "uploadExe": ProgramConfigurations.Program,
                        "uploadTime": "GitHub不支持",
                        "upload_domain_name": ProgramConfigurations.Program,
                        "url": imageData.download_url,
                    }));
                    return {
                        data: transformedData,
                        page: 1,
                        pageSize: 20,
                        total: imagesData.length,
                        type: "success"
                    };
                } catch (error) {
                    console.error("请求错误:", error);
                    if (error.response) {
                        // 根据状态码提供更具体的错误信息
                        let errorMessage = "";
                        switch (error.response.status) {
                            case 400:
                                errorMessage = "请求无效，请检查请求格式。";
                                break;
                            case 401:
                                errorMessage = "未授权：访问被拒绝，可能是因为Token无效。";
                                break;
                            case 403:
                                errorMessage = "禁止访问：可能是因为Token没有足够的权限。";
                                break;
                            case 404:
                                errorMessage = "资源未找到：请检查仓库名或路径是否正确。";
                                break;
                            case 422:
                                errorMessage = "无法处理的实体：请求格式正确，但是由于含有语义错误，无法响应。";
                                break;
                            case 500:
                                errorMessage = "内部服务器错误。";
                                break;
                            default:
                                errorMessage = `未知错误，状态码：${error.response.status}`;
                        }
                        return { error: error, message: errorMessage, type: "error" };
                    }
                }


            },
        };

        if (actions.hasOwnProperty(ProgramConfigurations.Program)) {
            return await actions[ProgramConfigurations.Program]();
        } else {
            return { message: "没有数据", type: "error" }
        }
    } catch (error) {
        if (error.request) {
            // 请求已经发起，但没有收到响应
            return { error: error, message: "请求没有响应", type: "error" };
        } else {
            // 发送请求时出了点问题
            return { error: error, message: `请求发送失败: ${error.message}`, type: "error" };
        }
    }
}
function deleteFromDb(key) {
    return dbHelper("Uploads").then(result => {
        const { db } = result;
        return db.delete(key);
    });
}
async function deleteFunction(imgData) {
    const ProgramConfigurations = await getChromeStorage("ProgramConfiguration");
    const actions = {
        // 示例：使用并发控制删除GitHub上的图片
        'Lsky': async () => {
            try {
                const response = await HttpRequester.delete(`https://${ProgramConfigurations.Host}/api/v1/images/${imgData.key}`, {
                    headers: {
                        "Accept": "application/json",
                        "Authorization": ProgramConfigurations.Token
                    }
                });
                return { key: imgData.key, filename: imgData.filename, message: response.data.message, type: "success" };
            } catch (error) {
                let errorMessage;
                switch (error.response.status) {
                    case 401:
                        errorMessage = "未登录或授权失败";
                        break;
                    case 403:
                        errorMessage = "管理员关闭了接口功能或没有该接口权限";
                        break;
                    case 429:
                        errorMessage = "超出请求配额，请求受限";
                        break;
                    case 500:
                        errorMessage = "服务端出现异常";
                        break;
                    default:
                        errorMessage = `未知错误，状态码: ${error.response.status}`;
                }
                return { key: imgData.key, filename: imgData.filename, error: error, message: errorMessage, type: "error" };
            }
        },
        'SM_MS': async () => {
            try {
                const response = await HttpRequester.get(`https://${ProgramConfigurations.Host}/api/v2/delete/${imgData.key}`, {
                    headers: {
                        "Accept": "multipart/form-data",
                        "Authorization": ProgramConfigurations.Token
                    }
                });

                if (response.data.message === "File already deleted.") {
                    return { key: imgData.key, filename: imgData.filename, message: imgData.filename + "：删除失败，请清理缓存或刷新页面！", type: "info" };
                } else {
                    return { key: imgData.key, filename: imgData.filename, message: response.data.message, type: response.data.code };
                }
            } catch (error) {
                console.log(error);
                return { key: imgData.key, filename: imgData.filename, error: error, message: imgData.filename + "删除失败", type: "error" };
            }
        },
        'Hellohao': async () => {
            try {
                const response = await HttpRequester.post(`https://${ProgramConfigurations.Host}/api/deleteimg/`, {
                    "delkey": imgData.key,
                    "token": ProgramConfigurations.Token,
                }, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
                return response.data.code === 200 ? { key: imgData.key, filename: imgData.filename, message: response.data.data, type: "success" } : { key: imgData.key, filename: imgData.filename, message: response.data.msg, type: "info" };
            } catch (error) {
                console.log(error);
                return { key: imgData.key, filename: imgData.filename, error: error, message: imgData.filename + "删除失败", type: "error" };

            }
        },
        'Tencent_COS': async () => {
            try {
                const ObjectStorage = await initObjectStorageClient();
                if (ObjectStorage.type == "error") {
                    return { error: ObjectStorage.error, message: ObjectStorage.message };
                }
                await ObjectStorage.deleteObject({
                    Bucket: ProgramConfigurations.Bucket,
                    Region: ProgramConfigurations.Region,
                    Key: imgData.key,
                });
                return { key: imgData.key, filename: imgData.filename, message: "删除成功", type: "success" };
            } catch (error) {
                return { key: imgData.key, filename: imgData.filename, error: error, message: imgData.filename + "删除失败", type: "error" };
            }
        },
        'Aliyun_OSS': async () => {
            try {
                const ObjectStorage = await initObjectStorageClient();
                if (ObjectStorage.type == "error") {
                    return { error: ObjectStorage.error, message: ObjectStorage.message };
                }
                await ObjectStorage.delete(imgData.key);
                return { key: imgData.key, filename: imgData.filename, message: "删除成功", type: "success" };
            } catch (error) {
                return { key: imgData.key, filename: imgData.filename, error: error, message: imgData.filename + "删除失败", type: "error" };
            }
        },
        'AWS_S3': async () => {
            try {
                const ObjectStorage = await initObjectStorageClient();
                if (ObjectStorage.type == "error") {
                    return { error: ObjectStorage.error, message: ObjectStorage.message };
                }
                const deleteParams = { Bucket: ProgramConfigurations.Bucket, Key: imgData.key };
                await ObjectStorage.send(new DeleteObjectCommand(deleteParams));
                return { key: imgData.key, filename: imgData.filename, message: "删除成功", type: "success" };
            } catch (error) {
                console.log(error);
                return { key: imgData.key, filename: imgData.filename, error: error, message: imgData.filename + "删除失败", type: "error" };
            }
        },
        'GitHub': async () => {
            try {
                await HttpRequester.delete(`https://api.github.com/repos/${ProgramConfigurations.Owner}/${ProgramConfigurations.Repository}/contents/${ProgramConfigurations.UploadPath}${imgData.filename}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": 'Bearer ' + ProgramConfigurations.Token
                    },
                    data: JSON.stringify({
                        message: 'Delete file',
                        sha: imgData.key
                    })
                });
                return { key: imgData.key, filename: imgData.filename, message: "删除成功", type: "success" };
            } catch (error) {
                console.error("请求错误:", error);
                if (error.response) {
                    // 根据状态码提供更具体的错误信息
                    let errorMessage = "";
                    switch (error.response.status) {
                        case 400:
                            errorMessage = "请求无效，请检查请求格式。";
                            break;
                        case 401:
                            errorMessage = "未授权：访问被拒绝，可能是因为Token无效。";
                            break;
                        case 403:
                            errorMessage = "禁止访问：可能是因为Token没有足够的权限。";
                            break;
                        case 404:
                            errorMessage = "资源未找到：请检查仓库名或路径是否正确。";
                            break;
                        case 422:
                            errorMessage = "无法处理的实体：请求格式正确，但是由于含有语义错误，无法响应。";
                            break;
                        case 500:
                            errorMessage = "内部服务器错误。";
                            break;
                        default:
                            errorMessage = `未知错误，状态码：${error.response.status}`;
                    }
                    return { key: imgData.key, filename: imgData.filename, error: error, message: errorMessage, type: "error" };
                }
            }
        },
    };
    if (actions.hasOwnProperty(ProgramConfigurations.Program)) {
        return await actions[ProgramConfigurations.Program]();
    } else {
        return { message: "没有数据", type: "error" }
    }
}
export async function deleteImagesData(keys, callback) {
    const dataLoadingMode = localStorage.getItem('dataLoadingMode');
    const ProgramConfigurations = await getChromeStorage("ProgramConfiguration")
    const maxConcurrentRequests = ProgramConfigurations.Program === 'GitHub' ? 1 : 3;
    if (dataLoadingMode === "local") {
        const deleteImage = async (imgData) => {
            try {
                await deleteFromDb(imgData.key);
                callback({ key: imgData.key, filename: imgData.filename, message: "删除成功", type: "success" });

            } catch (error) {
                console.log(error);
                callback({ key: imgData.key, filename: imgData.filename, error: error, message: "删除失败", type: "error" });
            }
        }
        return await concurrentControl(keys, deleteImage, 1, result => {
            callback(result);
        });
    } else {
        const deleteImage = async (imgData) => {
            return await deleteFunction(imgData);
        }
        await concurrentControl(keys, deleteImage, maxConcurrentRequests, result => {
            callback(result);
        });

    };
}

/**
 * 并发执行异步任务的函数
 * @param {Array} items - 待处理的项
 * @param {Function} fn - 处理每一项的异步函数
 * @param {Number} limit - 并发限制数
 */
// async function concurrentControl(items, fn, limit) {
//     let index = 0;
//     let results = [];
//     let active = [];

//     const execute = async () => {
//         while (index < items.length) {
//             let item = items[index++];
//             let promise = Promise.resolve().then(() => fn(item)).catch(e => e);
//             results.push(promise);

//             let e = promise.then(() => active.splice(active.indexOf(e), 1));
//             active.push(e);

//             if (active.length >= limit) {
//                 await Promise.race(active);
//             }
//         }
//     };

//     await execute();
//     return Promise.all(results);
// }

async function concurrentControl(items, fn, limit, callback) {
    let index = 0;
    let active = [];

    const execute = async () => {
        while (index < items.length) {
            if (active.length >= limit) {
                await Promise.race(active);
            }
            let item = items[index++];
            let promise = Promise.resolve().then(() => fn(item)).catch(e => e);

            // 当单个任务完成时进行通知
            promise.then(result => {
                callback(result)
                active.splice(active.indexOf(promise), 1);
            });

            active.push(promise);
        }
    };

    await execute();
    // await Promise.all(active); 
}


