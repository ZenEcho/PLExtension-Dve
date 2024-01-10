<template>
  <div ref="dropzone" class="dropzone flex justify-center flex-wrap hover:border-blue-500 border-gray-400 border-dashed border-2"></div>
</template>
  
<script>
import { onMounted, ref } from 'vue';
import Dropzone from 'dropzone';
import 'dropzone/dist/dropzone.css';
import yylImage from '../assets/images/yyl_512.png';
export default {
  setup() {
    const dropzone = ref(null);
    onMounted(() => {
      let SvgData = `<img class="w-32 h-32" src="${yylImage}">`;
      new Dropzone(dropzone.value, {
        url: "/",
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
        dictCancelUpload: `<button type="button" class="btn btn-outline-danger" style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem; width: 100%;">X</button>`,
        dictCancelUploadConfirmation: "你确认取消上传吗?",
        dictRemoveFile: `<button type="button" class="btn btn-outline-danger" style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem; width: 100%;">X</button>`,
        dictMaxFilesExceeded: "您不能上传更多啦......",
      });
    });
    return {
      dropzone
    };
  }
};
</script>
  
<style>

</style>
  