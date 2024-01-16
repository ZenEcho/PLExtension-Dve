<template>
    <div class="py-4 my-4 text-center">
        <a class="text-4xl text-blue-500" href="#">{{ webtitle || "盘络上传" }}</a>
    </div>
</template>
<script setup>
import { getChromeStorage } from '@/assets/js/public';
import { ref } from 'vue';
import axios from 'axios';
const webtitle = ref(null);
getChromeStorage("ProgramConfiguration").then((result) => {
    webtitle.value = localStorage.webtitle
    const titleMapping = {
        "Custom": "Custom_Upload",
        "GitHub": "GitHub",
        "Tencent_COS": "Tencent_COS",
        "Aliyun_OSS": "Alibaba_OSS",
        "AWS_S3": "AWS_S3"
    };
console.log((result.CorsProxyState ? result.CorsProxy : ""));
    const Program = result.Program;
    if (titleMapping.hasOwnProperty(Program)) {
        localStorage.webtitle = chrome.i18n.getMessage(titleMapping[Program]);
        localStorage.webtitle_status = 0;
        webtitle.value = localStorage.webtitle;
    }
    if (localStorage.webtitle_status == 1) {
        // 获取web标题
        if (result.host == "pnglog.com") {
            localStorage.webtitle = "盘络图床";
            localStorage.webtitle_status = 0; // 不获取
            webtitle.value = localStorage.webtitle;
        } else {
            function fetchTitle(url) {
                return axios.get(url)
                    .then(response => {
                        let parser = new DOMParser();
                        let doc = parser.parseFromString(response.data, 'text/html');
                        let title = doc.querySelector('title') ? doc.querySelector('title').innerText : '';
                        console.log(parser);
                        console.log(doc);
                        console.log(doc.querySelector('title'));
                        localStorage.webtitle = title;
                        localStorage.webtitle_status = 0;
                        webtitle.value = localStorage.webtitle;
                    })
                    .catch(error => {
                        console.error("Error fetching title:", error);
                        throw error; // 抛出错误以进行进一步的错误处理
                    });
            }

            fetchTitle((result.CorsProxyState ? result.CorsProxy : "") + 'https://' + result.Host)
                .catch(error => {
                    // 如果第一个请求失败，则尝试第二个请求
                    return fetchTitle('https://cors-anywhere.pnglog.com/https://' + result.Host);
                })
                .catch(error => {
                    // 如果两次请求都失败，设置默认标题
                    localStorage.webtitle = chrome.i18n.getMessage("app_name");
                    webtitle.value = localStorage.webtitle;
                });

        }
    }

});
</script>