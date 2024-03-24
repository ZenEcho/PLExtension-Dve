import { dbHelper } from '@/assets/js/db';
import { getChromeStorage } from '@/assets/js/public';
import HttpRequester from '@/assets/js/httpRequester';
export async function getNetworkImagesData(Program = 1) {
    // return new Promise(async (resolve, reject) => {
    //     const ProgramConfigurations = await getChromeStorage("ProgramConfiguration");
    //     const actions = {
    //         'Lsky': () => {

    //             HttpRequester.get("https://" + ProgramConfigurations.Host + "/api/v1/images?page=" + Program, {
    //                 headers: {
    //                     "Accept": "application/json",
    //                     "Authorization": ProgramConfigurations.Token
    //                 }
    //             })
    //                 .then(res => {
    //                     console.log(res.data);
    //                     let imagesData = res.data.data.data
    //                     let transformedData = imagesData.map(imageData => {
    //                         return {
    //                             "file_size": imageData.size * 1024,
    //                             "img_file_size": `宽:${imageData.width},高:${imageData.height}`,
    //                             "key": imageData.key,
    //                             "original_file_name": imageData.name,
    //                             "uploadExe": ProgramConfigurations.Program,
    //                             "uploadTime": imageData.date,
    //                             "upload_domain_name": ProgramConfigurations.Host,
    //                             "url": imageData.links.url,
    //                         };
    //                     });
    //                     transformedData.page = res.data.data.current_page
    //                     transformedData.pageSize = res.data.data.per_page
    //                     transformedData.total = res.data.data.total;
    //                     resolve(transformedData);
    //                 })
    //                 .catch(error => {
    //                     reject(error);
    //                 });
    //         },
    //         'SM_MS': () => {
    //             // SM_MS的操作
    //         },
    //         'Hellohao': () => {
    //             // Hellohao的操作
    //         },
    //         'Tencent_COS': () => {
    //             // Tencent_COS的操作
    //         },
    //         'Aliyun_OSS': () => {
    //             // Aliyun_OSS的操作
    //         },
    //         'AWS_S3': () => {
    //             // AWS_S3的操作
    //         },
    //         'GitHubUP': () => {
    //             // GitHubUP的操作
    //         },
    //     };
    //     if (actions.hasOwnProperty(ProgramConfigurations.Program)) {
    //         actions[ProgramConfigurations.Program]();
    //     } else {
    //         reject("没有数据");
    //     }
    // })
    try {
        const ProgramConfigurations = await getChromeStorage("ProgramConfiguration");
        const actions = {
            'Lsky': async () => {
                const response = await HttpRequester.get(`https://${ProgramConfigurations.Host}/api/v1/images?page=${Program}`, {
                    headers: {
                        "Accept": "application/json",
                        "Authorization": ProgramConfigurations.Token
                    }
                });
                // 处理response...
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

                // 创建一个新的对象，包含图片数据数组和分页信息
                return {
                    data: transformedData,
                    page: response.data.data.current_page,
                    pageSize: response.data.data.per_page,
                    total: response.data.data.total
                };
            },
            // 其他操作...
        };

        if (actions.hasOwnProperty(ProgramConfigurations.Program)) {
            return await actions[ProgramConfigurations.Program]();
        } else {
            throw new Error("没有数据");
        }
    } catch (error) {
        throw error; // 或者更具体的错误处理
    }
}
function deleteFromDb(key) {
    return dbHelper("Uploads").then(result => {
        const { db } = result;
        return db.delete(key);
    });
}
export function deleteImagesData(Data, index) {
    const dataLoadingMode = localStorage.getItem('dataLoadingMode');
    console.log(dataLoadingMode);

    // 如果是本地模式，则执行数据库删除操作
    if (dataLoadingMode === "local") {
        return deleteFromDb(Data.key)
            .then(() => ({ message: "删除成功", type: "success" }))
            .catch(error => Promise.reject(error));
    } else {
        // 对于非本地模式的处理逻辑
        // 如果需要处理，添加相关代码
        // 暂时返回一个解决的Promise，可以根据实际情况调整
        return Promise.resolve({ message: "非本地模式，操作未执行", type: "info" });
    }
}
