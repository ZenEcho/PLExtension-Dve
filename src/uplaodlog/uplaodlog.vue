<template>
  <div class="dark:bg-neutral-100  flex flex-row min-h-[500px] min-w-[500px] bg-neutral-50">
    <div class=" h-screen">
      <Navbar></Navbar>
    </div>
    <div class="w-full h-screen overflow-auto">
      <div class="p-6">
        <div>
          <div class="flex flex-col items-center justify-center">
            通知
          </div>
          <div class="flex flex-row flex-wrap items-center justify-end m-3 border-b py-2 dark:border-gray-400">
            <button type="button" @click="handleDataLoadingMode"
              class="m-1 px-4 py-1  dark:bg-gray-600 rounded-md border text-white dark:text-gray-100"
              :class="dataLoadingMode == 'local' ? 'bg-blue-600' : ' bg-sky-600'">
              <div v-if="dataLoadingMode == 'local'" class=" flex flex-row items-center">
                <svg class="h-6 w-6 mr-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 32 32">
                  <path
                    d="M22.5 13c-4.7 0-8.5 3.8-8.5 8.5s3.8 8.5 8.5 8.5s8.5-3.8 8.5-8.5s-3.8-8.5-8.5-8.5zm6.5 8h-3c0-2-.3-4-.9-5.5c2.1 1 3.7 3 3.9 5.5zm-6.5 7c-.4-.2-1.3-1.8-1.5-5h2.9c-.2 3.2-1 4.8-1.4 5zM21 21c.1-3.8 1.1-5.8 1.4-6c.4.2 1.4 2.2 1.5 6H21zm-1.1-5.5c-.6 1.5-.8 3.5-.9 5.5h-3c.2-2.5 1.8-4.5 3.9-5.5zM16.2 23H19c.1 1.6.4 3.2.9 4.5c-1.8-.8-3.2-2.5-3.7-4.5zm8.9 4.5c.5-1.3.8-2.8.9-4.5h2.9c-.6 2-2 3.7-3.8 4.5z"
                    fill="currentColor"></path>
                  <path
                    d="M25.8 10c-.9-4.6-5-8-9.8-8c-4.8 0-8.9 3.4-9.8 8.1c-3.5.7-6.2 3.7-6.2 7.4C0 21.6 3.4 25 7.5 25H11v-2H7.5c-3 0-5.5-2.5-5.5-5.5c0-2.9 2.2-5.3 5.1-5.5H8v-.9c.5-4 3.9-7.1 8-7.1c3.7 0 6.8 2.6 7.7 6h2.1z"
                    fill="currentColor"></path>
                </svg>
                <div class="text-base">本地数据</div>
              </div>
              <div v-else class=" flex flex-row items-center">
                <svg class="h-6 w-6 mr-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 32 32">
                  <path
                    d="M25.798 10a10 10 0 0 0-19.62.124A7.496 7.496 0 0 0 7.5 25H8v-2h-.5a5.496 5.496 0 0 1-.377-10.98l.837-.057l.09-.833A7.993 7.993 0 0 1 23.736 10z"
                    fill="currentColor"></path>
                  <path
                    d="M28 12H18a2.002 2.002 0 0 0-2 2v4h-4a2.002 2.002 0 0 0-2 2v10h20V14a2.002 2.002 0 0 0-2-2zM12 28v-8h4v8zm16 0H18V14h10z"
                    fill="currentColor"></path>
                  <path d="M20 16h2v4h-2z" fill="currentColor"></path>
                  <path d="M24 16h2v4h-2z" fill="currentColor"></path>
                  <path d="M20 22h2v4h-2z" fill="currentColor"></path>
                  <path d="M24 22h2v4h-2z" fill="currentColor"></path>
                </svg>
                <div class="text-base">网络数据</div>
              </div>
            </button>
            <n-dropdown trigger="hover" :options="urlType" @select="handleSelectedCopy" class=" dark:bg-gray-50">
              <button type="button" @click="handleSelectedCopy(Copy_Selected_Mode)"
                class="m-1 px-4 py-1 flex flex-row items-center bg-blue-200 dark:bg-gray-600/80  rounded-md border text-blue-900 dark:text-gray-100 active:bg-blue-400 active:text-gray-100">
                <svg class="h-6 w-6 mr-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 512 512">
                  <rect x="128" y="128" width="336" height="336" rx="57" ry="57" fill="none" stroke="currentColor"
                    stroke-linejoin="round" stroke-width="32"></rect>
                  <path
                    d="M383.5 128l.5-24a56.16 56.16 0 0 0-56-56H112a64.19 64.19 0 0 0-64 64v216a56.16 56.16 0 0 0 56 56h24"
                    fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32">
                  </path>
                </svg>
                <div class="text-base">复制选中</div>
              </button>
            </n-dropdown>
            <button type="button" @click="handleSelectedDelete"
              class="m-1 px-4 py-1 flex flex-row items-center bg-blue-200 dark:bg-gray-600/80  rounded-md border text-blue-900 dark:text-gray-100">
              <svg class="h-6 w-6 mr-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 1024 1024">
                <path
                  d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"
                  fill="currentColor"></path>
              </svg>
              <div class="text-base">删除选中</div>
            </button>
            <button type="button" @click="handleSelectedAll"
              class="max-md:hidden m-1 px-4 py-1 flex flex-row items-center rounded-md border bg-gray-200  dark:bg-gray-500/70  dark:text-gray-100 ">
              <svg class="h-6 w-6 mr-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 24 24">
                <g fill="none">
                  <path
                    d="M20.496 5.627A2.25 2.25 0 0 1 22 7.75v10A4.25 4.25 0 0 1 17.75 22h-10a2.25 2.25 0 0 1-2.123-1.504l2.097.004H17.75a2.75 2.75 0 0 0 2.75-2.75v-10l-.004-.051V5.627zM17.246 2a2.25 2.25 0 0 1 2.25 2.25v12.997a2.25 2.25 0 0 1-2.25 2.25H4.25A2.25 2.25 0 0 1 2 17.247V4.25A2.25 2.25 0 0 1 4.25 2h12.997zm0 1.5H4.25a.75.75 0 0 0-.75.75v12.997c0 .414.336.75.75.75h12.997a.75.75 0 0 0 .75-.75V4.25a.75.75 0 0 0-.75-.75zm-7.665 7.858L13.47 7.47a.75.75 0 0 1 1.133.976l-.073.084l-4.5 4.5a.75.75 0 0 1-1.056.004L8.9 12.95l-1.5-2a.75.75 0 0 1 1.127-.984l.073.084l.981 1.308L13.47 7.47L9.58 11.358z"
                    fill="currentColor"></path>
                </g>
              </svg>
              <div class="text-base">反选</div>
            </button>
            <button type="button" @click="handleUnSelectedAll"
              class="max-md:hidden m-1 px-4 py-1 flex flex-row items-center rounded-md border bg-gray-200 dark:bg-gray-500/70   dark:text-gray-100">
              <svg class="h-6 w-6 mr-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 24 24">
                <g fill="none">
                  <path
                    d="M20.496 5.627A2.25 2.25 0 0 1 22 7.75v10A4.25 4.25 0 0 1 17.75 22h-10a2.25 2.25 0 0 1-2.123-1.504l2.097.004H17.75a2.75 2.75 0 0 0 2.75-2.75v-10l-.004-.051V5.627zM17.246 2a2.25 2.25 0 0 1 2.25 2.25v12.997a2.25 2.25 0 0 1-2.25 2.25H4.25A2.25 2.25 0 0 1 2 17.247V4.25A2.25 2.25 0 0 1 4.25 2h12.997zm0 1.5H4.25a.75.75 0 0 0-.75.75v12.997c0 .414.336.75.75.75h12.997a.75.75 0 0 0 .75-.75V4.25a.75.75 0 0 0-.75-.75z"
                    fill="currentColor"></path>
                </g>
              </svg>
              <div class="text-base">取消</div>
            </button>
            <n-dropdown trigger="hover" :options="operateSelect" @select="handleIndentSelectedOperation"
              class="dark:bg-gray-50">
              <svg class="m-1 h-6 w-6 hidden max-md:block" version="1.1" xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512"
                enable-background="new 0 0 512 512" xml:space="preserve">
                <g>
                  <path d="M255.8,218c-21,0-38,17-38,38s17,38,38,38c21,0,38-17,38-38S276.8,218,255.8,218L255.8,218z">
                  </path>
                  <path d="M102,218c-21,0-38,17-38,38s17,38,38,38c21,0,38-17,38-38S123,218,102,218L102,218z"></path>
                  <path d="M410,218c-21,0-38,17-38,38s17,38,38,38c21,0,38-17,38-38S431,218,410,218L410,218z"></path>
                </g>
              </svg>
            </n-dropdown>
          </div>

          <div class="m-3 border-b py-2 dark:border-gray-400" v-if="dataLoadingMode != 'local'">
            <n-message-provider>
              <PathPage @path-saved="dataLoad" @UploadPath-Refresh="UploadPathRefresh" :UploadPath="UploadPath">
              </PathPage>
            </n-message-provider>
          </div>

        </div>
        <n-spin :show="imagesBoxLoading" size="large">
          <div class="flex flex-wrap justify-center" id="image-scroll-container" v-if="imagesData.length > 0">
            <n-image-group>
              <n-card v-for="(item, index) in imagesData" :key="item.key" :data-key="item.key" :data-url="item.url"
                :data-filename="item.original_file_name"
                class="image-card w-[25%] min-w-[256px] max-w-[320px] flex flex-col m-1 relative dark:bg-gray-100/90"
                size="small" hoverable @click="handleImageCardClick($event, item)" closable
                @close="handleClose(item, index)" :type="item.type || 'none'">
                <template #header>
                  <n-ellipsis expand-trigger="click" line-clamp="1">
                    {{ item.original_file_name }}
                  </n-ellipsis>
                </template>
                <n-popover trigger="hover" class="dark:bg-gray-600/80 dark:text-gray-100">
                  <template #trigger>
                    <div class="flex justify-center items-center h-full w-full">
                      <n-image v-if="item.type == 'image'" class="h-[200px] w-full flex justify-center" :src="item.url"
                        object-fit="cover" height="100%" width="100%" lazy
                        :intersection-observer-options="{ root: '#image-scroll-container' }"
                        :fallback-src="fallbackImage">
                        <template #placeholder>
                          <div class="w-[300px] h-[200px] flex justify-center">
                            <n-spin size="large" />
                          </div>
                        </template>
                      </n-image>
                      <div v-else-if="item.type == 'editable'" class="w-full">
                        <n-progress type="circle" :percentage="item.progress || 0"
                          class="absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 z-10"
                          v-show="item.progress >= 1 && item.progress < 100" />
                        <n-input type="textarea" placeholder="点击加载内容！" class="min-h-[200px]"
                          @click="handleEditingContent($event, item)" v-model:value="item.NetResponseText" />

                      </div>
                      <div v-else-if="item.type == 'video'" class="w-full h-full">
                        <video controls class="w-full h-full">
                          <source :src="item.url">
                        </video>
                      </div>
                      <div v-else>
                        <div v-if="item.type in imageMap">
                          <n-image :src="getImageSrc(imageMap[item.type])" class="h-[200px] flex justify-center"
                            preview-disabled @click="item.type === 'dir' ? handlePathClick($event, item) : null" />
                        </div>
                        <div v-else>
                          <n-image :src="getImageSrc('images/fileicon/unknown.png')"
                            class="h-[200px] flex justify-center" preview-disabled />
                        </div>
                      </div>

                    </div>
                  </template>
                  <template #default>
                    <p>文件名称：{{ item.original_file_name }}</p>
                    <p>文件大小：{{ getFormatFileSize(item.file_size) }}</p>
                    <p>上传程序：{{ item.uploadExe }}</p>
                    <p>上传域名：{{ item.upload_domain_name }}</p>
                    <p>上传时间：{{ item.uploadTime }}</p>
                  </template>
                </n-popover>
                <template #footer>
                  <div class="flex justify-center items-center">
                    <button type="button"
                      class="px-4 py-1 mx-1 rounded border text-sky-600 border-sky-500 dark:border-gray-500 dark:text-gray-500">插入</button>
                    <n-dropdown ref="dropdown" trigger="hover" :options="urlType" @select="handleCopy($event, item)"
                      class="dark:bg-gray-50">
                      <button type="button"
                        class="px-4 py-1 mx-1 rounded text-gray-100 bg-sky-500 active:bg-sky-600 dark:bg-gray-500 dark:active:bg-gray-600"
                        @click="handleCopy(Copy_Selected_Mode, item)">复制</button>
                    </n-dropdown>
                  </div>
                </template>
              </n-card>

            </n-image-group>
          </div>
          <div v-else>
            <n-result status="403" title="403 禁止访问" description="总有些门是对你关闭的">
              <template #footer>
                <n-button><a href="/popup.html">去上传试一试？</a></n-button>
              </template>
            </n-result>
          </div>
        </n-spin>

      </div>
      <div class="sticky bottom-0 bg-white dark:bg-gray-100 shadow-xl border h-[100px]">
        <div class="flex flex-wrap justify-center pt-6">
          <n-pagination v-model:page="page" v-model:page-size="pageSize"
            :page-count="dataLoadingMode === 'local' ? Math.ceil(imagesStorageData.length / pageSize) : Math.ceil(imagesStorageData.total / pageSize)"
            show-size-picker :page-sizes="pageSizes" size="large" @change="pageChange"
            @update:page-size="pageSizeChange" />
        </div>
      </div>
    </div>
  </div>

  <n-message-provider>
    <Messagetag ref="messageRef" />
  </n-message-provider>
