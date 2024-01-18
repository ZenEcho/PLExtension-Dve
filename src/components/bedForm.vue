<template>
    <form @submit.prevent="handleSubmit($event)">
        <div v-if="props.formGroups" class=" w-full h-full">
            <n-spin :show="show">
                <div ref="formContainer"></div>
                <div v-if="isCloseCors(props.formGroups.name)">
                    <button type="button" class="mb-3 w-full flex flex-col items-center" @click="CorsProxyState(true)"
                        v-if="!CorsProxy">
                        <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                            viewBox="0 0 20 20">
                            <g fill="none">
                                <path
                                    d="M15.794 8.733a.75.75 0 0 1-.026 1.06l-5.25 5.001a.75.75 0 0 1-1.035 0l-5.25-5a.75.75 0 0 1 1.034-1.087l4.734 4.508l4.733-4.508a.75.75 0 0 1 1.06.026zm0-4a.75.75 0 0 1-.026 1.06l-5.25 5.001a.75.75 0 0 1-1.035 0l-5.25-5a.75.75 0 0 1 1.034-1.087l4.734 4.509l4.733-4.51a.75.75 0 0 1 1.06.027z"
                                    fill="currentColor"></path>
                            </g>
                        </svg>
                        <p><span class="text-gray-600">CORS代理</span></p>
                    </button>
                    <div class="mb-3 w-full flex flex-col" v-if="CorsProxy">
                        <label class="mb-1  w-full flex flex-row items-center" for="Host">CORS代理<p
                                class="text-xs text-gray-600">
                                (项目地址:<a href="https://github.com/Rob--W/cors-anywhere"
                                    target="_blank">Github</a>),例如:https://cors-anywhere.herokuapp.com/</p>
                        </label>
                        <input class="px-1 h-8 border focus-visible:border-blue-400 focus-visible:outline-none"
                            id="CorsProxy" type="url" placeholder="输入CORS代理服务器地址" required="true">
                    </div>
                    <button type="button" class="mb-3 w-full flex flex-col items-center" @click="CorsProxyState(false)"
                        v-if="CorsProxy">
                        <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                            viewBox="0 0 24 24">
                            <path d="M6 17.59L7.41 19L12 14.42L16.59 19L18 17.59l-6-6z" fill="currentColor"></path>
                            <path d="M6 11l1.41 1.41L12 7.83l4.59 4.58L18 11l-6-6z" fill="currentColor"></path>
                        </svg>
                        <p><span class="text-gray-600">CORS代理</span></p>
                    </button>
                </div>

            </n-spin>
            <n-collapse v-if="props.formGroups.name === 'Custom'" @item-header-click="handleCollapseClick">
                <n-collapse-item title="上传前设置" name="1">
                    <div class="flex flex-row items-center my-1">
                        <label class="switch flex">
                            <input type="checkbox" id="custom_Base64Upload">
                            <span class="slider"></span>
                        </label>
                        <div class="flex flex-row ml-1 items-center">
                            <p>Base64上传</p><span class="ml-1 text-xs text-gray-600">(将文件转为Base64上传)</span>
                        </div>
                    </div>
                    <div class="flex flex-row items-center my-1">
                        <label class="switch flex">
                            <input type="checkbox" id="custom_Base64UploadRemovePrefix">
                            <span class="slider"></span>
                        </label>
                        <div class="flex flex-row ml-1 items-center">
                            <p>Base64抬头</p><span class="ml-1 text-xs text-gray-600">(移除Base64的抬头信息)</span>
                        </div>
                    </div>
                    <div class="flex flex-row items-center my-1">
                        <label class="switch flex">
                            <input type="checkbox" id="custom_BodyUpload">
                            <span class="slider"></span>
                        </label>
                        <div class="flex flex-row ml-1 items-center">
                            <p>Body上传</p><span class="ml-1 text-xs text-gray-600">(封装Body信息上传,否则FormData封装上传)</span>
                        </div>
                    </div>
                    <div class="flex flex-row items-center my-1">
                        <label class="switch flex">
                            <input type="checkbox" id="custom_BodyStringify">
                            <span class="slider"></span>
                        </label>
                        <div class="flex flex-row ml-1 items-center">
                            <p>Body字符串</p><span class="ml-1 text-xs text-gray-600">(将Body转为字符串)</span>
                        </div>
                    </div>
                </n-collapse-item>
                <n-collapse-item title="上传成功后" name="2">
                    <div class="flex flex-row items-center my-1">
                        <label class="switch flex">
                            <input type="checkbox" id="custom_ReturnJson">
                            <span class="slider"></span>
                        </label>
                        <div class="flex flex-row ml-1 items-center">
                            <p>返回JSON结果</p><span class="ml-1 text-xs text-gray-600">(将上传完毕的信息,化为JSON)</span>
                        </div>
                    </div>
                    <div class="flex flex-row items-center my-1">
                        <label class="switch flex">
                            <input type="checkbox" id="custom_KeywordReplacement">
                            <span class="slider"></span>
                        </label>
                        <div class="flex flex-row ml-1 items-center">
                            <p>关键词替换</p><span class="ml-1 text-xs text-gray-600">(替换返回信息里的某一段内容)</span>
                        </div>
                    </div>
                </n-collapse-item>
                <n-collapse-item title="变量函数" name="3">
                    <n-descriptions bordered>
                        <n-descriptions-item label="$date$">
                            表示日期:2023年10月13日
                        </n-descriptions-item>
                        <n-descriptions-item label="$date-yyyy$">
                            表示年:2023
                        </n-descriptions-item>
                        <n-descriptions-item label="$date-mm$">
                            表示月:10
                        </n-descriptions-item>
                        <n-descriptions-item label="$date-dd$">
                            表示日:13
                        </n-descriptions-item>
                        <n-descriptions-item label="$date-time$">
                            毫秒时间戳:1697183031000
                        </n-descriptions-item>
                        <n-descriptions-item label="$file$">
                            表示上传的文件,开启了Base64后表示Base64
                        </n-descriptions-item>
                        <n-descriptions-item label="$fileName$">
                            表示文件名:1.png
                        </n-descriptions-item>
                        <n-descriptions-item label="$fileSize$">
                            表示文件的大小
                        </n-descriptions-item>
                        <n-descriptions-item label="$fileType$">
                            表示文件的类型
                        </n-descriptions-item>
                    </n-descriptions>
                </n-collapse-item>
            </n-collapse>
        </div>
        <div v-else>
            <n-result status="418" title="我是个杯具" description="一切尽在不言中">
                <template #footer>
                    <n-button @click="onShowModal({ type: 'addButton', state: true })">没有安装图床？点我安装！</n-button>
                </template>
            </n-result>
        </div>
        <div class="flex justify-center py-4" v-if="props.formGroups">
            <button class="text-white bg-green-600 p-2 px-4 w-9/12 active:bg-green-700" type="submit">保存 /
                启动</button>
        </div>

    </form>
