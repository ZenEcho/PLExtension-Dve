<template>
  <n-spin :show="SpinConfig.spin === 'show'">
    <template #description v-if="SpinConfig.alert.template">
      <n-alert :title="SpinConfig.alert.title || '标题'" :type="SpinConfig.alert.type || 'error'">
        <div v-html="SpinConfig.alert.template"></div>
      </n-alert>
    </template>
    <main class="bg-neutral-50 dark:bg-neutral-100  flex flex-row h-screen  min-h-[500px] min-w-[500px]">
      <div>
        <Navbar />
      </div>
      <div class="w-full px-6 overflow-auto">
        <SiteTitle />
        <div>
          <div class="flex justify-center">
            <Dropzone class="w-full max-w-6xl" @success-links="handleLinks"
              @filePreviewElements="handlefilePreviewElements">
            </Dropzone>
          </div>
          <div class="pt-8 py-4 max-w-6xl mx-auto">
            <span>盘络共传：</span>
            <!-- <span class="text-blue-600">{{ ProgramConfiguration.Program }}</span> -->
            <span class="text-blue-600">选择同步上传的配置！</span>
            <br>

            <n-space vertical>
              <n-select v-model:value="targetPrograms.value" multiple :options="targetPrograms" />
            </n-space>
          </div>
        </div>
        <div>
          <div class="flex justify-center">
            <div v-if="links.length > 0"
              class="flex flex-row shadow rounded-lg max-sm:flex-col w-full max-w-6xl border dark:shadow-lg dark:border-gray-300">
              <div
                class="p-1 text-center flex flex-col border-r-2 w-36 max-sm:p-0 max-sm:flex-row max-sm:w-full max-sm:justify-center dark:border-gray-300">
                <button class="p-4 hover:bg-slate-100 hover:text-blue-900 border-b-2 truncate dark:border-gray-300"
                  type="button" v-for="option in urlType" :key="option.value"
                  :class="{ 'border-b-2 border-blue-400 text-blue-900 font-bold': selectedType === option.value }"
                  v-on:click="setSelectType(option.value)">
                  {{ option.label }}
                </button>
              </div>
              <div class="w-full overflow-auto">
                <div class="flex flex-row justify-end border-b-2 select-none dark:border-gray-300">
                  <button class="p-4 hover:bg-slate-100 truncate text-blue-600 flex items-center" type="button">
                    <svg class="h-5 mr-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 1024 1024">
                      <path
                        d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5C64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9c26.4 39.1 77.9 32.5 104 26c5.7-23.5 17.9-44.5 34.7-60.8c-140.6-25.2-199.2-111-199.2-213c0-49.5 16.3-95 48.3-131.7c-20.4-60.5 1.9-112.3 4.9-120c58.1-5.2 118.5 41.6 123.2 45.3c33-8.9 70.7-13.6 112.9-13.6c42.4 0 80.2 4.9 113.5 13.9c11.3-8.6 67.3-48.8 121.3-43.9c2.9 7.7 24.7 58.3 5.5 118c32.4 36.8 48.9 82.7 48.9 132.3c0 102.2-59 188.1-200 212.9a127.5 127.5 0 0 1 38.1 91v112.5c.8 9 0 17.9 15 17.9c177.1-59.7 304.6-227 304.6-424.1c0-247.2-200.4-447.3-447.5-447.3z"
                        fill="currentColor"></path>
                    </svg>
                    <a class="popup-Select" target="_blank" href="https://github.com/ZenEcho/PLExtension">
                      GitHub</a>
                  </button>
                  <button class="p-4 hover:bg-slate-100 truncate flex items-center" type="button"
                    @click="handleSelectedAll()">
                    <svg class="h-5 mr-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 24 24">
                      <g fill="none">
                        <path
                          d="M20.496 5.627A2.25 2.25 0 0 1 22 7.75v10A4.25 4.25 0 0 1 17.75 22h-10a2.25 2.25 0 0 1-2.123-1.504l2.097.004H17.75a2.75 2.75 0 0 0 2.75-2.75v-10l-.004-.051V5.627zM17.246 2a2.25 2.25 0 0 1 2.25 2.25v12.997a2.25 2.25 0 0 1-2.25 2.25H4.25A2.25 2.25 0 0 1 2 17.247V4.25A2.25 2.25 0 0 1 4.25 2h12.997zm0 1.5H4.25a.75.75 0 0 0-.75.75v12.997c0 .414.336.75.75.75h12.997a.75.75 0 0 0 .75-.75V4.25a.75.75 0 0 0-.75-.75zm-7.665 7.858L13.47 7.47a.75.75 0 0 1 1.133.976l-.073.084l-4.5 4.5a.75.75 0 0 1-1.056.004L8.9 12.95l-1.5-2a.75.75 0 0 1 1.127-.984l.073.084l.981 1.308L13.47 7.47L9.58 11.358z"
                          fill="currentColor"></path>
                      </g>
                    </svg>
                    <span>全选</span>
                  </button>
                  <button class="p-4 hover:bg-slate-100 truncate flex items-center" type="button"
                    @click="handleUnAllSelected()">
                    <svg class="h-5 mr-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 24 24">
                      <g fill="none">
                        <path
                          d="M20.496 5.627A2.25 2.25 0 0 1 22 7.75v10A4.25 4.25 0 0 1 17.75 22h-10a2.25 2.25 0 0 1-2.123-1.504l2.097.004H17.75a2.75 2.75 0 0 0 2.75-2.75v-10l-.004-.051V5.627zM17.246 2a2.25 2.25 0 0 1 2.25 2.25v12.997a2.25 2.25 0 0 1-2.25 2.25H4.25A2.25 2.25 0 0 1 2 17.247V4.25A2.25 2.25 0 0 1 4.25 2h12.997zm0 1.5H4.25a.75.75 0 0 0-.75.75v12.997c0 .414.336.75.75.75h12.997a.75.75 0 0 0 .75-.75V4.25a.75.75 0 0 0-.75-.75z"
                          fill="currentColor"></path>
                      </g>
                    </svg>
                    <span>
                      取消
                    </span>
                  </button>
                  <button class="p-4 hover:bg-slate-100 truncate flex items-center" type="button"
                    @click="handleCopyAll()">
                    <svg class="h-5 mr-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 16 16">
                      <g fill="none">
                        <path
                          d="M6.999 1a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2H12a2 2 0 0 0 2-2V5.5h-.002V4.414a1.5 1.5 0 0 0-.439-1.06l-1.914-1.915A1.5 1.5 0 0 0 10.585 1H6.998zM12 12H6.999a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h3v1.5a1.5 1.5 0 0 0 1.5 1.5h1.5v1.061H13V11a1 1 0 0 1-1 1zm.791-8h-1.293a.5.5 0 0 1-.5-.5V2.207L12.791 4zM3 4a1 1 0 0 1 1-1v8a3 3 0 0 0 3 3h5a1 1 0 0 1-1 1H6.79A3.79 3.79 0 0 1 3 11.21V4z"
                          fill="currentColor"></path>
                      </g>
                    </svg>
                    <span>复制选中</span>
                  </button>
                </div>

                <div class="m-1">
                  <div v-if="links.length > 0">
                    <div v-for="(link, index) in links" :key="index"
                      class="relative flex flex-row my-1 shadow border p-1 hover:bg-blue-100 dark:border-gray-300 links">
                      <div class="truncate w-full" @click="previewEmphasis($event, index)">
                        <p class="p-2 shadow truncate text-ellipsis url-text" @click="getUrlText($event)">
                          {{ link.url }}
                        </p>
                      </div>
                      <button class="hover:text-blue-500 min-w-6" value="select" title="选中" type="button"
                        @click="handleSelected($event, index)"><svg xmlns="http://www.w3.org/2000/svg"
                          xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24">
                          <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round">
                            <rect x="4" y="4" width="16" height="16" rx="2"></rect>
                            <path d="M9 11l3 3l3-3"></path>
                          </g>
                        </svg></button>
                      <button class="hover:text-blue-500 min-w-6" value="copy" title="复制" type="button"
                        @click="handleCopy($event)"><svg xmlns="http://www.w3.org/2000/svg"
                          xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 16 16">
                          <g fill="none">
                            <path
                              d="M6.999 1a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2H12a2 2 0 0 0 2-2V5.5h-.002V4.414a1.5 1.5 0 0 0-.439-1.06l-1.914-1.915A1.5 1.5 0 0 0 10.585 1H6.998zM12 12H6.999a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h3v1.5a1.5 1.5 0 0 0 1.5 1.5h1.5v1.061H13V11a1 1 0 0 1-1 1zm.791-8h-1.293a.5.5 0 0 1-.5-.5V2.207L12.791 4zM3 4a1 1 0 0 1 1-1v8a3 3 0 0 0 3 3h5a1 1 0 0 1-1 1H6.79A3.79 3.79 0 0 1 3 11.21V4z"
                              fill="currentColor"></path>
                          </g>
                        </svg></button>
                    </div>
                  </div>
                  <div v-else>
                    <div class="relative flex flex-row my-1 shadow border p-1 hover:bg-blue-100 dark:border-gray-300">
                      <div class="truncate w-full">
                        <p class="p-2 shadow truncate text-ellipsis url-text" @click="getUrlText($event)">
                          上传成功后链接将会在这里显示。
                        </p>
                      </div>
                      <button class="hover:text-blue-500 min-w-6" value="select" title="选中" type="button"><svg
                          xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                          viewBox="0 0 24 24">
                          <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round">
                            <rect x="4" y="4" width="16" height="16" rx="2"></rect>
                            <path d="M9 11l3 3l3-3"></path>
                          </g>
                        </svg></button>
                      <button class="hover:text-blue-500 min-w-6" value="copy" title="复制" type="button"
                        @click="handleCopy($event)"><svg xmlns="http://www.w3.org/2000/svg"
                          xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 16 16">
                          <g fill="none">
                            <path
                              d="M6.999 1a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2H12a2 2 0 0 0 2-2V5.5h-.002V4.414a1.5 1.5 0 0 0-.439-1.06l-1.914-1.915A1.5 1.5 0 0 0 10.585 1H6.998zM12 12H6.999a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h3v1.5a1.5 1.5 0 0 0 1.5 1.5h1.5v1.061H13V11a1 1 0 0 1-1 1zm.791-8h-1.293a.5.5 0 0 1-.5-.5V2.207L12.791 4zM3 4a1 1 0 0 1 1-1v8a3 3 0 0 0 3 3h5a1 1 0 0 1-1 1H6.79A3.79 3.79 0 0 1 3 11.21V4z"
                              fill="currentColor"></path>
                          </g>
                        </svg></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>
  </n-spin>
  <n-message-provider>
    <Messagetag ref="messageRef" />
  </n-message-provider>