</template>
<script setup>
import PathPage from '@/uplaodlog/path.vue';
import Navbar from '@/components/header.vue';
import Messagetag from '@/components/message.vue';
import { getFileType } from '@/assets/js/arrayObjectData';
import { ref, onMounted } from 'vue';
import { getChromeStorage, getFormatFileSize, copyText, generateLink } from '@/assets/js/public';
import fallbackImage from '../assets/images/logo256.png';
import { dbHelper } from '@/assets/js/db';
import { getNetworkImagesData, deleteImagesData } from '@/assets/js/uplaodlog';
import { retry } from 'ali-oss/lib/common/utils/retry';
import { trTR } from 'naive-ui';
const dropdown = ref(null);
const messageRef = ref(null);
const imagesStorageData = ref([]) // 图片总数据
const imagesData = ref([]) // 图片分页数据
const page = ref(1); // 当前页
const pageSize = ref(10) // 每页显示数量
const Copy_Selected_Mode = ref("URL") // 
const imagesBoxLoading = ref(true)  // 图片盒子加载
const dataLoadingMode = ref(localStorage.dataLoadingMode || "local")  // 本地or网络
const UploadPath = ref(); //上传路径

const pageSizes = [
  {
    label: '10/页',
    value: 10
  },
  {
    label: '20/页',
    value: 20
  },
  {
    label: '30/页',
    value: 30
  },
  {
    label: '40/页',
    value: 40
  },
  {
    label: '50/页',
    value: 50
  }
];
const urlType = ref([
  { key: 'URL', label: 'URL' },
  { key: 'HTML', label: 'HTML' },
  { key: 'BBCode', label: 'BBCode' },
  { key: 'Markdown', label: 'Markdown' },
  { key: 'MDWithLink', label: 'MD with link' }
]);
const operateSelect = ref([
  { key: '反选', label: '反选', method: handleSelectedAll },
  { key: '取消', label: '取消', method: handleUnSelectedAll },
]);
function showMessage(payload) {
  if (messageRef.value && typeof messageRef.value.showMessage === 'function') {
    messageRef.value.showMessage(payload);
  }
};
// 图片资源
const imageMap = {
  dir: 'images/fileicon/dir.png',
  ae: 'images/fileicon/ae.png',
  ai: 'images/fileicon/ai.png',
  ar: 'images/fileicon/ar.png',
  asp: 'images/fileicon/asp.png',
  dll: 'images/fileicon/dll.png',
  exe: 'images/fileicon/exe.png',
  link: 'images/fileicon/link.png',
  prproj: 'images/fileicon/pr.png',
  psd: 'images/fileicon/ps.png',
  compressedfile: 'images/fileicon/zip.png',
  word: 'images/fileicon/WORD.png',
  excel: 'images/fileicon/excel.png',
  powerPoint: 'images/fileicon/powerPoint.png',
};
const getImageSrc = (imageName) => {
  console.log(imageName);
  return new URL(`../assets/${imageName}`, import.meta.url).href;
}
function pageChange(page) {
  requestAnimationFrame(() => {
    if (dataLoadingMode.value == "local" || imagesStorageData.value.data.length > imagesStorageData.value.pageSize) {
      let startIndex = (page - 1) * pageSize.value;
      let endIndex = startIndex + pageSize.value;
      imagesData.value = imagesStorageData.value.type == "success" ? imagesStorageData.value.data.slice(startIndex, endIndex) : imagesStorageData.value.slice(startIndex, endIndex);
    } else {
      loadNetImages(page);
    }
  });
}
function pageSizeChange() {
  if (dataLoadingMode.value == "local") {
    pageChange(page.value)
  } else {
    showMessage({ message: "网络数据模式时切换无效！", type: "error" })
    pageSize.value = imagesStorageData.value.pageSize || 10
    return;
  }
};
// 点击路径跳转
function handlePathClick(e, i) {
  UploadPath.value = i.original_file_name + "/"
}
const UploadPathRefresh = (newPath) => {
  UploadPath.value = newPath
}
//加载可编辑内容
const handleEditingContent = (e, item) => {
  if (item.progress != null) {
    return;
  };
  // 如果item.file_size大于5MB片大小，则不加载!
  if (item.file_size > 1024 * 1024 * 5) {
    item.NetResponseText = "加载大于5MB的文本将会影响浏览器性能,请下载查看！";
    return;
  }

  let xhr = new XMLHttpRequest();
  xhr.open('GET', item.url, true);
  xhr.responseType = 'text';

  xhr.onprogress = function (event) {
    if (event.lengthComputable) {
      item.progress = Math.floor((event.loaded / event.total) * 100);
    } else {
      item.progress = event.loaded;
    }
  };

  xhr.onload = function () {
    if (xhr.status === 200) {
      item.NetResponseText = xhr.response;
      item.NetResponseStatus = 200;
      console.log({ status: 'loaded', responseText: xhr.response });
    } else {
      item.NetResponseStatus = 404;
      item.NetResponseText = "加载失败:" + xhr.status;
    }
  };
  xhr.onerror = function () {
    item.NetResponseStatus = 502;
    item.NetResponseText = "网络错误或请求被阻止:";
  };

  xhr.send();
}