</template>
  
<script setup>
import { defineProps, ref, watchEffect, inject, defineEmits } from "vue";
import { storeBedConfig, autoExpand, storProgramConfiguration, getChromeStorage } from '@/assets/js/public';
import HttpRequester from '@/assets/js/httpRequester';
import { useNotification } from 'naive-ui';
const onShowModal = inject('onShowModal');
const props = defineProps({
    formGroups: Object
});
const notification = useNotification();
const formContainer = ref(null);
const show = ref(false);
const CorsProxy = ref(false); // 初始为 false

const createFormElement = (element) => {
    // 使用element.type来创建元素，使函数更通用
    const el = document.createElement(element.type);

    // 设置元素的属性
    if (element.attributes) {
        for (const [key, value] of Object.entries(element.attributes)) {
            el.setAttribute(key, value);
        }
    }

    // 特殊处理select元素的options
    if (element.type === 'select' && element.options) {
        element.options.forEach(option => {
            const optionEl = document.createElement('option');
            optionEl.value = option.value;
            optionEl.textContent = option.text;
            if (element.selected && element.selected === option.value) {
                optionEl.selected = true;
            }
            el.appendChild(optionEl);
        });
    }

    // 如果存在子元素，递归创建
    if (element.children && element.children.length > 0) {
        element.children.forEach(child => {
            el.appendChild(createFormElement(child));
        });
    }

    // 处理文本内容（例如label）
    if (element.text) {
        el.textContent = element.text;
    }

    return el;
};

