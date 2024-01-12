<template>
  <n-spin :show="show">
    <div ref="dropzone"
      class="dropzone flex justify-center flex-wrap hover:border-blue-500 border-gray-400 border-dashed border-2"></div>
  </n-spin>
</template>
  
<script setup>
import { onMounted, ref } from 'vue';
import Dropzone from 'dropzone';
import { setUpload } from '@/assets/js/upload';
import 'dropzone/dist/dropzone.css';
import yylImage from '../assets/images/yyl_512.png';
const dropzone = ref(null);
const show = ref(true);
let SvgData = `<img class="w-32 h-32" src="${yylImage}">`;
let uploader;

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
    // dictCancelUpload: `<button type="button" class="btn btn-outline-danger" style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem; width: 100%;">X</button>`,
    dictCancelUploadConfirmation: "你确认取消上传吗?",
    dictRemoveFile: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M12 1.75a3.25 3.25 0 0 1 3.245 3.066L15.25 5h5.25a.75.75 0 0 1 .102 1.493L20.5 6.5h-.796l-1.28 13.02a2.75 2.75 0 0 1-2.561 2.474l-.176.006H8.313a2.75 2.75 0 0 1-2.714-2.307l-.023-.174L4.295 6.5H3.5a.75.75 0 0 1-.743-.648L2.75 5.75a.75.75 0 0 1 .648-.743L3.5 5h5.25A3.25 3.25 0 0 1 12 1.75zm6.197 4.75H5.802l1.267 12.872a1.25 1.25 0 0 0 1.117 1.122l.127.006h7.374c.6 0 1.109-.425 1.225-1.002l.02-.126L18.196 6.5zM13.75 9.25a.75.75 0 0 1 .743.648L14.5 10v7a.75.75 0 0 1-1.493.102L13 17v-7a.75.75 0 0 1 .75-.75zm-3.5 0a.75.75 0 0 1 .743.648L11 10v7a.75.75 0 0 1-1.493.102L9.5 17v-7a.75.75 0 0 1 .75-.75zm1.75-6a1.75 1.75 0 0 0-1.744 1.606L10.25 5h3.5A1.75 1.75 0 0 0 12 3.25z" fill="currentColor"></path></g></svg>`,
    dictMaxFilesExceeded: "您不能上传更多啦......",
  });
  show.value = false
  setUpload(uploader)
})
</script>
  
<style>
.dropzone .dz-preview {
  width: 150px;
  height: 150px;
}

.dropzone .dz-preview .dz-image,
.dropzone .dz-preview .dz-image img {
  width: 100%;
  height: 100%;
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
  