import { dbHelper } from '@/assets/js/db';
import { taskQueue } from '@/assets/js/taskQueue';
import { getChromeStorage } from '@/assets/js/public';
import axios from 'axios';
// ---打包要很jb久，测试时不打包
// import COS from 'cos-js-sdk-v5';
import OSS from 'ali-oss';
// import { S3Client } from "@aws-sdk/client-s3";
// import { Upload } from "@aws-sdk/lib-storage"; //这个上传可以监控进度

function custom_replaceDate(inputString, file, ProgramConfigurations) {
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    let currentDay = currentDate.getDate().toString().padStart(2, '0');
    let currentTimestampMs = currentDate.getTime();
    let currentTimestamp = Math.floor(currentTimestampMs / 1000);
    let replacements = {
        '$date$': `${currentYear}年${currentMonth}月${currentDay}日`,
        '$date-yyyy$': currentYear,
        '$date-mm$': currentMonth,
        '$date-dd$': currentDay,
        '$date-time$': currentTimestampMs,
        '$date-Time$': currentTimestamp,
        '$fileName$': file.name,
        '$fileSize$': file.size,
        '$fileType$': file.type,
    };
    let replacedString = inputString;

    // 此正则表达式在循环之外创建
    const regex = new RegExp(Object.keys(replacements).map(escapeRegExp).join('|'), 'g');
    if (typeof replacedString == 'object' && file.name) {
        let OObj = []
        if (ProgramConfigurations.custom_Base64Upload) {
            OObj.push(file.dataURL) //返回b64
            return OObj[0];
        }
        OObj.push(file)
        return OObj[0];
    }
    if (typeof replacedString === 'string') {
        if (replacedString.includes('$file$')) {
            if (ProgramConfigurations.custom_Base64Upload) {
                return file.dataURL;
            }
            return file;
        }
        replacedString = replacedString.replace(regex, (match) => replacements[match]);
    }
    return replacedString;
}
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function custom_replaceDateInObject(obj, file, ProgramConfigurations) {
    let content = {};
    if (typeof obj === 'object') {
        for (const key in obj) {
            if (typeof obj[key] === 'string') {

                content[key] = custom_replaceDate(obj[key], file, ProgramConfigurations);
            } else if (typeof obj[key] === 'object') {
                content[key] = custom_replaceDateInObject(obj[key], file);
            }
        }
    }
    return content;
}
export function setUpload(Dropzone) {
    return new Promise((resolve, reject) => {
        getChromeStorage("ProgramConfiguration").then((result) => {
            let ProgramConfigurations = result
            let delayUpload; // 声明 delayUpload 变量
            switch (ProgramConfigurations.Program) {
                case 'Lsky':
                    Dropzone.options.url = "https://" + ProgramConfigurations.Host + "/api/v1/upload";
                    Dropzone.options.headers = { "Authorization": ProgramConfigurations.Token };
                    Dropzone.options.paramName = 'file';
                    Dropzone.options.acceptedFiles = '.jpeg,.jpg,.png,.gif,.tif,.bmp,.ico,.psd,.webp';
                    Dropzone.on("sending", function (file, xhr, formData) {
                        if (ProgramConfigurations.Source) {
                            formData.append("strategy_id", ProgramConfigurations.Source);
                        }
                        if (ProgramConfigurations.Album_id) {
                            formData.append("album_id", ProgramConfigurations.Album_id);
                        }
                        formData.append("permission", ProgramConfigurations.Permission);
                    })
                    break;
                case 'EasyImages':
                    Dropzone.options.url = "https://" + ProgramConfigurations.Host + "/api/index.php";
                    Dropzone.options.paramName = 'image';
                    Dropzone.options.acceptedFiles = 'image/*';
                    Dropzone.on("sending", function (file, xhr, formData) {
                        formData.append("token", ProgramConfigurations.Token);
                    })
                    break;
                case 'ImgURL':
                    Dropzone.options.url = "https://" + ProgramConfigurations.Host + "/api/v2/upload";
                    Dropzone.options.paramName = 'file';
                    Dropzone.options.acceptedFiles = 'image/*';
                    Dropzone.on("sending", function (file, xhr, formData) {
                        formData.append("token", ProgramConfigurations.Token);
                        formData.append("uid", ProgramConfigurations.Uid);
                    })
                    break;
                case 'SM_MS':
                    Dropzone.options.url = "https://" + ProgramConfigurations.Host + "/api/v2/upload";
                    Dropzone.options.headers = { "Authorization": ProgramConfigurations.Token };
                    Dropzone.options.paramName = 'smfile';
                    Dropzone.options.acceptedFiles = 'image/*';
                    Dropzone.on("sending", function (file, xhr, formData) {
                        formData.append("token", ProgramConfigurations.Token);
                    })
                    break;
                case 'Chevereto':
                    let Temporary_URL = ""
                    if (ProgramConfigurations.Expiration != "NODEL") {
                        Temporary_URL += "&expiration=" + ProgramConfigurations.Expiration
                    }
                    if (ProgramConfigurations.Album_id) {
                        Temporary_URL += "&album_id=" + ProgramConfigurations.Album_id
                    }
                    if (ProgramConfigurations.Nsfw) {
                        Temporary_URL += "&nsfw=" + ProgramConfigurations.Nsfw
                    }
                    Dropzone.options.url = "https://" + ProgramConfigurations.Host + "/api/1/upload/?key=" + ProgramConfigurations.Token + Temporary_URL;
                    Dropzone.options.headers = { "Authorization": ProgramConfigurations.Token };
                    Dropzone.options.paramName = 'source';
                    Dropzone.options.acceptedFiles = 'image/*';
                    break;
                case 'Hellohao':
                    Dropzone.options.url = "https://" + ProgramConfigurations.Host + "/api/uploadbytoken/";
                    Dropzone.options.paramName = 'file';
                    Dropzone.options.acceptedFiles = 'image/*';
                    Dropzone.on("sending", function (file, xhr, formData) {
                        formData.append("token", ProgramConfigurations.Token);
                        formData.append("source", ProgramConfigurations.Source);
                    })
                    break;
                case 'Imgur':
                    Dropzone.options.url = "https://" + ProgramConfigurations.Host + "/3/upload";
                    Dropzone.options.headers = { "Authorization": 'Client-ID ' + ProgramConfigurations.Token };
                    if (ProgramConfigurations.imgur_post_mode) {
                        Dropzone.options.acceptedFiles = ".mp4,.webm,.x-matroska,.quicktime,.x-flv,.x-msvideo,.x-ms-wmv,.mpeg"
                    } else {
                        Dropzone.options.acceptedFiles = 'image/*';
                    }
                    Dropzone.options.paramName = ProgramConfigurations.imgur_post_mode ? "video" : "image";
                    break;
                case 'Custom':
                    Dropzone.options.maxFilesize = 5000
                    Dropzone.options.acceptedFiles = ""
                    Dropzone.options.autoProcessQueue = false

                    if (ProgramConfigurations.custom_KeywordReplacement) {
                        ProgramConfigurations.Keyword_replacement1 = ProgramConfigurations.Keyword_replacement1.split(',')
                        ProgramConfigurations.Keyword_replacement2 = ProgramConfigurations.Keyword_replacement2.split(',')
                        if (ProgramConfigurations.Keyword_replacement1.length != ProgramConfigurations.Keyword_replacement2.length) {
                            reject({ error: {}, message: "关键词和替换词的数量不一致" })
                            return;
                        }
                    }
                    if (!ProgramConfigurations.Headers) {
                        ProgramConfigurations.Headers = {}
                    } else {
                        try {
                            ProgramConfigurations.Headers = JSON.parse(ProgramConfigurations.Headers);
                        } catch (error) {
                            reject({ error: {}, message: chrome.i18n.getMessage("Headers_error") })
                            return;
                        }
                    }
                    if (!ProgramConfigurations.Body) {
                        ProgramConfigurations.Body = {}
                    } else {
                        try {
                            ProgramConfigurations.Body = JSON.parse(ProgramConfigurations.Body);
                        } catch (error) {
                            console.log(error);
                            reject({ error: {}, message: chrome.i18n.getMessage("Body_error") })
                            return;
                        }
                    }

                    delayUpload = async function (file) {
                        if (file.size > Dropzone.options.maxFilesize * 1024 * 1024) {
                            return;
                        }
                        if (ProgramConfigurations.custom_Base64Upload) {
                            const reader = new FileReader();
                            reader.onload = function () {
                                file.dataURL = ProgramConfigurations.custom_Base64UploadRemovePrefix ? btoa(reader.result) : reader.result;
                                completeReplaceOperations(file);
                            };

                            if (ProgramConfigurations.custom_Base64UploadRemovePrefix) {
                                reader.readAsBinaryString(file);
                            } else {
                                reader.readAsDataURL(file);
                            }
                        } else {
                            completeReplaceOperations(file);
                        }
                        function completeReplaceOperations(file) {
                            let _url = custom_replaceDate(ProgramConfigurations.Url, file, ProgramConfigurations);
                            let _Headers = custom_replaceDateInObject(ProgramConfigurations.Headers, file, ProgramConfigurations);
                            let _Body = custom_replaceDateInObject(ProgramConfigurations.Body, file, ProgramConfigurations);
                            let Body;
                            if (ProgramConfigurations.custom_BodyUpload == true) {
                                Body = {};
                                if (ProgramConfigurations.custom_BodyStringify == true) {
                                    Body = JSON.stringify(_Body)
                                } else {
                                    Body = _Body
                                }
                            } else {
                                Body = new FormData();
                                if (ProgramConfigurations.custom_Base64Upload == true) {
                                    Body.append(ProgramConfigurations.Parameter, file.dataURL);
                                } else {
                                    Body.append(ProgramConfigurations.Parameter, file)
                                }
                                if (_Body.length > 0) {
                                    for (let key in _Body) {
                                        Body.append(key, _Body[key])
                                    }
                                }

                            }
                            axios({
                                method: ProgramConfigurations.requestMethod,
                                url: _url,
                                headers: _Headers,
                                data: Body,
                                onUploadProgress: function (progressEvent) {
                                    const percentComplete = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
                                    file.upload.progress = percentComplete;
                                    file.status = Dropzone.UPLOADING;
                                    Dropzone.emit("uploadprogress", file, percentComplete, 100);
                                }
                            })
                                .then(function (response) {
                                    Dropzone.emit("success", file, response);
                                    Dropzone.emit("complete", file, response);
                                })
                                .catch(function (error) {
                                    Dropzone.emit("error", file, error);
                                });
                        }
                    }
                    Dropzone.on("addedfile", function (file) {
                        delayUpload(file);
                    });
                    break;
                case 'Tencent_COS':
                    let cos;
                    // 初始化 COS 对象
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
                        cos = new COS({
                            getAuthorization: getAuthorization,
                            UploadCheckContentMd5: true,
                            protocol: 'https:' // 强制使用 HTTPS 协议
                        });
                    } catch (error) {
                        reject({ error: error, message: "腾讯云对象存储,初始化失败！" })
                    }
                    //腾讯云cos拼接
                    if (!ProgramConfigurations.custom_DomainName) {
                        ProgramConfigurations.custom_DomainName = "https://" + ProgramConfigurations.Bucket + ".cos." + ProgramConfigurations.Region + ".myqcloud.com/"
                    }
                    Dropzone.options.autoProcessQueue = false
                    Dropzone.options.acceptedFiles = ""
                    Dropzone.options.maxFilesize = 5000 //文件大小
                    delayUpload = async function (file) {
                        if (file.size > Dropzone.options.maxFilesize * 1024 * 1024) {
                            return;
                        }
                        let date = new Date();
                        let filename =
                            ProgramConfigurations.UploadPath +
                            date.getFullYear() +
                            "/" +
                            (date.getMonth() + 1) +
                            "/" +
                            date.getDate() +
                            "/" +
                            file.name;

                        await cos.uploadFile({
                            Bucket: ProgramConfigurations.Bucket,
                            Region: ProgramConfigurations.Region,
                            Key: filename,
                            Body: file,
                            onProgress: function (progressData) {
                                const progress = Math.round((progressData.loaded / progressData.total) * 100);
                                file.upload.progress = progress;
                                file.status = Dropzone.UPLOADING;
                                Dropzone.emit("uploadprogress", file, progress, 100);
                            }
                        }, function (err, data) {
                            if (data) {
                                file.status = Dropzone.SUCCESS
                                Dropzone.emit("success", file, "上传完成");
                                Dropzone.emit("complete", file);
                            }
                            if (error) {
                                reject({ error: error, message: chrome.i18n.getMessage("Upload_prompt4") })
                                console.error(err);
                            }
                        });
                    }
                    // 监听文件添加事件
                    Dropzone.on("addedfile", function (file) {
                        delayUpload(file);
                        document.querySelector(".dz-remove").remove()
                    });
                    break;
                case 'Aliyun_OSS':
                    let oss
                    try {
                        oss = new OSS({
                            accessKeyId: ProgramConfigurations.SecretId,
                            accessKeySecret: ProgramConfigurations.SecretKey,
                            bucket: ProgramConfigurations.Bucket,
                            endpoint: ProgramConfigurations.Endpoint,
                            region: ProgramConfigurations.Region,
                            secure: true //强制https
                        });
                    } catch (error) {
                        reject({ error: error, message: "阿里云对象存储,初始化失败！" })
                    }
                    //阿里云oss拼接
                    if (!ProgramConfigurations.custom_DomainName) {
                        ProgramConfigurations.custom_DomainName = "https://" + ProgramConfigurations.Bucket + "." + ProgramConfigurations.Endpoint + "/"
                    }
                    Dropzone.options.paramName = "file";
                    Dropzone.options.autoProcessQueue = false
                    Dropzone.options.acceptedFiles = ""
                    Dropzone.options.maxFilesize = 5000
                    delayUpload = async function (file) {
                        if (file.size > Dropzone.options.maxFilesize * 1024 * 1024) {
                            return;
                        }
                        let date = new Date();
                        let filename = ProgramConfigurations.UploadPath + date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + "/" + file.name;
                        const progressCallback = (progress) => {
                            const percentage = Math.floor(progress * 100);
                            file.upload.progress = percentage;
                            file.status = Dropzone.UPLOADING;
                            Dropzone.emit("uploadprogress", file, percentage, 100);
                        };

                        try {
                            await oss.multipartUpload(filename, file, { progress: progressCallback });
                            file.status = Dropzone.SUCCESS;
                            Dropzone.emit("success", file, "上传完成");
                            Dropzone.emit("complete", file);
                        } catch (error) {
                            reject({ error: error, message: chrome.i18n.getMessage("Upload_prompt4") })
                            console.error(error);
                            return;
                        }
                    }
                    // 监听文件添加事件
                    Dropzone.on("addedfile", function (file) {
                        delayUpload(file);
                        document.querySelector(".dz-remove").remove()
                    });
                    break;
                case 'AWS_S3':
                    let s3
                    //AWS S3区域拼接
                    if (!ProgramConfigurations.Endpoint) {
                        ProgramConfigurations.Endpoint = "https://s3." + ProgramConfigurations.Region + ".amazonaws.com/"
                    }
                    //AWS S3拼接
                    if (!ProgramConfigurations.custom_DomainName) {
                        ProgramConfigurations.custom_DomainName = "https://s3." + ProgramConfigurations.Region + ".amazonaws.com/" + ProgramConfigurations.Bucket + "/"
                    }
                    try {
                        s3 = new S3Client({
                            region: ProgramConfigurations.Region,
                            credentials: {
                                accessKeyId: ProgramConfigurations.SecretId,
                                secretAccessKey: ProgramConfigurations.SecretKey
                            },
                            endpoint: ProgramConfigurations.Endpoint,
                        });
                    } catch (error) {
                        reject({ error: error, message: "S3对象存储,初始化失败！" })
                    }
                    Dropzone.options.autoProcessQueue = false
                    Dropzone.options.acceptedFiles = ""
                    Dropzone.options.maxFilesize = 5000
                    delayUpload = async function (file) {
                        if (file.size > Dropzone.options.maxFilesize * 1024 * 1024) {
                            return;
                        }

                        let date = new Date();
                        let filename =
                            ProgramConfigurations.UploadPath +
                            date.getFullYear() +
                            "/" +
                            (date.getMonth() + 1) +
                            "/" +
                            date.getDate() +
                            "/" +
                            file.name;

                        let params;
                        if (ProgramConfigurations.Endpoint.includes('amazonaws.com')) {
                            params = {
                                Bucket: ProgramConfigurations.Bucket,
                                Key: filename,
                                Body: file,
                                ACL: 'public-read',
                                ContentType: file.type,
                            };
                        } else {
                            params = {
                                Bucket: ProgramConfigurations.Bucket,
                                Key: filename,
                                Body: file,
                            };
                        }
                        try {
                            const uploader = new Upload({
                                client: s3,
                                params: params, // 您已有的params
                            });

                            // 监听上传进度
                            uploader.on('httpUploadProgress', (progress) => {
                                console.log(`上传进度：${progress.loaded} / ${progress.total}`);
                                const percentage = Math.floor((progress.loaded / progress.total) * 100);
                                file.upload.progress = percentage;
                                file.status = Dropzone.UPLOADING;
                                Dropzone.emit("uploadprogress", file, percentage, 100);
                            });

                            // 执行上传
                            await uploader.done();
                            file.status = Dropzone.SUCCESS;
                            Dropzone.emit("success", file, "上传完成");
                            Dropzone.emit("complete", file);
                        } catch (error) {
                            reject({ error: error, message: chrome.i18n.getMessage("Upload_prompt4") })
                            console.error(error);
                            return;
                        }

                    }
                    // 监听文件添加事件
                    Dropzone.on("addedfile", function (file) {
                        delayUpload(file);
                        document.querySelector(".dz-remove").remove()
                    });
                    break;
                case 'GitHubUP':
                    Dropzone.options.autoProcessQueue = false
                    Dropzone.options.acceptedFiles = ""
                    Dropzone.options.maxFilesize = 5000
                    delay = measurePingDelay("https://github.com/");
                    delayUpload = async function (file, index) {
                        if (index >= file.length) {
                            // 所有文件上传完成
                            return;
                        }
                        const currentFile = file[index];
                        if (currentFile.size > Dropzone.options.maxFilesize * 1024 * 1024) {
                            // 跳过文件大小超过限制的文件
                            await delayUpload(file, index + 1);
                            return;
                        }

                        let date = new Date();
                        let data = { message: 'UploadDate:' + date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日" + date.getHours() + "时" + date.getMinutes() + "分" + date.getSeconds() + "秒" }
                        // 查询是否冲突
                        try {
                            fetch(ProgramConfigurations.proxy_server + `https://api.github.com/repos/` + ProgramConfigurations.Owner + `/` + ProgramConfigurations.Repository + `/contents/` + ProgramConfigurations.UploadPath + currentFile.name, {
                                method: 'GET',
                                headers: {
                                    'Authorization': 'Bearer ' + ProgramConfigurations.Token,
                                    'Content-Type': 'application/json'
                                },
                            })
                                .then(response => response.json())
                                .then(res => {
                                    if (res.sha) {
                                        data.sha = res.sha
                                    }
                                    Upload_method()
                                })
                        } catch (error) {
                            try {
                                fetch("https://cors-anywhere.pnglog.com/" + `https://api.github.com/repos/` + ProgramConfigurations.Owner + `/` + ProgramConfigurations.Repository + `/contents/` + ProgramConfigurations.UploadPath + currentFile.name, {
                                    method: 'GET',
                                    headers: {
                                        'Authorization': 'Bearer ' + ProgramConfigurations.Token,
                                        'Content-Type': 'application/json'
                                    },
                                })
                                    .then(response => response.json())
                                    .then(res => {
                                        if (res.sha) {
                                            data.sha = res.sha
                                        }
                                        Upload_method()
                                    })
                            } catch (error) {
                                console.log(error)
                                toastItem({
                                    toast_content: chrome.i18n.getMessage("Upload_prompt4")
                                })
                            }
                        }
                        async function Upload_method() {
                            const fileReader = new FileReader();
                            fileReader.onloadend = function () {
                                data.content = btoa(fileReader.result)
                                // 发送上传请求
                                $.ajax({
                                    url: `https://api.github.com/repos/` + ProgramConfigurations.Owner + `/` + ProgramConfigurations.Repository + `/contents/` + ProgramConfigurations.UploadPath + currentFile.name,
                                    type: 'PUT',
                                    headers: {
                                        'Authorization': 'Bearer ' + ProgramConfigurations.Token,
                                        'Content-Type': 'application/json'
                                    },
                                    xhr: function () {
                                        const xhr = new window.XMLHttpRequest();
                                        xhr.upload.addEventListener("progress", function (evt) {
                                            if (evt.lengthComputable) {
                                                const percentComplete = Math.floor((evt.loaded / evt.total) * 100);
                                                currentFile.upload.progress = percentComplete;
                                                currentFile.status = Dropzone.UPLOADING;
                                                Dropzone.emit("uploadprogress", currentFile, percentComplete, 100);
                                            }
                                        }, false);
                                        return xhr;
                                    },
                                    data: JSON.stringify(data),
                                    success: function (response) {
                                        currentFile.status = Dropzone.SUCCESS;
                                        Dropzone.emit("success", currentFile, "上传完成");
                                        Dropzone.emit("complete", currentFile);
                                    },
                                    error: function (xhr, status, error) {
                                        if (xhr) {
                                            Dropzone.emit("error", currentFile, xhr);
                                            return;
                                        }
                                    }
                                });

                            };
                            fileReader.readAsBinaryString(currentFile);
                            // 延迟一段时间后上传下一个文件
                            await new Promise((resolve) => setTimeout(resolve, delay)); // 设置延迟时间（单位：毫秒）
                            await delayUpload(file, index + 1);
                        }
                    }
                    // 监听文件添加事件
                    Dropzone.on("addedfiles", function (files) {
                        // 调用延迟上传函数开始上传
                        delayUpload(files, 0);
                        $(".dz-remove").remove()
                    });
                    break;
                case 'Telegra_ph':
                    Dropzone.options.maxFilesize = 5
                    if (ProgramConfigurations.custom_DomainName) {
                        Dropzone.options.url = ProgramConfigurations.custom_DomainName + "/upload";
                    } else {
                        Dropzone.options.url = "https://" + ProgramConfigurations.Host + "/upload";
                    }
                    Dropzone.options.headers = { "Accept": "application/json" };
                    Dropzone.options.paramName = 'file';
                    Dropzone.options.acceptedFiles = '.jpeg,.jpg,.png,.gif,.tif,.bmp,.ico,.psd,.webp';
                    break;
                case 'imgdd':
                    Dropzone.options.maxFilesize = 5
                    Dropzone.options.url = "https://" + ProgramConfigurations.Host + "/api/v1/upload";
                    Dropzone.options.headers = { "Accept": "application/json" };
                    Dropzone.options.paramName = 'image';
                    Dropzone.options.acceptedFiles = '.jpeg,.jpg,.png,.gif,.bmp,.webp';
                    break;
                case 'fiftyEight':
                    Dropzone.options.autoProcessQueue = false
                    Dropzone.options.maxFilesize = 5
                    Dropzone.options.url = "https://upload.58cdn.com.cn/json";
                    Dropzone.options.headers = { "Accept": "application/json" };
                    delayUpload = async function (file) {
                        if (file.size > Dropzone.options.maxFilesize * 1024 * 1024) {
                            return;
                        }
                        const reader = new FileReader();
                        reader.onload = function (event) {
                            file.dataURL = event.target.result;
                            // 发送数据到服务器
                            let dataToSend = {
                                "Pic-Size": "0*0",
                                "Pic-Encoding": "base64",
                                "Pic-Path": "/nowater/webim/big/",
                                "Pic-Data": file.dataURL.split(",")[1], // 获取Base64编码部分
                            };
                            // 执行上传逻辑
                            $.ajax({
                                url: "https://upload.58cdn.com.cn/json",
                                type: "POST",
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                xhr: function () {
                                    const xhr = new window.XMLHttpRequest();
                                    xhr.upload.addEventListener("progress", function (evt) {
                                        if (evt.lengthComputable) {
                                            const percentComplete = Math.floor((evt.loaded / evt.total) * 100);
                                            file.upload.progress = percentComplete;
                                            file.status = Dropzone.UPLOADING;
                                            Dropzone.emit("uploadprogress", file, percentComplete, 100);
                                        }
                                    }, false);
                                    return xhr;
                                },
                                data: JSON.stringify(dataToSend),
                                success: function (result) {
                                    if (result) {
                                        file.status = Dropzone.SUCCESS;
                                        Dropzone.emit("success", file, result);
                                        Dropzone.emit("complete", file, result);
                                    } else {
                                        Dropzone.emit("error", file, "上传失败,可能是达到了上限");
                                    }
                                },
                                error: function (xhr, status, error) {
                                    if (xhr) {
                                        Dropzone.emit("error", file, xhr);
                                        return;
                                    }
                                }
                            });
                        };
                        reader.readAsDataURL(file);

                    }
                    // 监听文件添加事件
                    Dropzone.on("addedfile", function (file) {
                        delayUpload(file);
                        $(".dz-remove").remove()
                    });
                    break;
                case 'BilibliBed':
                    // Dropzone.options.url ="http://127.0.0.1:3000/Bed.Bilibli";
                    // Dropzone.options.headers = {
                    //     "biz": "new_dyn",
                    //     "category": "daily",
                    //     "csrf": CSRF,
                    //     "SESSDATA": ProgramConfigurations.Token
                    // };
                    // Dropzone.options.acceptedFiles = '.jpeg,.jpg,.png,.gif,.bmp,.ico,.webp';

                    // Dropzone.options.url = "https://api.bilibili.com/x/dynamic/feed/draw/upload_bfs";
                    // Dropzone.options.paramName = 'file_up';
                    // Dropzone.options.acceptedFiles = '.jpeg,.jpg,.png,.gif,.bmp,.ico,.webp';
                    // Dropzone.on("sending", function (file, xhr, formData) {
                    //     formData.append("biz", "new_dyn");
                    //     formData.append("category", "category");
                    // })
                    break;
                case 'BaiJiaHaoBed':
                    Dropzone.options.url = "https://baijiahao.baidu.com/pcui/picture/upload";
                    Dropzone.options.paramName = 'media';
                    Dropzone.options.acceptedFiles = '.jpeg,.jpg,.png,.gif,.bmp,.ico,.webp';
                    Dropzone.on("sending", function (file, xhr, formData) {
                        formData.append("type", "image");
                    })
                    break;
                case 'freebufBed':
                    Dropzone.options.url = "https://www.freebuf.com/fapi/frontend/upload/image";
                    Dropzone.options.paramName = 'file';
                    Dropzone.options.acceptedFiles = '.jpeg,.jpg,.png,.gif,.bmp,.ico,.webp';
                    Dropzone.options.headers = {
                        "Accept": "application/json, text/plain, */*",
                        "Referer": "https://www.freebuf.com/write",
                        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
                    };
                    break;
                case 'toutiaoBed':
                    const randomAid = Math.floor(Math.random() * 24) + 1;
                    let url = `https://i.snssdk.com/feedback/image/v1/upload/?appkey=toutiao_web-web&aid=` + randomAid + `&app_name=toutiao_web`
                    Dropzone.options.url = url;
                    Dropzone.options.paramName = 'image';
                    Dropzone.options.acceptedFiles = '.jpeg,.jpg,.png,.gif,.bmp,.ico,.webp';
                    Dropzone.options.headers = {
                        "Accept": "application/json, text/plain, */*",
                        "Referer": "https://helpdesk.bytedance.com/",
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 Edg/117.0.2045.31"
                    };
                    Dropzone.on("sending", function (file, xhr, formData) {
                        formData.append("app_id", randomAid);
                    })
                    break;
                case 'toutiaoBed2':
                    // Dropzone.options.url ="https://mp.toutiao.com/spice/image?upload_source=20020002&aid=1231&device_platform=web";
                    // Dropzone.options.paramName = 'image';
                    // Dropzone.options.acceptedFiles = '.jpeg,.jpg,.png,.gif,.bmp,.ico,.webp';
                    // Dropzone.options.headers = {
                    //     "Accept": "application/json, text/plain, */*",
                    // }
                    break;
            }
            resolve(ProgramConfigurations)
        })
    });

}