const emits = defineEmits(['submit-success']);

watchEffect(() => {
    if (props.formGroups && props.formGroups.element) {
        show.value = true
        if (formContainer.value) {
            formContainer.value.innerHTML = '';
            props.formGroups.element.forEach(element => {
                formContainer.value.appendChild(createFormElement(element));
            });

            // 延迟100毫秒加载数据
            setTimeout(() => {
                getChromeStorage("ProgramConfiguration").then((result) => {
                    show.value = false;
                    if (!result) return;
                    let newData = { ...result };
                    delete newData.Program;
                    let ids = extractIds(props.formGroups.element);
                    setFormValues(newData, ids);
                });
            }, 100);
        }

    }

});

function extractIds(elements) {
    const ids = [];
    elements.forEach(element => {
        if (element.attributes && element.attributes.id) {
            ids.push(element.attributes.id);
        }
        if (element.children) {
            ids.push(...extractIds(element.children));
        }
    });

    return ids;
}

function setFormValues(result, ids) {
    ids.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            const type = element.type ? element.type.toLowerCase() : null;
            // 对于文本输入框、密码框、选择框和文本域
            if (type === 'text' || type === 'password' || type === 'url') {
                element.value = result[id] || '';
            }
            else if (element.tagName.toLowerCase() === 'textarea') {
                element.value = result[id] || '';
                autoExpand(element);
            }
            // 对于复选框
            else if (type === 'checkbox') {
                element.checked = result[id] || false;
            }
            // 对于单选按钮
            else if (type === 'radio') {
                if (result[element.name] !== undefined) {
                    element.checked = element.value === result[element.name];
                }
            }
        }
    });
    if (props.formGroups.name == "SM_MS") {
        document.getElementById("Host").value = "sm.ms"
    }
    if (props.formGroups.name == "Lsky") {
        if (result.Host) {
            // 相册
            HttpRequester.get("https://" + result.Host + "/api/v1/albums", {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': result.Token
                }
            })
                .then(response => {
                    let albums = response.data.data.data;
                    let albumSelect = document.getElementById("Album_id");
                    albumSelect.innerHTML = ''; // 清空现有选项
                    let defaultOption = document.createElement("option");
                    defaultOption.selected = true;
                    defaultOption.value = "";
                    defaultOption.textContent = chrome.i18n.getMessage("default");
                    albumSelect.appendChild(defaultOption);

                    albums.forEach(function (e, index) {
                        let option = document.createElement("option");
                        option.value = e.id;
                        option.textContent = e.name;
                        albumSelect.appendChild(option);
                    });

                    if (result.Album_id) {
                        albumSelect.value = result.Album_id;
                    } else {
                        let firstOption = albumSelect.querySelector('option:first-child');
                        if (firstOption) {
                            firstOption.selected = true;
                        }
                        storProgramConfiguration({ 'Album_id': albumSelect.value })
                    }
                })
                .catch(error => {
                    let defaultOption = document.createElement("option");
                    defaultOption.selected = true;
                    defaultOption.value = "NO";
                    defaultOption.textContent = chrome.i18n.getMessage("Unable_to_obtain_album");
                    document.getElementById("Album_id").appendChild(defaultOption);
                    console.error(chrome.i18n.getMessage("request_failure"), error);
                });

            // 存储源
            HttpRequester.get("https://" + result.Host + "/api/v1/strategies", {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': result.Token
                }
            })
                .then(response => {
                    let strategies = response.data.data.strategies;
                    if (strategies.length > 0) {
                        let SourceSelect = document.getElementById("Source");
                        SourceSelect.innerHTML = '';
                        strategies.forEach(function (e, index) {
                            let option = document.createElement("option");
                            option.value = e.id;
                            option.textContent = e.name;
                            SourceSelect.appendChild(option);
                        });
                        if (result.Source) {
                            SourceSelect.value = result.Source;
                        } else {
                            let firstOption = SourceSelect.querySelector('option:first-child');
                            if (firstOption) {
                                firstOption.selected = true;
                            }
                            storProgramConfiguration({ 'Source': SourceSelect.value })
                        }
                    } else {
                        let source = document.getElementById("Source").parentElement
                        document.getElementById("Source").remove();
                        let input = document.createElement("input");
                        input.type = "text";
                        input.id = "Source";
                        input.placeholder = "输入源ID";
                        input.className = "px-1 h-8 border focus-visible:border-blue-400 focus-visible:outline-none";
                        source.appendChild(input)
                        document.getElementById("Source").value = result.Source;
                    }
                })
                .catch(error => {
                    let defaultOption = document.createElement("option");
                    defaultOption.selected = true;
                    defaultOption.value = "NO";
                    defaultOption.textContent = chrome.i18n.getMessage("Unable_to_obtain_storage_source");
                    document.getElementById("Source").appendChild(defaultOption);
                    console.error(chrome.i18n.getMessage("request_failure"), error);
                });
        }
    }
    isCorsProxyState()
}
function handleCollapseClick({ expanded }) {
    if (expanded) {
        let ids = [
            "custom_Base64Upload",
            "custom_Base64UploadRemovePrefix",
            "custom_BodyUpload",
            "custom_BodyStringify",
            "custom_ReturnJson",
            "custom_KeywordReplacement",
        ]
        getChromeStorage("ProgramConfiguration").then((result) => {
            ids.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    const type = element.type ? element.type.toLowerCase() : null;
                    if (type === 'checkbox') {
                        element.checked = result[id] || false;
                    }
                }
            });
        });
    }
}

