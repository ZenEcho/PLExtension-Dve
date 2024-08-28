<template>
    <div class="sidebar">
        <n-spin :show="show">
            <ul class="py-2 buttons list-none pl-2">
                <li v-for="button in readbedButtonForm" :key="button.id" class="py-2 group" :data-value="button.value"
                    @click="bedButtonClick($event, button)">
                    <button class="flex flex-row text-base items-center w-full">
                        <span class="mr-2 w-6 h-6" v-html="createButtonIconMarkup(button.icon)"></span>
                        <span
                            class="text-gray-700 dark:text-gray-300 group-hover:text-blue-700/60 dark:group-hover:text-blue-500">{{
                                button.text
                            }}</span>
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
        <div class="flex flex-col items-center">
            <n-divider dashed class="!m-0 !mt-2 text-sm dark:text-gray-200 !mb-2" />
            <button @click="addButtonClick()" type="button"
                class="i-ph:plus-fill h-8 w-full text-gray-700 dark:text-gray-300">
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
                button.classList.add('bg-green-400/50');
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
            button.classList.remove('bg-blue-100');
        });
    }
    element.currentTarget.classList.add('bg-blue-100');
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
/* 选中 */
.select {
    color: green !important;
}
</style>