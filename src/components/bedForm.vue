<template>
    <form @submit.prevent="handleSubmit($event)">
        <div v-if="props.formGroups" class=" w-full h-full">
            <n-spin :show="show">
                <div ref="formContainer"></div>
            </n-spin>

        </div>
        <div v-else>
            <n-result status="404" title="404 资源不存在" description="会不会是没有选择图床呢？">
                <template #footer>
                    <n-button>不会选择？点我！</n-button>
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
import { storeBedConfig, autoExpand, storProgramConfiguration, getChromeStorage } from '@/assets/js/public';;
const showNotification = inject('showNotification');
const props = defineProps({
    formGroups: Object
});
const formContainer = ref(null);
const show = ref(false);
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
        show.value=true
        if (formContainer.value) {
            formContainer.value.innerHTML = '';
            props.formGroups.element.forEach(element => {
                formContainer.value.appendChild(createFormElement(element));
            });
        }
        // 延迟100毫秒加载数据
        setTimeout(() => {
            getChromeStorage("ProgramConfiguration").then((result) => {
                show.value=false;
                if (!result) return;
                let newData = { ...result };
                delete newData.program;
                let ids = extractIds(props.formGroups.element);
                setFormValues(newData, ids);
            });
        }, 100);

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
    console.log(result);
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
                formData['Token'] = string.value
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
    formData["program"] = props.formGroups.name //存储当前程序名称
    storeBedConfig(formData, (data) => {
        showNotification(data.type, data.message)
        emits('submit-success');
    })
    storProgramConfiguration(formData).catch((data, error) => {
        showNotification(data.type, data.message)
        console.log(error);
    });
    let buttons = document.querySelectorAll(".buttons li")
    if (buttons) {
        buttons.forEach(button => {
            button.classList.remove('bg-green-400/50', 'font-bold');
        });
        document.querySelector(".buttons li[data-value='" + props.formGroups.name + "']").classList.add('bg-green-400/50', 'font-bold')
    }


    // window.postMessage({ type: 'Refresh', data: "[configRecord]" })
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
</style>