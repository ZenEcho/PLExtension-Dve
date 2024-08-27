<template>
    <header class="shadow bg-blue-600 dark:bg-gray-700 sticky top-0 z-10">
        <ul class="flex flex-row w-11/12 justify-end max-sm:w-full h-[80px]">
            <li v-for="item in navItems" :key="item.i18n"
                class="nav-item text-gray-200 px-3  border-b max-sm:border-transparent max-sm:hidden hover:text-gray-100"
                :class="{ ' border-sky-400': isCurrentPage(item.link) }">
                <a :href="item.link" class="flex flex-row h-full text-lg items-center dark:text-gray-200">
                    <span :class="{ ' text-gray-50 dark:text-blue-400': isCurrentPage(item.link) }" class="mr-1 h-6"
                        v-html="item.icon"></span>
                    <span :class="{ 'font-bold  text-gray-50  dark:text-blue-400': isCurrentPage(item.link) }">{{
                        item.text
                        }}</span>
                </a>
            </li>
            <li class="nav-item text-gray-200 px-3 list-none flex sm:hidden border-b border-transparent">
                <button class="w-6 flex" type="button " @click="activate">
                    <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 28 28">
                        <g fill="none">
                            <path
                                d="M8.75 14a2.75 2.75 0 1 1-5.5 0a2.75 2.75 0 0 1 5.5 0zm8 0a2.75 2.75 0 1 1-5.5 0a2.75 2.75 0 0 1 5.5 0zM22 16.75a2.75 2.75 0 1 0 0-5.5a2.75 2.75 0 0 0 0 5.5z"
                                fill="currentColor"></path>
                        </g>
                    </svg>
                </button>
            </li>
            <li class="nav-item text-gray-200 px-3 list-none flex border-b border-transparent">
                <button class="w-6 flex" type="button " @click="toggleDarkMode">

                    <svg v-show="!isDarkMode" xmlns="http://www.w3.org/2000/svg" class="w-full h-full"
                        xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512">
                        <path
                            d="M160 136c0-30.62 4.51-61.61 16-88C99.57 81.27 48 159.32 48 248c0 119.29 96.71 216 216 216c88.68 0 166.73-51.57 200-128c-26.39 11.49-57.38 16-88 16c-119.29 0-216-96.71-216-216z"
                            fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="32">
                        </path>
                    </svg>

                    <svg v-show="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="w-full h-full"
                        xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32">
                        <path d="M16 12.005a4 4 0 1 1-4 4a4.005 4.005 0 0 1 4-4m0-2a6 6 0 1 0 6 6a6 6 0 0 0-6-6z"
                            fill="currentColor"></path>
                        <path d="M5.394 6.813l1.414-1.415l3.506 3.506L8.9 10.318z" fill="currentColor"></path>
                        <path d="M2 15.005h5v2H2z" fill="currentColor"></path>
                        <path d="M5.394 25.197L8.9 21.691l1.414 1.415l-3.506 3.505z" fill="currentColor"></path>
                        <path d="M15 25.005h2v5h-2z" fill="currentColor"></path>
                        <path d="M21.687 23.106l1.414-1.415l3.506 3.506l-1.414 1.414z" fill="currentColor"></path>
                        <path d="M25 15.005h5v2h-5z" fill="currentColor"></path>
                        <path d="M21.687 8.904l3.506-3.506l1.414 1.415l-3.506 3.505z" fill="currentColor"></path>
                        <path d="M15 2.005h2v5h-2z" fill="currentColor"></path>
                    </svg>
                </button>
            </li>
        </ul>
    </header>
    <n-drawer v-model:show="active" :width="200">
        <ul class="w-full">
            <li v-for="item in navItems" :key="item.i18n" class="nav-item text-gray-800 px-3 list-none my-2">
                <a :href="item.link" class="flex flex-row h-6 text-lg hover:text-blue-400">
                    <span class="mr-1" v-html="item.icon"></span>
                    <span>{{ item.text }}</span>
                </a>
            </li>
        </ul>
    </n-drawer>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue';
import { NDrawer } from 'naive-ui';
import { headerData } from '@/assets/js/arrayObjectData';
const active = ref(false);
const activate = () => {
    active.value = true;
};

const navItems = headerData;
const currentFilename = computed(() => {
    const path = window.location.href;
    const filename = path.substring(path.lastIndexOf('/') + 1);
    return filename;
});
const isCurrentPage = (link) => {
    return currentFilename.value === link;
};

const isDarkMode = ref(localStorage.getItem('darkMode') === 'true');

const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    localStorage.setItem('darkMode', isDarkMode.value.toString());
};
watchEffect(() => {
    if (isDarkMode.value) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
});
</script>
