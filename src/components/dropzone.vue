<template>
  <n-spin :show="show">
    <div ref="dropzone"
      class="dropzone flex justify-center flex-wrap hover:border-blue-500 border-gray-400 border-dashed border-2"></div>
  </n-spin>
</template>

<script setup>
import { onMounted, ref, inject, defineEmits } from 'vue';
import Dropzone from 'dropzone';
import { setUpload } from '@/assets/js/upload';
import { taskQueue } from '@/assets/js/taskQueue';
import { LocalStorage, replaceKeywordsInText } from '@/assets/js/public';
import 'dropzone/dist/dropzone.css';
import yylImage from '../assets/images/yyl_512.png';
const dropzone = ref(null);
const emit = defineEmits(['success-links', 'filePreviewElements']);
const show = ref(true);
const showMessage = inject('showMessage');
const Spin = inject('showSpin');
let SvgData = `<img class="w-32 h-32" src="${yylImage}">`;
let uploader;
const links = ref([]);
const filePreviewElements = ref([]);
let ProgramConfigurations;
onMounted(() => {
  uploader = new Dropzone(dropzone.value, {
    url: "baidu.com/",
    method: 'post',
    acceptedFiles: 'image/*',
    paramName: "",
    addRemoveLinks: true,
    forceFallback: false,
    maxThumbnailFilesize: 50,//缩略图MB
    // autoProcessQueue: false, //自动上传
    // parallelUploads: 1, // 每次上传1个
    dictDefaultMessage: "<div class='flex flex-col items-center'>" + SvgData + "<span> 点击上传 / 拖拽上传 / 粘贴上传 </span></div>",
    dictFallback: "浏览器不支持拖拽上传",
    dictFallbackMessage: "您的浏览器不支持拖拽......",
    dictFallbackText: "Please use the fallback form below to upload your files like in the olden days.",
    dictFileTooBig: "你传的玩意有 {{filesize}}MiB这么大.但是我就允许你传: {{maxFilesize}}MiB.",
    dictInvalidFileType: "你不能上传这个文件类型.......",
    dictResponseError: "{{statusCode}}",
    dictCancelUpload: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M12 1.75a3.25 3.25 0 0 1 3.245 3.066L15.25 5h5.25a.75.75 0 0 1 .102 1.493L20.5 6.5h-.796l-1.28 13.02a2.75 2.75 0 0 1-2.561 2.474l-.176.006H8.313a2.75 2.75 0 0 1-2.714-2.307l-.023-.174L4.295 6.5H3.5a.75.75 0 0 1-.743-.648L2.75 5.75a.75.75 0 0 1 .648-.743L3.5 5h5.25A3.25 3.25 0 0 1 12 1.75zm6.197 4.75H5.802l1.267 12.872a1.25 1.25 0 0 0 1.117 1.122l.127.006h7.374c.6 0 1.109-.425 1.225-1.002l.02-.126L18.196 6.5zM13.75 9.25a.75.75 0 0 1 .743.648L14.5 10v7a.75.75 0 0 1-1.493.102L13 17v-7a.75.75 0 0 1 .75-.75zm-3.5 0a.75.75 0 0 1 .743.648L11 10v7a.75.75 0 0 1-1.493.102L9.5 17v-7a.75.75 0 0 1 .75-.75zm1.75-6a1.75 1.75 0 0 0-1.744 1.606L10.25 5h3.5A1.75 1.75 0 0 0 12 3.25z" fill="currentColor"></path></g></svg>`,
    dictCancelUploadConfirmation: "你确认取消上传吗?",
    dictRemoveFile: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M12 1.75a3.25 3.25 0 0 1 3.245 3.066L15.25 5h5.25a.75.75 0 0 1 .102 1.493L20.5 6.5h-.796l-1.28 13.02a2.75 2.75 0 0 1-2.561 2.474l-.176.006H8.313a2.75 2.75 0 0 1-2.714-2.307l-.023-.174L4.295 6.5H3.5a.75.75 0 0 1-.743-.648L2.75 5.75a.75.75 0 0 1 .648-.743L3.5 5h5.25A3.25 3.25 0 0 1 12 1.75zm6.197 4.75H5.802l1.267 12.872a1.25 1.25 0 0 0 1.117 1.122l.127.006h7.374c.6 0 1.109-.425 1.225-1.002l.02-.126L18.196 6.5zM13.75 9.25a.75.75 0 0 1 .743.648L14.5 10v7a.75.75 0 0 1-1.493.102L13 17v-7a.75.75 0 0 1 .75-.75zm-3.5 0a.75.75 0 0 1 .743.648L11 10v7a.75.75 0 0 1-1.493.102L9.5 17v-7a.75.75 0 0 1 .75-.75zm1.75-6a1.75 1.75 0 0 0-1.744 1.606L10.25 5h3.5A1.75 1.75 0 0 0 12 3.25z" fill="currentColor"></path></g></svg>`,
    dictMaxFilesExceeded: "您不能上传更多啦......",
  });
  show.value = false
  setUpload(uploader).then(res => {
    console.log(res);
    ProgramConfigurations = res
    DropzoneSuccess()
    DropzoneError()
  }).catch(error => {
    console.log(error)
    showMessage({ message: error.message, type: "error", props: { duration: 15000, closable: true } });
    Spin({
      spin: "show",
      alert: {
        title: error.message,
        type: "error",
        template: `
      <div>
        <p class="text-sm">` + JSON.stringify(error) + `</p>
        <p class="text-center mt-1">详细错误，请打开开发者控制台(F12)查看，或检查<a href="/options.html" target="_blank" class="px-3 py-1 bg-gray-100 text-gray-900">配置信息</a></p>
      </div>`
      },

    });
  })
})
function DropzoneSuccess() {
  uploader.on("success", function (file, res) {
    console.log(res)
    let imageUrl;
    let date = new Date();
    let getMonth = date.getMonth() + 1
    let filename = ProgramConfigurations.UploadPath + date.getFullYear() + "/" + getMonth + "/" + date.getDate() + "/" + file.name;
    try {
      switch (ProgramConfigurations.Program) {
        case 'Lsky':
          showMessage({ message: res.message, type: "success" });
          imageUrl = res.data.links.url
          break;
        case 'EasyImages':
          showMessage({ message: res.message, type: "success" });
          imageUrl = res.url
          break;
        case 'ImgURL':
          showMessage({ message: res.msg, type: "success" });
          imageUrl = res.data.url
          break;
        case 'SM_MS':
          showMessage({ message: res.message, type: "success" });
          imageUrl = res.data.url
          break;
        case 'Chevereto':
          showMessage({ message: "上传成功", type: "success" });
          imageUrl = res.image.url
          break;
        case 'Hellohao':
          showMessage({ message: res.info, type: "success" });
          imageUrl = res.data.url
          break;
        case 'Imgur':
          showMessage({ message: "上传成功", type: "success" });
          imageUrl = res.data.link
          break;
        case 'Custom':
          showMessage({ message: chrome.i18n.getMessage("Server_response_successful"), type: "success" });
          let data = { ...res }
          //将字符串转为JSON
          if (ProgramConfigurations.custom_ReturnJson == 1) {
            if (typeof data.data !== 'object') {
              try {
                return JSON.parse(data.data)
              } catch (error) {
                showMessage({ message: chrome.i18n.getMessage("data_cannot_be_converted_to_JSON"), type: "error", props: { duration: 10000 } });
                console.error(error);
                return;
              }
            }
          }
          let return_success_value = data.data;
          if (ProgramConfigurations.return_success !== 'null') {
            for (let property of ProgramConfigurations.return_success.split('.')) {
              return_success_value = return_success_value[property];
            }
          }
          if (ProgramConfigurations.custom_ReturnPrefix) {
            //前缀
            return_success_value = ProgramConfigurations.custom_ReturnPrefix + return_success_value
          }
          if (ProgramConfigurations.custom_ReturnAppend) {
            //后缀
            return_success_value += ProgramConfigurationscustom_ReturnAppend
          }
          if (ProgramConfigurations.custom_KeywordReplacement) {
            //关键词替换
            return_success_value = replaceKeywordsInText(return_success_value, ProgramConfigurations.Keyword_replacement1, ProgramConfigurations.Keyword_replacement2)
          }
          imageUrl = return_success_value
          ProgramConfigurations.Host = ProgramConfigurations.Url

          break;
        case 'Tencent_COS':
          //腾讯云cos拼接
          if (!ProgramConfigurations.custom_DomainName) {
            ProgramConfigurations.custom_DomainName = "https://" + ProgramConfigurations.Bucket + ".cos." + ProgramConfigurations.Region + ".myqcloud.com/"
          }
          imageUrl = ProgramConfigurations.custom_DomainName + filename

          showMessage({ message: chrome.i18n.getMessage("Upload_prompt7"), type: "success" });
          ProgramConfigurations.Host = ProgramConfigurations.Bucket
          break;
        case 'Aliyun_OSS':
          //阿里云oss拼接
          if (!ProgramConfigurations.custom_DomainName) {
            ProgramConfigurations.custom_DomainName = "https://" + ProgramConfigurations.Bucket + "." + ProgramConfigurations.Endpoint + "/"
          }
          imageUrl = ProgramConfigurations.custom_DomainName + filename
          showMessage({ message: chrome.i18n.getMessage("Upload_prompt7"), type: "success" });
          ProgramConfigurations.Host = ProgramConfigurations.Endpoint
          break;
        case 'AWS_S3':
          //AWS S3拼接
          if (!ProgramConfigurations.custom_DomainName) {
            ProgramConfigurations.custom_DomainName = "https://s3." + ProgramConfigurations.Region + ".amazonaws.com/" + ProgramConfigurations.Bucket + "/"
          }
          imageUrl = ProgramConfigurations.custom_DomainName + filename
          showMessage({ message: chrome.i18n.getMessage("Upload_prompt7"), type: "success" });
          ProgramConfigurations.Host = ProgramConfigurations.Endpoint
          break;
        case 'GitHub':
          imageUrl = `https://raw.githubusercontent.com/` + ProgramConfigurations.Owner + `/` + ProgramConfigurations.Repository + `/main/` + ProgramConfigurations.UploadPath + file.name
          showMessage({ message: chrome.i18n.getMessage("Upload_prompt7"), type: "success" });
          ProgramConfigurations.Host = "GitHub.com"
          break;
        case 'Telegra_ph':
          if (ProgramConfigurations.custom_DomainName) {
            imageUrl = ProgramConfigurations.custom_DomainName + res[0].src;
            ProgramConfigurations.Host = ProgramConfigurations.custom_DomainName
          } else {
            imageUrl = `https://telegra.ph` + res[0].src;
          }
          break;
        case "IMGDD":
          imageUrl = res.url
          break;
        case 'fiftyEight':
          if (res && res.indexOf("n_v2") > -1) {
            let index = parseInt(Math.random() * 8) + 1;
            imageUrl = "https://pic" + index + ".58cdn.com.cn/nowater/webim/big/" + res;
          }
          break;
        case 'BaiJiaHao':
          if (res.ret.https_url) {
            imageUrl = res.ret.https_url;
          }
          showMessage({ message: res.errmsg, type: "success" });
          break;
        case 'toutiao':
          imageUrl = res.data.url_list[0].url;
          showMessage({ message: chrome.i18n.getMessage("Upload_prompt7"), type: "success" });
          break;
      }
    } catch (error) {
      console.log(error);
      if (!imageUrl) {
        imageUrl = chrome.i18n.getMessage("Upload_prompt4")
      }
      showMessage({ message: "文件" + file.name + "上传失败", type: "error" });
    }
    let info = {
      url: imageUrl,
      originalUrl: imageUrl,
      name: file.name
    }
    const imageUrlCopy = imageUrl
    const storData = {
      "file": {
        "name": null,
        "file": file,
      },
      "Program": ProgramConfigurations.Program,
      "url": imageUrlCopy,
      "MethodName": "normal",
      "uploadDomainName": ProgramConfigurations.Host
    }
    taskQueue(() => LinksGo(info));
    taskQueue(() => LocalStorage(storData));
  })
  uploader.on("complete", function (file) {
    filePreviewElements.value.push(file.previewElement);
    emit('filePreviewElements', filePreviewElements.value);
    file.previewElement.addEventListener('click', (event) => handleFilePreviewClick(event, file));
  })
}

