<template>
    <n-card title="安装图床程序">
        <template #default>
            <div class="flex flex-wrap">
                <div v-for="item in buttonsData" :key="item.id"
                    class="m-2 flex flex-row items-center justify-center w-40 h-20 bg-slate-50 border">
                    <div v-html="createButtonIconMarkup(item.icon)" class="w-8 h-8"></div>
                    <div>{{ item.text }}</div>
                </div>
            </div>
        </template>
        <template #footer>
            尾部
        </template>
    </n-card>
</template>
<script setup>
import { createButtonIconMarkup } from '@/assets/js/public';
import { buttonsData } from '@/assets/js/arrayObjectData';
console.log(buttonsData);
</script>