<template>
  <n-modal v-model:show="showModal" @after-leave="closeModal" @after-enter="enterModal" class="w-[500px]" preset="card"
    title="设置侧边栏" :bordered="false" @close="closeModal">
    <div class="flex flex-row border-x-0 border-y border-solid border-gray-400 relative">
      <div class="w-[125px]">
        <span v-if="sidebarData.position == 'Left'" class="bg-slate-500 flex absolute"
          :style="{ width: sidebarData.width + 'px', height: sidebarData.height + '%', opacity: sidebarData.opacity / 100, top: calculateHeight(sidebarData.height, sidebarData.location) + '%' }"></span>
      </div>
      <div class="w-[250px]">
        <div>
          <label for="width">宽:{{ sidebarData.width }}px</label>
          <n-slider :default-value="0" v-model:value="sidebarData.width" :min="1" :step="1" />
        </div>
        <div>
          <label for="height">高:{{ sidebarData.height }}%</label>
          <n-slider :default-value="0" v-model:value="sidebarData.height" :min="1" :step="1" />
        </div>
        <div>
          <label for="location">位置:{{ sidebarData.location }}%</label>
          <n-slider :default-value="0" v-model:value="sidebarData.location" @update:value="updateLocation" :min="0"
            :step="1" />
        </div>
        <div>
          <label for="opacity">透明度:{{ sidebarData.opacity }}</label>
          <n-slider :default-value="5" v-model:value="sidebarData.opacity" :step="1" :min="5" />
        </div>
        <div>
          <label for="closeTime">关闭时间:{{ sidebarData.closeTime }}秒</label>
          <n-slider :default-value="2" v-model:value="sidebarData.closeTime" :step="1" :min="2" />
        </div>
        <div>
          <label for="position">侧边栏在:</label>
          <n-radio-group v-model:value="sidebarData.position" class="ml-[20px]">
            <n-radio value="Left">左</n-radio>
            <n-radio value="Right">右</n-radio>
          </n-radio-group>
        </div>
      </div>
      <div class="w-[125px] ">
        <span v-if="sidebarData.position == 'Right'" class="bg-slate-500 flex absolute right-0"
          :style="{ width: sidebarData.width + 'px', height: sidebarData.height + '%', opacity: sidebarData.opacity / 100, top: calculateHeight(sidebarData.height, sidebarData.location) + '%' }"></span>
      </div>
    </div>
    <template #footer>
      <div class="flex flex-row justify-end">
        <!-- 重置按钮 -->
        <n-button type="info" class="mr-2" @click="resetSidebarData">重置</n-button>
        <!-- 保存按钮 -->
        <n-button type="primary" class="ml-2" @click="save">保存</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script setup>
import { ref, defineEmits, defineProps, onMounted } from "vue";

const props = defineProps({
  uploadAreaData: Object,
});

const showModal = ref(false);
const sidebarData = ref({
  width: 1,
  height: 1,
  location: 0,
  opacity: 5,
  closeTime: 2,
  position: 'Right',
});

const emit = defineEmits(['close']);

const closeModal = () => {
  showModal.value = false;
  emit('close');
};
const save = () => {
  chrome.storage.local.set({ uploadArea: sidebarData.value }, function () {
    console.log(sidebarData.value);
  });
}
const enterModal = () => {
  sidebarData.value = props.uploadAreaData;
};

const resetSidebarData = () => {
  sidebarData.value = {
    width: 1,
    height: 1,
    location: 0,
    opacity: 5,
    closeTime: 2,
    position: 'Right',
  };
};

const calculateHeight = (height, value) => {
  return height + value > 100 ? 100 - height : value;
};

const updateLocation = (value) => {
  if (sidebarData.value.height + value <= 100) {
    sidebarData.value.location = value;
  } else {
    sidebarData.value.location = 100 - sidebarData.value.height;
  }
};

onMounted(() => {
  showModal.value = true;
});
</script>

<style scoped>
.leftBox {
  transition: left 0.3s ease;
}
</style>