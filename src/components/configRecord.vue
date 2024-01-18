<template>
    <div>
        <div class="bg-blue-500 text-white text-lg font-bold p-2 rounded-t-xl text-center">
            <span>配置记录</span>
        </div>
        <div>
            <div v-if="BedConfigStore.length > 0">
                <div v-for="config in BedConfigStore" :key="config.id"
                    class="flex flex-row justify-between items-center p-1 hover:bg-gray-100">
                    <span class="w-[32px] mr-1" v-html="createIconMarkup(config)"></span>
                    <div class="BedConfigName w-full" @dblclick="enableEditing(config, $event)">
                        <span v-if="!config.isEditing" :data-old-value="config.ConfigName" title="双击修改">{{ config.ConfigName
                        }}</span>
                        <input v-else class="border focus-visible:border-blue-400 focus-visible:outline-none w-full"
                            type="text" v-model="config.ConfigName" @blur="disableEditing(config)"
                            @keyup.enter="disableEditing(config)">
                    </div>
                    <div class="flex flex-row">
                        <button @click="addButton(config)" type="button" class="BedConfigAdd hover:text-blue-300"
                            :title="'加载:[' + config.ConfigName + ' | ' + config.data.Program + ']'">
                            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20">
                                <g fill="none">
                                    <path
                                        d="M6 10a.5.5 0 0 1 .5-.5h3v-3a.5.5 0 0 1 1 0v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3A.5.5 0 0 1 6 10zm4 8a8 8 0 1 0 0-16a8 8 0 0 0 0 16zm0-1a7 7 0 1 1 0-14a7 7 0 0 1 0 14z"
                                        fill="currentColor"></path>
                                </g>
                            </svg>
                        </button>
                        <button @click="shareButton(config)" type="button" class="BedConfigShare hover:text-blue-300 mx-1"
                            :title="'分享:[' + config.ConfigName + ' | ' + config.data.Program + ']'">
                            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20">
                                <g fill="none">
                                    <path
                                        d="M13.33 12.838l4.497-4.423l.057-.065a.587.587 0 0 0-.057-.767L13.33 3.162l-.062-.053c-.36-.27-.89-.01-.89.469v2.13l-.225.015c-3.563.282-5.65 2.537-6.148 6.627c-.064.525.538.854.928.506c1.431-1.278 2.91-2.072 4.445-2.39c.246-.051.493-.09.742-.117l.258-.023v2.096l.005.082c.06.453.609.666.947.334zM12.226 6.72l1.152-.077V4.61l3.446 3.388l-3.446 3.39V9.231l-1.356.122h-.008c-1.703.183-3.31.865-4.827 2.002c.298-1.339.807-2.346 1.476-3.067c.83-.895 1.99-1.443 3.563-1.569zM5.5 4A2.5 2.5 0 0 0 3 6.5v8A2.5 2.5 0 0 0 5.5 17h8a2.5 2.5 0 0 0 2.5-2.5v-1a.5.5 0 0 0-1 0v1a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 4 14.5v-8A1.5 1.5 0 0 1 5.5 5h3a.5.5 0 0 0 0-1h-3z"
                                        fill="currentColor"></path>
                                </g>
                            </svg>
                        </button>
                        <button @click="deleteButton(config)" type="button" class="BedConfigDel hover:text-blue-300"
                            :title="'删除:[' + config.ConfigName + ' | ' + config.data.Program + ']'">
                            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20">
                                <g fill="none">
                                    <path
                                        d="M11.5 4a1.5 1.5 0 0 0-3 0h-1a2.5 2.5 0 0 1 5 0H17a.5.5 0 0 1 0 1h-.554L15.15 16.23A2 2 0 0 1 13.163 18H6.837a2 2 0 0 1-1.987-1.77L3.553 5H3a.5.5 0 0 1-.492-.41L2.5 4.5A.5.5 0 0 1 3 4h8.5zm3.938 1H4.561l1.282 11.115a1 1 0 0 0 .994.885h6.326a1 1 0 0 0 .993-.885L15.438 5zM8.5 7.5c.245 0 .45.155.492.359L9 7.938v6.125c0 .241-.224.437-.5.437c-.245 0-.45-.155-.492-.359L8 14.062V7.939c0-.242.224-.438.5-.438zm3 0c.245 0 .45.155.492.359l.008.079v6.125c0 .241-.224.437-.5.437c-.245 0-.45-.155-.492-.359L11 14.062V7.939c0-.242.224-.438.5-.438z"
                                        fill="currentColor"></path>
                                </g>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <n-result v-else status="404" title="404 资源不存在" description="可能是你还没有配置！" class="py-2">
            </n-result>
        </div>
        <div class="flex flex-row justify-center py-1 border-t">
            <button @click="allShareButton" type="button"
                class="mx-1 flex flex-row items-center px-2 py-1 bg-slate-100 hover:bg-slate-50">
                <svg class="w-5 mr-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 512 512">
                    <path
                        d="M378 324a69.78 69.78 0 0 0-48.83 19.91L202 272.41a69.68 69.68 0 0 0 0-32.82l127.13-71.5A69.76 69.76 0 1 0 308.87 129l-130.13 73.2a70 70 0 1 0 0 107.56L308.87 383A70 70 0 1 0 378 324z"
                        fill="currentColor"></path>
                </svg>
                分享</button>
            <button type="button" class="flex flex-row items-center px-2 py-1 bg-slate-100 hover:bg-slate-50"
                @click="importshow">
                <svg class="w-5 mr-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 512 512">
                    <path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192s192-86 192-192z" fill="none"
                        stroke="currentColor" stroke-miterlimit="10" stroke-width="32"></path>
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"
                        d="M256 176v160"></path>
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"
                        d="M336 256H176"></path>
                </svg>
                导入</button>
            <button type="button" class="mx-1 flex flex-row items-center px-2 py-1 bg-slate-100 hover:bg-slate-50">
                <svg class="w-5 mr-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 512 512">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"
                        d="M448 448V240"></path>
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"
                        d="M64 240v208"></path>
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"
                        d="M382.47 48H129.53c-21.79 0-41.47 12-49.93 30.46L36.3 173c-14.58 31.81 9.63 67.85 47.19 69h2c31.4 0 56.85-25.18 56.85-52.23c0 27 25.46 52.23 56.86 52.23s56.8-23.38 56.8-52.23c0 27 25.45 52.23 56.85 52.23s56.86-23.38 56.86-52.23c0 28.85 25.45 52.23 56.85 52.23h1.95c37.56-1.17 61.77-37.21 47.19-69l-43.3-94.54C423.94 60 404.26 48 382.47 48z">
                    </path>
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"
                        d="M32 464h448"></path>
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"
                        d="M136 288h80a24 24 0 0 1 24 24v88h0h-128h0v-88a24 24 0 0 1 24-24z"></path>
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"
                        d="M288 464V312a24 24 0 0 1 24-24h64a24 24 0 0 1 24 24v152"></path>
                </svg>
                商店
            </button>
        </div>
        <n-drawer v-model:show="importState" :width="500">
            <n-drawer-content title="导入配置" closable class="dark:bg-gray-100/50">
                <n-input v-model:value="textareaData" type="textarea" placeholder="多段对象数据使用,分割" :autosize="{
                    minRows: 5
                }" round clearable />
                <div class="flex justify-center mt-2">
                    <button type="button" @click="configReplace"
                        class=" rounded text-indigo-700 mr-1 px-4 py-1 border border-indigo-400  hover:border-blue-700 hover:bg-blue-700 hover:text-white">替换</button>
                    <button type="button" @click="configAppend"
                        class=" rounded text-indigo-700 ml-1 px-4 py-1 border border-indigo-400  hover:border-blue-700 hover:bg-blue-700  hover:text-white">追加</button>
                </div>
            </n-drawer-content>
        </n-drawer>

    </div>
