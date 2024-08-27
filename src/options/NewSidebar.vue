<template>
    <div class="bg-gray-50  sidebar dark:bg-gray-500 min-w-48">
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
    console.log(1);
    
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
    height: calc(100vh - 168px);
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
    height: 40px;
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