<template>
    <n-card title="安装图床程序">
        <template #default>
            <div class="flex flex-wrap justify-center border-y-2 py-2 max-h-[700px] overflow-auto installButton">
                <div v-for="item in  buttonsData " :key="item.value" @click="onClick($event, item)" :data-id="item.value"
                    class="m-1 flex flex-row items-center justify-center w-48 h-20 border hover:bg-gray-50 select-none rounded-sm">
                    <div v-html="createButtonIconMarkup(item.icon)" class="w-8 h-8 mr-1"></div>
                    <div class="text-lg">{{ item.text }}</div>
                </div>
            </div>
        </template>
        <template #footer>
            <div class="w-full flex justify-center items-end">
                <button type="button"
                    class="text-lg py-2 px-6 border border-b-2 hover:border-b-blue-400 active:border-b-blue-500"
                    @click="startHandle">选好了</button>
                <button type="button"
                    class="ml-2 text-lg py-1 px-4 border border-b-2 hover:border-b-gray-400 active:border-b-gray-500"
                    @click="uncheck">取消</button>

            </div>
        </template>
    </n-card>
</template>
<script setup>
import { createButtonIconMarkup } from '@/assets/js/public';
import { buttonsData } from '@/assets/js/arrayObjectData';
import { defineEmits } from 'vue';
import { dbHelper } from '@/assets/js/db';
const emit = defineEmits(['addButton']);
const selectedData = [];
function onClick(event, item) {
    event.currentTarget.classList.toggle('active');

    if (event.currentTarget.classList.contains('active')) {
        selectedData.push(item);
    } else {
        const index = selectedData.findIndex(i => i.value === item.value);
        if (index > -1) {
            selectedData.splice(index, 1);
        }
    }
}

function uncheck() {
    selectedData.length = 0
    const targetDivs = document.querySelectorAll(`.installButton div.active`);
    targetDivs.forEach(div => {
        div.classList.remove('active');
    });
}
function startHandle() {
    //排序数据
    let indexedData = selectedData.map((item, index) => {
        return {
            ...item, // 展开原始对象
            index    // 添加 index 属性
        };
    });
    if (indexedData.length > 0) {
        dbHelper("exeButtons").then(result => {
            const { db } = result;
            db.clear().then(() => {
                db.put(indexedData).then(() => {
                    emit('addButton', { type: "addButton", state: false });
                });
            })
        }).catch(error => {
            console.error("Error opening database:", error);
        });
    } else {
        emit('addButton', { type: "addButton", state: false });
    }

}
dbHelper("exeButtons").then(result => {
    // 处理获取到的配置数据
    const { db } = result;
    db.getSortedByIndex().then(result => {
        result.forEach(element => {
            selectedData.push(element);
            const targetDivs = document.querySelectorAll(`.installButton div[data-id='${element.value}']`);
            targetDivs.forEach(div => {
                div.classList.add('active');
            });
        });
    });
})
</script>
<style scoped>
.active {
    border-color: rgb(135, 167, 235);
}
</style>