// 保存
function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    let formData = {};
    form.querySelectorAll('input').forEach(input => {
        if (input.type === 'radio') {
            if (input.checked) {
                formData[input.name] = input.value;
            }
        } else if (input.type === 'checkbox') {
            formData[input.id] = input.checked;
        } else {
            formData[input.id] = input.value;
        }
    });

    form.querySelectorAll('select').forEach(select => {
        formData[select.id] = select.value;
    });

    form.querySelectorAll('textarea').forEach(textarea => {
        formData[textarea.id] = textarea.value;
    });
    switch (props.formGroups.name) {
        case 'Lsky':
            let string = document.getElementById("Token").value
            let pattern = /^Bearer\s/;
            if (pattern.test(string)) {
                formData['Token'] = string
            } else {
                formData['Token'] = `Bearer ` + string
            }
            break;
        case 'Telegra_ph':
            formData['Host'] = "telegra.ph"
            break;
        case 'Imgur':
            // formData['imgur_post_mode'] = $('#options_imgur_post_mode').is(':checked')
            break;
        case 'Custom':
            formData['Host'] = document.getElementById("Url").value
            break;
        case 'fiftyEight':
            formData['Host'] = "cn.58.com"
            break;
        case 'BaiJiaHaoBed':
            formData['Host'] = "baijiahao.baidu.com"
            break;
        case 'freebufBed':
            formData['Host'] = "www.freebuf.com"
            break;
        case 'toutiaoBed':
            formData['Host'] = "www.toutiao.com"
            break;
    }
    formData["Program"] = props.formGroups.name //存储当前程序名称
    storeBedConfig(formData, (data) => {
        notification[data.type](data.message)
        emits('submit-success');
    })
    storProgramConfiguration(formData).catch((data, error) => {
        notification[data.type](data.message)
        console.log(error);
    });
    let buttons = document.querySelectorAll(".buttons li")
    if (buttons) {
        buttons.forEach(button => {
            button.classList.remove('bg-green-400/50', 'font-bold');
        });
        document.querySelector(".buttons li[data-value='" + props.formGroups.name + "']").classList.add('bg-green-400/50', 'font-bold')
    }
}
function isCorsProxyState() {
    getChromeStorage("ProgramConfiguration").then((result) => {
        CorsProxy.value = result.CorsProxyState || false;
        if (result.CorsProxyState) {
            // 延迟500毫秒
            setTimeout(() => {
                let CorsProxy = document.getElementById("CorsProxy")
                if (!CorsProxy) return;
                CorsProxy.value = result.CorsProxy
            }, 500);
        }
    });
}
function CorsProxyState(State) {
    CorsProxy.value = State
    show.value = true;
    storProgramConfiguration({ 'CorsProxyState': State }).then(() => {
        if (State) {
            getChromeStorage("ProgramConfiguration").then((result) => {
                if (result.CorsProxy) {
                    document.getElementById("CorsProxy").value = result.CorsProxy
                }

            });
        }
        show.value = false;
    })
}
function isCloseCors(name) {
    if (name == 'Tencent_COS' || name == 'Aliyun_OSS' || name == 'AWS_S3') {
        return false;
    } else {
        return true;
    }

}
</script>
<style scoped>
.text-sm {
    font-size: 0.75rem;
    /* 12px */
    line-height: 1rem;
    /* 16px */
}

