<template>
    <header
        class="shadow dark:bg-gray-700 top-0 z-10 min-w-[210px] border-r h-screen sticky overflow-auto max-md:hidden">
        <div>
            <!-- logo -->
            <div class="flex flex-row items-center justify-center h-16  my-2">
                <img src="@/assets/images/logo128.png" alt="logo" class=" h-14 border rounded-2xl bg-slate-300"></img>
                <span class=" ml-4 text-2xl text-gray-800 dark:text-gray-200">Puplaod</span>
            </div>
        </div>
        <n-divider dashed title-placement="left" class="!m-0 !mt-4 text-sm dark:text-gray-200">
            我的上传
        </n-divider>
        <ul class="flex flex-col w-11/12  max-sm:w-full list-none p-0">
            <li v-for="item in headerData" :key="item.link"
                class="nav-item text-gray-800 pl-2  py-2  max-sm:border-transparent  hover:text-gray-700"
                :data-url="item.link">

                <a :href="item.link"
                    class="flex flex-row text-gray-800  h-full text-base items-center dark:text-gray-200 text-decoration-none">
                    <span :class="{ ' text-gray-600 dark:text-blue-400': isCurrentPage(item.link) }" class="mr-1 h-6"
                        v-html="item.icon"></span>

                    <div class="flex flex-row w-full">
                        <span :class="{ 'font-bold  text-gray-600  dark:text-blue-400': isCurrentPage(item.link) }">{{
                            item.text
                            }}</span>
                        <span v-if="item.text == '配置信息'" class="h-[24px] w-[24px] pl-4">
                            <div v-if="isCurrentPage(item.link) == true"
                                class="i-material-symbols-light-keyboard-arrow-down w-full h-full">
                            </div>
                            <div v-else class="i-material-symbols-light:keyboard-arrow-up w-full h-full"></div>
                        </span>
                    </div>
                </a>
                <div v-if="isCurrentPage(item.link) == true && item.text == '配置信息'">
                    <NewSidebar @foundData="handleFoundData" @addButton="onShowModal" ref="newSidebarRef" />
                </div>
            </li>
            <li class="nav-item text-gray-800 px-3 list-none flex border-b border-transparent dark:text-gray-200">
                <button class=" w-10 h-10 flex border-0 bg-transparent text-gray-800  dark:text-gray-200" type="button "
                    @click="toggleDarkMode">

                    <div v-show="!isDarkMode" class="i-material-symbols-light:mode-night-outline  w-full h-full"></div>
                    <div v-show="isDarkMode" class="i-material-symbols-light:light-mode-outline w-full h-full ">
                    </div>
                </button>
            </li>
        </ul>
    </header>
    <div class="absolute top-0 z-10 w-full">
        <div class="absolute left-0  i-lucide:ellipsis w-3em h-3em hidden !max-md:block"
            @click="IndentationShowHidden(true, $event)"></div>

        <div class="absolute right-0  i-raphael:arrowleft w-3em h-3em hidden"
            @click="IndentationShowHidden(false, $event)">
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue';
import { headerData } from '@/assets/js/arrayObjectData';
import NewSidebar from '@/options/NewSidebar.vue'
import { defineEmits } from 'vue';
const newSidebarRef = ref(null);
const emit = defineEmits(['foundData', 'addButton']);

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

const IndentationShowHidden = (state, event) => {
    // 获取触发事件的元素
    const clickedElement = event.target;
    // 上一个同级元素
    const previousSiblingElement = clickedElement.previousElementSibling;
    // 下一个同级元素
    const nextSiblingElement = clickedElement.nextElementSibling;
    const parentElement = clickedElement.parentElement; //父亲
    if (state) {
        clickedElement.classList.add('hidden');//显示自己
        clickedElement.classList.remove('!max-md:block');
        parentElement.parentElement.querySelector('header').classList.remove('max-md:hidden', "hidden")
        nextSiblingElement.classList.remove("hidden") //显示兄弟元素
    } else {
        clickedElement.classList.add("hidden") //显示自己
        parentElement.parentElement.querySelector('header').classList.add('hidden')
        previousSiblingElement.classList.remove("hidden") //显示兄弟元素
    }

};




const handleFoundData = (data) => {
    emit('foundData', data);
}
const onShowModal = () => {
    emit('addButton', { type: "addButton", state: true });
}

watchEffect(() => {
    if (isDarkMode.value) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
});
</script>
<style scoped>
header {
    scrollbar-width: none;
    /* 适用于 Firefox */
    -ms-overflow-style: none;
}

header::-webkit-scrollbar {
    display: none;
}
</style>
