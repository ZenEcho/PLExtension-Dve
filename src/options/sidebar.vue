<template>
    <div class="bg-gray-200  sidebar dark:bg-gray-500 min-w-48">
        <div class="px-4 border-b flex flex-row items-center h-12 text-lg border-gray-400 dark:border-gray-200">
            <span><svg t="1703828985261" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                    p-id="19530" width="24" height="24">
                    <path
                        d="M384 896H64V576h320v320m0 64c38.4 0 64-25.6 64-64V576c0-38.4-25.6-64-64-64H64c-38.4 0-64 25.6-64 64v320c0 38.4 25.6 64 64 64h320z"
                        p-id="19531" fill="#1296db"></path>
                    <path
                        d="M960 896V576c0-38.4-25.6-64-64-64H576c-38.4 0-64 25.6-64 64v320c0 38.4 25.6 64 64 64h320c38.4 0 64-25.6 64-64z"
                        fill="#1296db" p-id="19532"></path>
                    <path
                        d="M384 384H64V64h320v320m0 64c38.4 0 64-25.6 64-64V64c0-38.4-25.6-64-64-64H64C25.6 0 0 25.6 0 64v320c0 38.4 25.6 64 64 64h320zM896 384H576V64h320v320m0 64c38.4 0 64-25.6 64-64V64c0-38.4-25.6-64-64-64H576c-38.4 0-64 25.6-64 64v320c0 38.4 25.6 64 64 64h320z"
                        p-id="19533" fill="#1296db"></path>
                </svg></span>
            <span class="ml-2 font-bold text-gray-800 dark:text-gray-200">程序</span>
        </div>
        <n-spin :show="show">
            <ul class="p-2 buttons">
                <li v-for="button in readbedButtonForm" :key="button.id"
                    class="py-1 hover:bg-gray-400/20 hover:font-bold" :data-value="button.value"
                    @click="bedButtonClick($event, button)">
                    <button class="flex flex-row justify-between items-center w-full p-2 ">
                        <span class="flex flex-row items-center text-base">
                            <span class="mr-2 w-6 h-6" v-html="createButtonIconMarkup(button.icon)"></span>
                            <span class=" text-gray-800 dark:text-gray-200">{{ button.text }}</span>
                        </span>
                    </button>
                </li>
                <li v-if="readbedButtonForm.length < 1">
                    <n-result status="500" title="这是什么?" description="其实是找不到配置啦">
                        <template #footer>
                            <n-button @click="onShowModal({ type: 'addButton', state: true })">找一找?</n-button>
                        </template>
                    </n-result>
                </li>
            </ul>
        </n-spin>
        <div>
            <button @click="addButtonClick()" type="button" class="add-button bg-blue-500/90 dark:bg-gray-600/70">
                <span class="button__text dark:text-gray-100">添加</span>
                <span
                    class="button__icon bg-blue-600/60 text-white dark:text-gray-100 active:bg-blue-600 dark:bg-gray-600 dark:active:bg-gray-700"><svg
                        xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" stroke-width="2"
                        stroke-linejoin="round" stroke-linecap="round" stroke="currentColor" height="24" fill="none">
                        <line y2="19" y1="5" x2="12" x1="12"></line>
                        <line y2="12" y1="12" x2="19" x1="5"></line>
                    </svg>
                </span>
            </button>
        </div>
    </div>
</template>

<script setup>
import { dbHelper } from '@/assets/js/db';
import { ref, inject, onMounted } from 'vue';
import { bedFormData } from '@/assets/js/arrayObjectData';
import { createButtonIconMarkup, getChromeStorage } from '@/assets/js/public';
import { defineEmits } from 'vue';
const emit = defineEmits(['foundData', 'addButton']);
const onShowModal = inject('onShowModal');
const readbedButtonForm = ref([]);
const show = ref(false);
async function readbedButton() {
    show.value = true;
    try {
        const dbResult = await dbHelper("exeButtons");
        const { db } = dbResult;
        const sortedResult = await db.getSortedByIndex();

        if (sortedResult.length < 1) {
            onShowModal({ type: "addButton", state: true });
        }

        readbedButtonForm.value = sortedResult;

        const storageResult = await getChromeStorage("ProgramConfiguration");
        if (!storageResult) return;
        let foundObject = bedFormData.find(item => item.name === storageResult.Program);
        if (foundObject) {
            emit('foundData', foundObject);
            let button = document.querySelector("li[data-value='" + storageResult.Program + "']");
            if (button) {
                button.classList.add('bg-green-400/50', 'font-bold');
            }
        }
    } catch (error) {
        console.error("Error processing data:", error);
    } finally {
        show.value = false;
    }
}

onMounted(() => {
    readbedButton();
});

function bedButtonClick(element, bedData) {
    let buttons = element.currentTarget.parentNode.querySelectorAll("li")
    if (buttons) {
        buttons.forEach(button => {
            button.classList.remove('bg-gray-400/50', 'font-bold');
        });
    }
    element.currentTarget.classList.add('bg-gray-400/50', 'font-bold');
    let foundObject = bedFormData.find(item => item.name === bedData.value);
    if (foundObject) {
        emit('foundData', foundObject);
    } else {
        emit('foundData', false);
    }
}

function addButtonClick() {
    emit('addButton', { type: "addButton", state: true });
}
defineExpose({ readbedButton });
</script>
<style scoped>
.buttons {
    height: calc(100vh - 161px);
    overflow: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

::-webkit-scrollbar {
    display: none;
}

.add-button {
    position: relative;
    width: 100%;
    height: 48px;
    cursor: pointer;
    display: flex;
    align-items: center;

}

.add-button,
.button__icon,
.button__text {
    transition: all 0.3s;
}

.add-button .button__text {
    width: 100%;
    color: #fff;
    font-weight: 600;
}

.add-button .button__icon {
    right: 0;
    position: absolute;
    height: 100%;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.add-button .svg {
    width: 30px;
    stroke: #fff;
}

.add-button:hover .button__text {
    color: transparent;
}

.add-button:hover .button__icon {
    width: 100%;
    transform: translateX(0);
}
</style>