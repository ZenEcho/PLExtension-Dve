import { dbHelper } from '@/assets/js/db';
import { taskQueue } from '@/assets/js/taskQueue';
import { getChromeStorage } from '@/assets/js/public';

export function setUpload(Dropzone) {
    getChromeStorage("ProgramConfiguration").then((result) => {
        let ProgramConfigurations = result
        switch (ProgramConfigurations.program) {
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
        }
        console.log(Dropzone.options);
        DropzoneSuccess(Dropzone, ProgramConfigurations)
        DropzoneError(Dropzone, ProgramConfigurations)
    })

}
function DropzoneSuccess(Dropzone, ProgramConfigurations) {
    Dropzone.on("success", function (file, res) {
        console.log(res)

        let date = new Date();
        let getMonth = date.getMonth() + 1
        let filename = ProgramConfigurations.UploadPath + date.getFullYear() + "/" + getMonth + "/" + date.getDate() + "/" + file.name;
        try {
            switch (ProgramConfigurations.program) {
                case 'Lsky':
                    // toastItem({
                    //     toast_content: res.message
                    // })
                    imageUrl = res.data.links.url
                    break;
                // case 'EasyImages':
                //     // toastItem({
                //     //     toast_content: res.message
                //     // })
                //     imageUrl = res.url
                //     break;
                // case 'ImgURL':
                //     // toastItem({
                //     //     toast_content: res.msg
                //     // })
                //     imageUrl = res.data.url
                //     break;
                // case 'SM_MS':
                //     // toastItem({
                //     //     toast_content: res.message
                //     // })
                //     imageUrl = res.data.url
                //     break;
                // case 'Chevereto':
                //     imageUrl = res.image.url
                //     break;
                // case 'Hellohao':
                //     // toastItem({
                //     //     toast_content: res.info
                //     // })
                //     imageUrl = res.data.url

                //     break;
                // case 'Imgur':
                //     imageUrl = res.data.link
                //     break;
                // case 'UserDiy':
                //     // toastItem({
                //     //     toast_content: chrome.i18n.getMessage("Server_response_successful")
                //     // })
                //     //奖字符串转为JSON
                //     if (ProgramConfigurations.open_json_button == 1) {
                //         if (typeof res !== 'object') {
                //             try {
                //                 var res = JSON.parse(res)
                //             } catch (error) {
                //                 alert(chrome.i18n.getMessage("data_cannot_be_converted_to_JSON"));
                //                 return;
                //             }
                //         }
                //     }
                //     let return_success_value = res;
                //     if (ProgramConfigurations.return_success !== 'null') {
                //         for (let property of ProgramConfigurations.return_success.split('.')) {
                //             return_success_value = return_success_value[property];
                //         }
                //     }
                //     if (ProgramConfigurations.custom_ReturnPrefix) {
                //         //前缀
                //         return_success_value = ProgramConfigurations.custom_ReturnPrefix + return_success_value
                //     }
                //     if (ProgramConfigurations.custom_ReturnAppend) {
                //         //后缀
                //         return_success_value += ProgramConfigurationscustom_ReturnAppend
                //     }
                //     if (ProgramConfigurations.custom_KeywordReplacement) {
                //         //关键词替换
                //         return_success_value = replaceKeywordsInText(return_success_value, ProgramConfigurations.Keyword_replacement1, ProgramConfigurations.Keyword_replacement2)
                //     }
                //     imageUrl = return_success_value
                //     ProgramConfigurations.Host = ProgramConfigurations.apihost

                //     break;
                // case 'Tencent_COS':
                //     //腾讯云cos拼接
                //     if (!ProgramConfigurations.Custom_domain_name) {
                //         ProgramConfigurations.Custom_domain_name = "https://" + ProgramConfigurations.Bucket + ".cos." + ProgramConfigurations.Region + ".myqcloud.com/"
                //     }
                //     imageUrl = ProgramConfigurations.Custom_domain_name + filename
                //     toastItem({
                //         toast_content: chrome.i18n.getMessage("Upload_prompt7")
                //     })
                //     ProgramConfigurations.Host = ProgramConfigurations.Bucket
                //     break;
                // case 'Aliyun_OSS':
                //     //阿里云oss拼接
                //     if (!ProgramConfigurations.Custom_domain_name) {
                //         ProgramConfigurations.Custom_domain_name = "https://" + ProgramConfigurations.Bucket + "." + ProgramConfigurations.Endpoint + "/"
                //     }
                //     imageUrl = ProgramConfigurations.Custom_domain_name + filename
                //     toastItem({
                //         toast_content: chrome.i18n.getMessage("Upload_prompt7")
                //     })
                //     ProgramConfigurations.Host = ProgramConfigurations.Endpoint
                //     break;
                // case 'AWS_S3':
                //     //AWS S3拼接
                //     if (!ProgramConfigurations.Custom_domain_name) {
                //         ProgramConfigurations.Custom_domain_name = "https://s3." + ProgramConfigurations.Region + ".amazonaws.com/" + ProgramConfigurations.Bucket + "/"
                //     }
                //     imageUrl = ProgramConfigurations.Custom_domain_name + filename
                //     toastItem({
                //         toast_content: chrome.i18n.getMessage("Upload_prompt7")
                //     })
                //     ProgramConfigurations.Host = ProgramConfigurations.Endpoint
                //     break;
                // case 'GitHubUP':
                //     imageUrl = `https://raw.githubusercontent.com/` + ProgramConfigurations.owner + `/` + ProgramConfigurations.repository + `/main/` + ProgramConfigurations.UploadPath + file.name
                //     toastItem({
                //         toast_content: chrome.i18n.getMessage("Upload_prompt7")
                //     })
                //     ProgramConfigurations.Host = "GitHub.com"
                //     break;
                // case 'Telegra_ph':
                //     if (ProgramConfigurations.Custom_domain_name) {
                //         imageUrl = ProgramConfigurations.Custom_domain_name + res[0].src;
                //         ProgramConfigurations.Host = ProgramConfigurations.Custom_domain_name
                //     } else {
                //         imageUrl = `https://telegra.ph` + res[0].src;
                //     }
                //     break;
                // case 'imgdd':
                //     imageUrl = res.url
                //     break;
                // case 'fiftyEight':
                //     if (res && res.indexOf("n_v2") > -1) {
                //         let index = parseInt(Math.random() * 8) + 1;
                //         imageUrl = "https://pic" + index + ".58cdn.com.cn/nowater/webim/big/" + res;
                //     }
                //     break;
                // case 'BilibliBed':
                //     imageUrl = res.data.image_url
                //     toastItem({
                //         toast_content: chrome.i18n.getMessage("Upload_prompt7")
                //     })
                //     break;
                // case 'BaiJiaHaoBed':
                //     if (res.ret.https_url) {
                //         imageUrl = res.ret.https_url;
                //     }

                //     toastItem({
                //         toast_content: res.errmsg
                //     })
                //     break;
                // case 'freebufBed':
                //     imageUrl = res.data.url.replace(/\\/g, "").replace('!small', '');
                //     toastItem({
                //         toast_content: chrome.i18n.getMessage("Upload_prompt7")
                //     })
                //     break;
                // case 'toutiaoBed':
                //     imageUrl = res.data.url_list[0].url;
                //     toastItem({
                //         toast_content: chrome.i18n.getMessage("Upload_prompt7")
                //     })
                //     break;
            }
        } catch (error) {
            console.log(error);
            if (!imageUrl) {
                imageUrl = chrome.i18n.getMessage("Upload_prompt4")
            }
        }
        let info = {
            url: imageUrl,
            name: file.name
        }
        const imageUrlCopy = imageUrl
        const storData = {
            "file": {
                "name": null,
                "file": file,
            },
            "url": imageUrlCopy,
            "MethodName": "normal",
            "uploadDomainName": ProgramConfigurations.Host
        }
        taskQueue(() => LocalStorage(storData));
        // chrome.runtime.sendMessage({ Middleware_AutoInsert_message: imageUrlCopy });
        // LinksUrl.push(info)
    })
}
function DropzoneError(Dropzone, ProgramConfigurations) {
    Dropzone.on("error", function (file, err) {

    })
}