</template>
<script setup>
import { ref, inject, nextTick, toRaw } from 'vue';
import { dbHelper } from '@/assets/js/db';
import { createIconMarkup, storExeButtons, parseJsonInput } from '@/assets/js/public';
import { useNotification } from 'naive-ui';
const notification = useNotification();
const showMessage = inject('showMessage');
const importState = ref(false);
const textareaData = ref('');
const importshow = () => {
    importState.value = true;
};
let BedConfigStore = ref([]);
// --------
function readBedConfig() {
    dbHelper("BedConfigStore").then(result => {
        const { db } = result;
        // attachImportButtonHandler(db); // 导入
        db.getSortedByIndex().then(BedConfig => {
            console.log("数据库", BedConfig);
            BedConfigStore.value = BedConfig
        });

    }).catch(error => {
        console.error(error);
    });
}
readBedConfig()
// --------
const enableEditing = (config, event) => {
    config.originalConfigName = config.ConfigName; // 保存原始名称
    config.isEditing = true;
    nextTick(() => {
        const inputElement = event.currentTarget.querySelector("input");
        if (inputElement) {
            inputElement.focus();
        }
    });
};

const disableEditing = (config) => {
    config.isEditing = false;
    if (!config.ConfigName || config.ConfigName == config.originalConfigName) {
        config.ConfigName = config.originalConfigName;
        return;
    }
    delete config.originalConfigName; // 清除保存的原始值
    const rawConfig = toRaw(config);
    dbHelper("BedConfigStore").then(result => {
        const { db } = result;
        db.put(rawConfig).then(() => {
            showMessage({ message: "已修改为:" + config.ConfigName, type: "success" });
        });
    });
};
function addButton(config) {
    storExeButtons(config).then(result => {
        notification.success({
            title: "成功",
            content: chrome.i18n.getMessage("Load") + chrome.i18n.getMessage("successful") + ",即将重新加载页面！",
            duration: 3000,
        })
        // 延迟3执行
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    })
}
function shareButton(config) {

    const newData = { ...config } //复制对象
    delete newData.id
    delete newData.index
    navigator.clipboard.writeText(JSON.stringify(newData))
        .then(() => {
            showMessage({ message: config.ConfigName + ":数据已复制到剪切板！", type: "success" })
        })
        .catch(error => {
            showMessage({ message: "复制失败！", type: "error" })
            console.log(error);
        });
}
function deleteButton(config) {
    if (!config) return;
    const index = BedConfigStore.value.findIndex(item => item.id === config.id);
    if (index !== -1) {
        dbHelper("BedConfigStore").then(result => {
            const { db } = result;
            db.delete(config.id).then(() => {
                BedConfigStore.value.splice(index, 1);
                showMessage({ message: chrome.i18n.getMessage("Delete_successful"), type: "success" })
            }).catch(error => {
                showMessage({ message: config.ConfigName + ":好像删除失败了,使用开发者工具(F12)查看错误原因！", type: "success" })
                console.log(error);
            });
        })
    }

}
//全部分享按钮
function allShareButton() {
    if (BedConfigStore.value.length > 0) {
        const modifiedBedConfig = BedConfigStore.value.map(({ id, index, ...rest }) => rest);
        navigator.clipboard.writeText(JSON.stringify(modifiedBedConfig))
            .then(() => {
                showMessage({ message: "全部数据已复制到剪切板！", type: "success" })
            })
            .catch(error => {
                showMessage({ message: "复制失败！", type: "error" })
                console.log(error);
            });
    }

}
const configReplace = () => {
    let value = textareaData.value;
    parseJsonInput(value).then(newArray => {
        dbHelper("BedConfigStore").then(result => {
            const { db } = result;
            db.clear().then(() => {
                db.add(newArray).then(() => {
                    notification.success({
                        title: "成功",
                        content: chrome.i18n.getMessage("Load") + chrome.i18n.getMessage("successful") + ",即将重新加载页面！",
                        duration: 3000,
                    })
                    setTimeout(function () {
                        window.location.reload();
                    }, 1000); // 延迟
                })
            });
        })
    }).catch(error => {
        console.error(error);
        notification[error.type](error.message)
    });
};

const configAppend = () => {
    let value = textareaData.value;
    parseJsonInput(value).then(newArray => {
        dbHelper("BedConfigStore").then(result => {
            const { db } = result;
            db.add(newArray).then(() => {
                notification.success({
                    title: "成功",
                    content: chrome.i18n.getMessage("Load") + chrome.i18n.getMessage("successful") + ",即将重新加载页面！",
                    duration: 3000,
                })
                setTimeout(function () {
                    window.location.reload();
                }, 1000); // 延迟
            })
        })

    }).catch(error => {
        console.error(error);
        notification[error.type](error.message)
    });
};

window.addEventListener('message', function (event) {
    console.log(event.data);
    if (event.data.type === 'Refresh' || data === "[configRecord]") {
        readBedConfig()
    }
});
defineExpose({ readBedConfig });
</script>