<template>
  <div class=" dark:bg-gray-200">
    <header class="shadow bg-blue-600 dark:bg-gray-700 sticky top-0 z-10" style="height: 65px;">
      <Navbar> </Navbar>
    </header>
    <div class="p-6">
      <div class="flex flex-wrap justify-center" id="image-scroll-container">
        <n-image-group>
          <div v-for="( item, index ) in  imagesData " :key="index"
            class="border shadow-lg max-w-[300px] flex flex-col image m-1 items-center relative">
            <div
              class="hover:bg-gray-600/30 hover:opacity-100 opacity-0 bg-white-500 absolute top-0 w-full flex flex-row items-center justify-end">
              <button class="w-7 h-7 text-red-600 hover:text-red-700"><svg xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512">
                  <path
                    d="M289.94 256l95-95A24 24 0 0 0 351 127l-95 95l-95-95a24 24 0 0 0-34 34l95 95l-95 95a24 24 0 1 0 34 34l95-95l95 95a24 24 0 0 0 34-34z"
                    fill="currentColor"></path>
                </svg></button>
            </div>
            <n-image class="h-[200px]" :src="item.url" object-fit="cover" lazy :intersection-observer-options="{
              root: '#image-scroll-container'
            }" :fallback-src="fallbackImage">
              <template #placeholder>
                <div class="w-[300px] h-[200px] flex justify-center">
                  <n-spin size="large" />
                </div>
              </template>
            </n-image>
            <div class="bg-gray-500/30 absolute bottom-0 w-full flex flex-row items-center text-white">
              {{ item.original_file_name }}
            </div>
          </div>
        </n-image-group>
      </div>
    </div>
    <div class="p-6 sticky bottom-0 bg-white dark:bg-gray-100 shadow-xl border">
      <div class="flex flex-wrap justify-center">
        <n-pagination v-model:page="page" v-model:page-size="pageSize"
          :page-count="Math.ceil(imagesStorageData.length / pageSize)" show-size-picker :page-sizes="pageSizes"
          size="large" @change="pageChange" @update:page-size="pageSizeChange" />
      </div>
    </div>
  </div>
</template>
<script setup>
import Navbar from '@/components/header.vue';
import { ref, onMounted } from 'vue';
import { getChromeStorage } from '@/assets/js/public';
import fallbackImage from '../assets/images/logo256.png';
const imagesStorageData = ref([]) // 图片数据
const imagesData = ref([]) // 图片数据
const page = ref(1); // 当前页
const pageSize = ref(10) // 每页显示数量
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
function pageChange(page) {
  let startIndex = (page - 1) * pageSize.value;
  let endIndex = startIndex + pageSize.value;
  imagesData.value = imagesStorageData.value.slice(startIndex, endIndex);
};
function pageSizeChange(pageSize) {
  pageChange(page.value)
};

// 本地图片加载
function loadImages() {
  getChromeStorage("UploadLog").then((result) => {
    console.log("图片记录：", result,);
    imagesStorageData.value = result;
    pageChange(page.value)
  })
}

// 网络图片加载
function loadNetImages() {

}
onMounted(() => {
  loadImages()
})
</script>