</template>
<style scoped>
.custom-width {
  width: calc(100% - 9rem);
}
</style>

<script setup>
import Navbar from '@/components/header.vue';
import SiteTitle from '@/components/siteTitle.vue';
import Dropzone from '@/components/dropzone.vue';
import Messagetag from '@/components/message.vue';
import { dbHelper } from '@/assets/js/db';
import { getChromeStorage } from '@/assets/js/public';
import { copyText, generateLink } from '@/assets/js/public';
import { ref, provide, reactive } from 'vue';
const messageRef = ref(null);
const SpinConfig = reactive({
  spin: 'hidden',  // 默认隐藏
  template: '',
  alert: {
    title: "",
    type: "error",
    template: ``,
  }
});
const links = ref([]);
const filePreviewElements = ref([]);
const ProgramConfiguration = ref([]);
const targetPrograms = ref([]);
getChromeStorage("ProgramConfiguration").then((result) => {
  ProgramConfiguration.value = result;
})
const readBedConfig = () => {
  dbHelper("BedConfigStore").then(result => {
    const { db } = result;
    // attachImportButtonHandler(db); // 导入
    db.getSortedByIndex().then(BedConfig => {
      console.log("数据库", BedConfig);
      BedConfig.forEach(item => {
        targetPrograms.value.push({
          label: item.ConfigName,
          value: item.id
        })
      });
    });

  }).catch(error => {
    console.error(error);
  });
}
readBedConfig()
function getUrlText(event) {
  let range = document.createRange();
  range.selectNodeContents(event.currentTarget);
  let sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}