// 复制操作
function copyOperation(urls, mode) {
  if (urls.length < 1) return;
  const copiedUrls = urls.map(url => generateLink(mode, url.url, url.original_file_name));
  copyText(copiedUrls.join("\n"), showMessage);
  chrome.storage.local.set({ 'Copy_Selected_Mode': mode }, function () {
    Copy_Selected_Mode.value = mode;
  });
}
// 点击复制
function handleCopy(mode, item) {
  copyOperation([item], mode);
}
// 选中复制
function handleSelectedCopy(mode) {
  let images = document.querySelectorAll(".image-card.active");
  const selectedUrls = Array.from(images).map(element => ({
    url: element.dataset.url,
    filename: element.dataset.filename
  }));
  copyOperation(selectedUrls, mode);
}
// 点击卡片选中
function handleImageCardClick(event) {
  const selectors = ['img', 'button', 'svg', 'video', '[type="editable"]', '.n-card-header'];
  // 判断点击的元素是否匹配任意一个选择器
  if (selectors.some(selector => event.target.closest(selector))) return;
  event.currentTarget.classList.toggle('active');
}

// 反选
function handleSelectedAll() {
  let images = document.querySelectorAll(".image-card")
  images.forEach(element => {
    element.classList.toggle('active');
  })
}
// 取消选中
function handleUnSelectedAll() {
  let images = document.querySelectorAll(".image-card.active")
  images.forEach(element => {
    element.classList.remove('active');
  })
}
// 删除
function handleClose(item, index) {
  imagesBoxLoading.value = true;
  let key = [{
    key: item.key,
    filename: item.original_file_name
  }];
  let showMessageCount = 0; // 初始化消息显示计数器
  deleteImagesData(key, result => {
    if (!result) { return };
    showMessage(result);
    checkLoadingState();
    if (result.type !== "success") return;
    dataLoadingMode.value === "local" ? imagesStorageData.value = imagesStorageData.value.filter(image => image.key !== result.key) : imagesStorageData.value.data = imagesStorageData.value.data.filter(image => image.key !== result.key);
    imagesData.value = imagesData.value.filter(image => image.key !== result.key);
  }).catch((error) => {
    console.error(error);
    showMessage({ message: "删除操作失败", type: "error" });
    checkLoadingState();
  }).finally(() => {
    document.querySelectorAll(".image-card.active").forEach((imageCard) => {
      imageCard.classList.remove('active');
    });
  })
  function checkLoadingState() {
    showMessageCount++;
    if (showMessageCount >= key.length) {
      imagesBoxLoading.value = false;
      showMessageCount = 0
    }
  }
}
// 删除选中
function handleSelectedDelete() {
  let images = document.querySelectorAll(".image-card.active");
  if (images.length < 1) return;

  imagesBoxLoading.value = true; //加载
  let keys = [];
  images.forEach((imageCard) => {
    keys.push({
      key: imageCard.dataset.key,
      filename: imageCard.dataset.filename
    });
  });

  let showMessageCount = 0; // 初始化消息显示计数器

  deleteImagesData(keys, result => {
    if (!result) { return };
    showMessage(result);
    checkLoadingState();
    if (result.type !== "success") return;
    dataLoadingMode.value === "local" ? imagesStorageData.value = imagesStorageData.value.filter(image => image.key !== result.key) : imagesStorageData.value.data = imagesStorageData.value.data.filter(image => image.key !== result.key);
    imagesData.value = imagesData.value.filter(image => image.key !== result.key);
  }).catch((error) => {
    console.error(error);
    showMessage({ message: "删除操作失败", type: "error" });
    checkLoadingState();
  }).finally(() => {
    images.forEach((imageCard) => {
      imageCard.classList.remove('active');
    });
  });

  function checkLoadingState() {
    showMessageCount++;
    if (showMessageCount >= keys.length) {
      imagesBoxLoading.value = false;
      showMessageCount = 0
    }
  }
}
// 缩进后的动作
function handleIndentSelectedOperation(key) {
  const operation = operateSelect.value.find(op => op.key === key);
  if (operation && typeof operation.method === 'function') {
    operation.method();
  }
}
// 数据加载模式
function handleDataLoadingMode() {
  let currentMode = localStorage.getItem('dataLoadingMode') || 'local';
  if (currentMode === 'local') {
    currentMode = 'network';
  } else {
    currentMode = 'local';
  }
  page.value = 1;
  dataLoadingMode.value = currentMode;
  localStorage.setItem('dataLoadingMode', currentMode);
  dataLoad()
}
// 本地图片加载
function loadImages() {
  imagesBoxLoading.value = true;
  getChromeStorage("UploadLog").then((result) => {
    let imagesDATA = result;
    if (!result) {
      imagesStorageData.value = [];
      return;
    }
    dbHelper("Uploads").then(result => {
      const { db } = result;
      if (typeof imagesDATA === "object" && imagesDATA.length > 0) {
        db.put(imagesDATA).then(() => {
          chrome.storage.local.set({ 'UploadLog': [] }, () => {
            window.location.reload();
          })
        })
      }
      db.getAll().then((UploadLog) => {
        UploadLog.forEach(item => {
          try {
            if (item.type == 'dir') { return; };
            const fileExtension = item.url.toLowerCase().match(/\.[0-9a-z]+$/);
            item.type = getFileType(fileExtension[0]);
          } catch (error) {
            item.type = "none";
          }
        });
        imagesStorageData.value = UploadLog;
        pageChange(page.value)
        console.log("本地图片：", UploadLog);
      })
    });

  }).finally(() => {
    imagesBoxLoading.value = false;
  })
}
// 网络图片加载
function loadNetImages(networkPage = 1) {
  imagesBoxLoading.value = true;
  getNetworkImagesData(networkPage).then((result) => {
    console.log("网络图片：", result);
    if (result.type == "error") {
      showMessage(result)
    }
    result.data.forEach(item => {
      try {
        if (item.type == 'dir') { return; };
        const fileExtension = item.url.toLowerCase().match(/\.[0-9a-z]+$/);
        item.type = getFileType(fileExtension[0]);
      } catch (error) {
        item.type = "none";
      }

    });

    imagesStorageData.value = result.type === "error" ? { "total": 1 } : result;
    imagesData.value = result.type === "error" ? [] : result.data;
    page.value = result.type === "error" ? 1 : result.page;
    pageSize.value = result.type === "error" ? 20 : result.pageSize;
  }).finally(() => {
    imagesBoxLoading.value = false;
  })
}
function dataLoad() {
  let currentMode = localStorage.getItem('dataLoadingMode') || 'local';
  if (currentMode === 'local') {
    loadImages()
  } else {
    loadNetImages()
  }
}
onMounted(() => {
  getChromeStorage().then((result) => {
    if (result.Copy_Selected_Mode) {
      Copy_Selected_Mode.value = result.Copy_Selected_Mode;
    }
  })
  dataLoad()
})
</script>
<style>
img {
  transform: translate3d(0, 0, 0)
}

.active {
  position: relative;
}

.active::after {
  content: '\2713';
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 5rem;
  line-height: 100px;
  text-align: center;
  font-weight: 700;
  color: #4caf50;
  z-index: 10;
  transform: translate(-50%, -50%);
  background: azure;
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>
