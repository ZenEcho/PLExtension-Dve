<template>
    <n-drawer v-model:show="props.openSetting" :width="400" @after-leave="closeSettingModal"
      @after-enter="loadSettings">
      <n-drawer-content title="设置" closable>
        <div class="flex flex-col space-y-4 p-4">
          <n-spin size="large" v-if="loading" />
          <template v-else>
            <SettingItem v-for="item in settings" :key="item.label" :item="item"
              :ChromeStorageData="getChromeStorageData" />
          </template>
        </div>
      </n-drawer-content>
    </n-drawer>
  </template>
  
  <script setup>
  import { ref, defineProps, defineEmits } from 'vue';
  import SettingItem from './SettingItem.vue';
  import { getChromeStorage } from '@/assets/js/public';
  
  const getChromeStorageData = ref(null);
  
  const props = defineProps({
    openSetting: Boolean
  });
  const emit = defineEmits(['closeSettingModal']);
  
  const closeSettingModal = () => {
    emit('closeSettingModal', false);
  }
  
  const settings = ref([]);
  const loading = ref(true);
  
  const loadSettings = () => {
    loading.value = true;
    getChromeStorage().then((result) => {
      getChromeStorageData.value = result;
      settings.value = [
        { label: '主题', type: 'switch', model: ref(localStorage.getItem('darkMode') === 'true'), value: 'theme' },
        {
          label: '打开方式', type: 'select', model: ref(result.browser_Open_with), value: 'openInTab', options: [
            { label: '标签', value: 1 },
            { label: '窗口', value: 2 },
            { label: '内置', value: 3 }
          ]
        },
        { label: '自动复制', type: 'switch', model: ref(result.uploadFunctionSettings.autoCopy), value: 'autoCopy' },
        { label: '拖拽上传', type: 'switch', model: ref(result.uploadFunctionSettings.dragUpload), value: 'dragUpload' },
        { label: '右键上传', type: 'switch', model: ref(result.uploadFunctionSettings.rightClickUpload), value: 'rightClickUpload' },
        { label: '侧边栏', type: 'button', action: 'setSidebar', buttonText: '设置侧边栏', value: 'setSidebar' },
        {
          label: '图片代理', type: 'select', model: ref(result.uploadFunctionSettings.imageProxy), value: 'imageProxy', options: [
            { label: '关闭', value: false },
            { label: 'WordPress', value: 'wordpress' },
            { label: 'Weserv.nl', value: 'weserv' }
          ]
        },
        {
          label: '自动插入', type: 'select', model: ref(result.uploadFunctionSettings.autoInsert), value: 'autoInsert', options: [
            { label: '关闭', value: false },
            { label: '开启', value: true },
            { label: '设置', value: 'set' },
          ]
        },
        { label: '编辑框粘贴', type: 'switch', model: ref(result.uploadFunctionSettings.editBoxPaste), value: 'editBoxPaste' }
      ];
      loading.value = false;
    });
  };
  </script>