.text-gray-600 {
    color: rgb(75 85 99);
}

.switch {
    --button-width: 32px;
    --button-height: 18px;
    --toggle-diameter: 14px;
    --button-toggle-offset: calc((var(--button-height) - var(--toggle-diameter)) / 2);
    --toggle-shadow-offset: 10px;
    --toggle-wider: 3em;
    --color-grey: #cccccc;
    --color-green: #4296f4;
}

.slider {
    display: inline-block;
    width: var(--button-width);
    height: var(--button-height);
    background-color: var(--color-grey);
    border-radius: calc(var(--button-height) / 2);
    position: relative;
    transition: 0.3s all ease-in-out;
}

.slider::after {
    content: "";
    display: inline-block;
    width: var(--toggle-diameter);
    height: var(--toggle-diameter);
    background-color: #fff;
    border-radius: calc(var(--toggle-diameter) / 2);
    position: absolute;
    top: var(--button-toggle-offset);
    transform: translateX(var(--button-toggle-offset));
    box-shadow: var(--toggle-shadow-offset) 0 calc(var(--toggle-shadow-offset) * 4) rgba(0, 0, 0, 0.1);
    transition: 0.3s all ease-in-out;
}

.switch input[type="checkbox"]:checked+.slider {
    background-color: var(--color-green);
}

.switch input[type="checkbox"]:checked+.slider::after {
    transform: translateX(calc(var(--button-width) - var(--toggle-diameter) - var(--button-toggle-offset)));
    box-shadow: calc(var(--toggle-shadow-offset) * -1) 0 calc(var(--toggle-shadow-offset) * 4) rgba(0, 0, 0, 0.1);
}

.switch input[type="checkbox"] {
    display: none;
}

.switch input[type="checkbox"]:active+.slider::after {
    width: var(--toggle-wider);
}

.switch input[type="checkbox"]:checked:active+.slider::after {
    transform: translateX(calc(var(--button-width) - var(--toggle-wider) - var(--button-toggle-offset)));
}
</style>