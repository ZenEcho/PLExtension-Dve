<template>
    <div class="flex w-full">
        <span class="flex items-center"><svg t="1718810827653" class="h-6" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="9345">
                <path d="M895.8 592.1a32.2 32.1 0 1 0 64.4 0 32.2 32.1 0 1 0-64.4 0Z" fill="#515151" p-id="9346">
                </path>
                <path
                    d="M928 687.9c-17.8 0-32.2 14.4-32.2 32.1v80.7c0 35.3-28.7 64-64 64H192.5c-35.3 0-64-28.7-64-64V225c0-35.3 28.7-64 64-64H415l82.7 143.3c6.6 11.4 19.2 17.2 31.5 15.8h302.5c35.3 0 64 28.7 64 64v80c0 17.7 14.4 32.1 32.2 32.1s32.2-14.4 32.2-32.1c0-0.8 0-1.6-0.1-2.4v-77.5C960 329 925.1 282 876.1 264v-1c0-68.2-55.8-124-124-124H476.2l-14.8-25.7c-7.4-12.9-18-16.2-27.3-16l-0.1-0.1H192.1c-70.7 0-128 57.3-128 128v574.1c0 70.7 57.3 128 128 128h640c70.7 0 128-57.3 128-128v-76.9c0.1-0.8 0.1-1.6 0.1-2.4 0-17.7-14.4-32.1-32.2-32.1zM747.1 202.8c31.6 0 58 23.2 63.1 53.4H543.9l-30.8-53.4h234z"
                    fill="#515151" p-id="9347"></path>
            </svg></span>
        <div @click="editPath" v-if="!isEditing" class="px-2 flex flex-wrap leading-8 w-full ">
            <li v-for="(segment, index) in pathSegments" :key="index">
                <span class="px-1 hover:bg-slate-100"> {{ segment }}</span>
                <span v-if="index < pathSegments.length - 1"> / </span>
            </li>

        </div>
        <div class="w-full px-2" v-if="isEditing">
            <input ref="inputRef" type="text" v-model="editablePath" @blur="savePath" @keyup.enter="savePath"
                class="  w-full px-2 h-8 border focus-visible:border-blue-400 focus-visible:outline-none" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, defineEmits } from 'vue';
import { getChromeStorage, storProgramConfiguration } from '@/assets/js/public';
import { useMessage } from 'naive-ui';
import { watch } from 'vue';

// 定义一个ref来存储路径
const uploadPath = ref('');
const message = useMessage();

// 定义编辑模式的状态
const isEditing = ref(false);
const editablePath = ref('');
const inputRef = ref(null); // 用于引用输入框

const emit = defineEmits(['path-saved', 'UploadPath-Refresh']);
// 在组件挂载时获取路径信息
onMounted(() => {
    getChromeStorage('ProgramConfiguration').then((result) => {
        uploadPath.value = result.UploadPath;
        editablePath.value = result.UploadPath;
    });
});

// 计算属性来分割路径字符串并过滤掉空的部分
const pathSegments = computed(() => {
    const segments = uploadPath.value.split('/').filter(segment => segment);
    return segments.length ? segments : ['/'];
});
// 编辑路径的方法
const editPath = () => {
    isEditing.value = true;
    nextTick(() => {
        inputRef.value.focus(); // 聚焦输入框
    });
};

// 保存路径的方法
const savePath = () => {
    uploadPath.value = editablePath.value;
    storProgramConfiguration({ UploadPath: editablePath.value })
        .then(() => { emit('path-saved'); emit('UploadPath-Refresh', editablePath.value); })
        .finally(() => { isEditing.value = false; });
};

const props = defineProps({
    UploadPath: {
        type: String,
        required: true
    }
});
watch(
    () => props.UploadPath,
    (newPath, oldPath) => {
        uploadPath.value = newPath;
        editablePath.value = newPath;
        storProgramConfiguration({ UploadPath: newPath })
            .then(() => { emit('path-saved'); })
    }
);
</script>

<style scoped>
li {
    list-style: none;
}

input {
    width: 100%;
}
</style>