function handleLinks(Links) {
  links.value = Links;
  getSelectType().then((Link) => {
    setSelectType(Link)
  });
};
function handlefilePreviewElements(Elements) {
  filePreviewElements.value = Elements;
};
function handleCopy(event) {
  let elementToCopy = event.currentTarget.parentNode.querySelector(".url-text").textContent;
  copyText(elementToCopy, showMessage);
};
function handleCopyAll(event) {
  let selected_text = [];
  document.querySelectorAll('.previewActive .url-text').forEach((element) => {
    selected_text.push(element.textContent);
  });
  copyText(selected_text.join("\n"), showMessage);
}
function showMessage(payload) {
  if (messageRef.value && typeof messageRef.value.showMessage === 'function') {
    messageRef.value.showMessage(payload);
  }
};
function showSpin(value) {
  SpinConfig.spin = value.spin || 'hidden';
  SpinConfig.template = value.template || '';
  SpinConfig.alert = value.alert || '';
};
const urlType = ref([
  { value: 'URL', label: 'URL' },
  { value: 'HTML', label: 'HTML' },
  { value: 'BBCode', label: 'BBCode' },
  { value: 'Markdown', label: 'Markdown' },
  { value: 'MDWithLink', label: 'MD with link' }
]);
const selectedType = ref("");
function setSelectType(value) {
  chrome.storage.local.set({ 'Copy_Selected_Mode': value })
  selectedType.value = value;
  if (links.value && links.value.length > 0) {
    const updatedLinks = links.value.map(link => {
      return { ...link, url: generateLink(value, link.originalUrl, link.name) };
    });

    links.value = updatedLinks;
  }
};
function getSelectType() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['Copy_Selected_Mode'], function (result) {
      if (!result.Copy_Selected_Mode) {
        chrome.storage.local.set({ 'Copy_Selected_Mode': "URL" })
        selectedType.value = "URL";
        resolve("URL");
      }
      selectedType.value = result.Copy_Selected_Mode;
      resolve(result.Copy_Selected_Mode);
    })
  });
};
function previewEmphasis(event, index) {
  let parentNode = event.currentTarget.parentNode //父元素
  let grandfatherNodeNode = parentNode.parentNode //祖父元素
  grandfatherNodeNode.querySelectorAll('button[value="select"]').forEach(element => {
    element.classList.remove('text-active');
    element.parentNode.classList.remove('previewActive');
  });
  parentNode.querySelector('button[value="select"]').classList.add('text-active');
  filePreviewElements.value.forEach(element => {
    element.classList.remove('active');
  });
  filePreviewElements.value[index].classList.add('active');
  parentNode.classList.add('previewActive');
};
function handleSelected(event, index) {
  event.currentTarget.classList.toggle('text-active');
  event.currentTarget.parentNode.classList.toggle('previewActive');
  if (event.currentTarget.classList.contains('text-active')) {
    filePreviewElements.value[index].classList.add('active');
  } else {
    filePreviewElements.value[index].classList.remove('active');
  }
};
function handleSelectedAll() {
  let links = document.querySelectorAll(".links")
  links.forEach(element => {
    element.classList.add('previewActive');
    element.querySelector('button[value="select"]').classList.add('text-active');
  })
  filePreviewElements.value.forEach(element => {
    element.classList.add('active');
  });
};
function handleUnAllSelected() {
  let links = document.querySelectorAll(".links")
  links.forEach(element => {
    element.classList.remove('previewActive');
    element.querySelector('button[value="select"]').classList.remove('text-active');
  })
  filePreviewElements.value.forEach(element => {
    element.classList.remove('active');
  });
};
getSelectType();
provide('showMessage', showMessage);
provide('showSpin', showSpin);
</script>
<style>
.text-active {
  color: rgb(59 130 246);
}

.active {
  position: relative;
  /* 确保父元素是相对定位 */
}

.active::after {
  content: '\2713';
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 5rem;
  font-weight: bold;
  color: #4CAF50;
  z-index: 10;
  transform: translate(-50%, -50%);
}
</style>
