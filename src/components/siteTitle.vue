<template>
    <div class="py-4 my-4 text-center">
        <n-ellipsis style="max-width: 500px" class="text-[2.25rem] text-blue-500">
            {{ webtitle || "盘络上传" }}
        </n-ellipsis>

    </div>
</template>
<script setup>
import { getChromeStorage } from '@/assets/js/public';
import { ref } from 'vue';
import HttpRequester from '@/assets/js/httpRequester';
const webtitle = ref(null);

getChromeStorage("ProgramConfiguration").then((result) => {
    webtitle.value = localStorage.webtitle
    const titleMapping = {
        "Custom": "自定义上传",
        "GitHub": "GitHub",
        "Tencent_COS": "腾讯 COS",
        "Aliyun_OSS": "阿里巴巴 OSS",
        "AWS_S3": "AWS S3"
    };
    if (!result || !result.Program) return;
    const Program = result.Program;
    if (titleMapping.hasOwnProperty(Program)) {
        localStorage.webtitle = chrome.i18n.getMessage(titleMapping[Program]);
        localStorage.webtitle_status = 0;
        webtitle.value = localStorage.webtitle;
    }
});

// 更新标题
function updateTitle() {
    getChromeStorage("ProgramConfiguration").then((result) => {
        function fetchTitle(url) {
            return HttpRequester.get(url)
                .then(response => {
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(response.data, 'text/html');
                    let title = doc.querySelector('title') ? doc.querySelector('title').innerText : '';
                    localStorage.webtitle = title;
                    localStorage.webtitle_status = 0;
                    webtitle.value = localStorage.webtitle;
                })
                .catch(error => {
                    console.error(error);
                    throw error; // 抛出错误以进行进一步的错误处理
                });
        }
        fetchTitle('https://' + result.Host)
            .catch(() => {
                return fetchTitle('https://cors-anywhere.pnglog.com/https://' + result.Host);
            })
            .catch(() => {
                localStorage.webtitle = chrome.i18n.getMessage("app_name");
                webtitle.value = localStorage.webtitle;
            });

    });
}

if (localStorage.webtitle_status == 1) {
    updateTitle()
}
window.addEventListener('message', function (event) {
    const { content, data } = event.data;
    if (content == 'webtitle' && data == 'update') {
        updateTitle()
    }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.webTitleNotice) {
        if (request.webTitleNotice.update) {
            updateTitle()
        }
    }
});
</script>