function DropzoneError() {
  uploader.on("error", function (file, error) {
    console.log(error)
    let info = {
      url: "文件" + file.name + "上传失败",
      originalUrl: "无法获取链接",
      name: file.name
    }
    showMessage({ message: "文件" + file.name + "上传失败", type: "error" });
    taskQueue(() => LinksGo(info));
  })
  uploader.on("removedfile", function (removefile) {
    const index = filePreviewElements.value.indexOf(removefile.previewElement);
    filePreviewElements.value.splice(index, 1);
    links.value.splice(index, 1);
    emit('filePreviewElements', filePreviewElements.value);
    emit('success-links', links.value);
  });//文件删除
}

function LinksGo(info) {
  links.value.push(info);
  emit('success-links', links.value);
}
function handleFilePreviewClick(event, file) {
  let index = filePreviewElements.value.indexOf(file.previewElement);
  let link = document.querySelectorAll('.links')[index];
  let links = document.querySelectorAll('.links');
  let eventParentNode = event.currentTarget.parentNode.querySelectorAll('.active');
  links.forEach(element => {
    element.classList.remove('previewActive');
    element.querySelector("button[value='select']").classList.remove('text-active');
  });
  eventParentNode.forEach(element => {
    element.classList.remove('active');
  });
  event.currentTarget.classList.add('active');
  link.classList.add('previewActive');
  link.querySelector("button[value='select']").classList.add('text-active');
}
</script>
<style>
.previewActive {
  background-color: rgb(219 234 254);
}

.dropzone .dz-preview {
  width: 150px;
  height: 150px;
  background: transparent !important;
}

.dropzone .dz-preview:hover {
  z-index: 1 !important;
}

.dropzone .dz-preview .dz-image,
.dropzone .dz-preview .dz-image img {
  width: 100%;
  height: 100%;
  z-index: 1;
}



.dropzone .dz-preview .dz-remove {
  position: absolute;
  top: -10px;
  z-index: 10;
  right: -20px;
  font-size: 24px;
  width: 24px;
  height: 24px;
  color: red;
}

.dropzone .dz-preview .dz-remove:hover {
  color: brown;
}

.dropzone .dz-preview .dz-remove svg {
  width: 100%;
  height: 100%;
}
</style>