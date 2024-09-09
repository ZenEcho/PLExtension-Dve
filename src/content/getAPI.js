const dataWithFunctions = {
    "lsky": {
        "url": "/user/tokens",
        "element": "#token-create",
        "function": function () {
            let pathname = localStorage.getItem(getCurrentDomain())
            if (pathname !== "true") {
                window.createNotification({
                    title: `发现：` + chrome.i18n.getMessage("app_name") + `可配置图床`,
                    type: "警告",
                    content: `点击【创建 Token】按钮，在【创建成功】页点击【添加到` + chrome.i18n.getMessage("app_name") + `】按钮，可加载到` + chrome.i18n.getMessage("app_name") + `扩展。`,
                    duration: 0,
                    buttons: [
                        {
                            text: "添加到" + chrome.i18n.getMessage("app_name"),
                            style: "padding: 2px;width: 100%;border: none;border-radius: 10px;margin-bottom: 5px;",
                            init: function () {
                                this.addEventListener("click", function () {
                                    try {
                                        let token = document.querySelector("#token-create-success p:nth-child(2)").textContent;
                                        let data = {
                                            "data": {
                                                "Album_id": "",
                                                "Program": "Lsky",
                                                "Host": getCurrentDomain(),
                                                "Permission": "0",
                                                "Source": "2",
                                                "Token": "Bearer " + token
                                            },
                                            "ConfigName": getCurrentDomain() + chrome.i18n.getMessage("Config")
                                        }
                                        chrome.runtime.sendMessage({ loadConfig: { external: data } });
                                        this.disabled = true
                                    } catch (error) {
                                        alert("获取 Token 失败，请点击【创建 Token】按钮创建Token")
                                        // 延迟1秒
                                        setTimeout(function () {
                                            window.createNotification({
                                                title: `权限调用询问`,
                                                type: "警告",
                                                content: `是否允许【` + chrome.i18n.getMessage("app_name") + "】调用本站的 cookie,用于一键获取token？<br>注意：本次调用将涉及您的隐私,如果您不同意调用请无视。",
                                                duration: 0,
                                                buttons: [
                                                    {
                                                        text: "允许并获取token",
                                                        style: "padding: 2px;width: 100%;border: none;border-radius: 10px;",
                                                        init: function () {
                                                            let button = this
                                                            this.addEventListener("click", function () {
                                                                chrome.runtime.sendMessage({ getXsrfToken: 'getXsrfToken', url: window.location.href });
                                                                xsrfTOKEN(button)
                                                            });

                                                        }
                                                    }
                                                ]
                                            });
                                        }, 700)
                                    }
                                });
                            }
                        },
                        {
                            text: "本站不再提示",
                            style: "padding: 2px;width: 100%;border: none;border-radius: 10px;",
                            init: function (close) {
                                this.addEventListener("click", function () {
                                    localStorage.setItem(getCurrentDomain(), "true");
                                    close();
                                });
                            }
                        }
                    ]
                });
            }
        }
    },
    "lskyOpen": {
        "url": "/dashboard",
        "element": "#capacity-progress",
        "function": function () {
            function checkContentInFirstDiv(element) {
                // 获取当前元素的父元素
                let parent = element.parentElement;

                // 在父元素中查找第一个 div
                let firstDiv = parent.querySelector('div');
                if (firstDiv) {
                    return firstDiv.textContent.includes('仪表盘') && firstDiv.textContent.includes('上传图片') && firstDiv.textContent.includes('画廊') && firstDiv.textContent.includes('接口');
                }

                return false;
            }
            let isLsky = checkContentInFirstDiv(document.querySelector("#capacity-progress"))
            if (isLsky) {
                let pathname = localStorage.getItem(getCurrentDomain())
                if (pathname !== "true") {
                    window.createNotification({
                        title: `发现：` + chrome.i18n.getMessage("app_name") + `可配置图床`,
                        type: "警告",
                        content: `
                        <div style=" margin: 0 0 10px 0; ">
                            <label for="email">邮箱:</label>
                            <input type="text" id="email" name="email" style=" height: 30px; ">
                        </div>
                        <div style=" margin: 0 0 10px 0; ">
                            <label for="password">密码:</label>
                            <input type="password" id="password" name="password" style=" height: 30px; ">
                        </div>
                        填入邮箱和密码后，点击【添加到` + chrome.i18n.getMessage("app_name") + `】按钮，可一键配置扩展`,
                        duration: 0,
                        buttons: [
                            {
                                text: "添加到" + chrome.i18n.getMessage("app_name"),
                                style: "padding: 2px;width: 100%;border: none;border-radius: 10px;margin-bottom: 5px;",
                                init: function () {
                                    let button = this
                                    this.addEventListener("click", function () {
                                        let email = document.querySelector(".window.createNotification-content #email").value
                                        let password = document.querySelector(".window.createNotification-content #password").value
                                        let Body = new FormData();
                                        Body.append("email", email);
                                        Body.append("password", password);
                                        fetch(window.location.origin + "/api/v1/tokens", {
                                            "headers": {
                                                "Accept": "application/json",
                                            },
                                            "body": Body,
                                            "method": "POST",
                                        }).then(response => response.json())
                                            .then((data) => {
                                                console.log(data);
                                                if (data.data) {
                                                    let config = {
                                                        "data": {
                                                            "Album_id": "",
                                                            "Program": "Lsky",
                                                            "Host": getCurrentDomain(),
                                                            "Permission": "0",
                                                            "Source": "1",
                                                            "Token": "Bearer " + data.data.token
                                                        },
                                                        "ConfigName": getCurrentDomain() + chrome.i18n.getMessage("Config")
                                                    }
                                                    chrome.runtime.sendMessage({ loadConfig: { external: config } });
                                                    button.disabled = true
                                                } else {
                                                    console.log(data);
                                                    window.createNotification({
                                                        title: "添加失败",
                                                        type: "error",
                                                        content: "详细报错请打开,开发者控制台(F12)查看",
                                                        duration: 15,
                                                    });
                                                }

                                            })
                                            .catch((error) => {
                                                console.error('Error:', error)
                                                window.createNotification({
                                                    title: "添加失败",
                                                    type: "error",
                                                    content: "详细报错请打开,开发者控制台(F12)查看",
                                                    duration: 15,
                                                });
                                            });




                                    });
                                }
                            },
                            {
                                text: "本站不再提示",
                                style: "padding: 2px;width: 100%;border: none;border-radius: 10px;",
                                init: function (close) {
                                    this.addEventListener("click", function () {
                                        localStorage.setItem(getCurrentDomain(), "true");
                                        close();
                                    });
                                }
                            }
                        ]
                    });
                }
            }


        }
    },
    "EasyImage": {
        "url": "/admin/admin.inc.php",
        "element": "#myDataGrid", // 假设这是一个类选择器
        "function": function () {
            let pathname = localStorage.getItem(getCurrentDomain())
            if (pathname !== "true") {
                window.createNotification({
                    title: "发现：简单图床",
                    type: "success",
                    content: `在【API 设置】页刷新,可加载【添加到` + chrome.i18n.getMessage("app_name") + `】按钮。<br>或者点击【一键创建token】按钮,创建token.`,
                    duration: 0,
                    buttons: [
                        {
                            text: "一键创建token",
                            style: "padding: 2px;width: 100%;border: none;border-radius: 10px;margin-bottom: 5px;",
                            init: function () {
                                let button = this
                                this.addEventListener("click", function () {
                                    let data = new URLSearchParams();
                                    let token = crypto.randomUUID().replace(/-/g, '');
                                    data.append("add_token", token);
                                    data.append("add_token_expired", "1000");
                                    data.append("add_token_id", Date.now());
                                    fetch(window.location.href, {
                                        "headers": {
                                            "accept": "application/json, text/plain, */*",
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                        body: data,
                                        method: "POST",
                                    })
                                        .then(response => {
                                            if (response.status === 200) {
                                                let data = {
                                                    "data": {
                                                        "Program": "EasyImages",
                                                        "Host": getCurrentDomain(),
                                                        "Token": token
                                                    },
                                                    "ConfigName": getCurrentDomain() + chrome.i18n.getMessage("Config")
                                                }
                                                chrome.runtime.sendMessage({ loadConfig: { external: data } });
                                                button.disabled = true;
                                            }
                                        })
                                        .catch((error) => {
                                            console.log(error);
                                            window.createNotification({
                                                title: "一键创建token请求失败",
                                                type: "error",
                                                content: "详细报错请打开,开发者控制台(F12)查看",
                                                duration: 15,
                                            });
                                        });

                                });
                            }
                        },
                        {
                            text: "本站不再提示",
                            style: "padding: 2px;width: 100%;border: none;border-radius: 10px;",
                            init: function (close) {
                                this.addEventListener("click", function () {
                                    localStorage.setItem(getCurrentDomain(), "true");
                                    close();
                                });
                            }
                        }
                    ]
                });
            }

            if (document.querySelector('#myDataGrid')) {
                // 在 #myDataGrid 中查找所有符合条件的 <a> 标签
                const links = myDataGrid.querySelectorAll('a[href*="admin.inc.php?delDir"]');
                // 为每个找到的 <a> 标签添加一个新元素
                links.forEach((link, index) => {
                    const newElement = document.createElement('div');
                    newElement.textContent = '添加到' + chrome.i18n.getMessage("app_name");
                    newElement.classList = "btn btn-mini btn-primary"
                    link.parentNode.insertBefore(newElement, link.nextSibling);
                    newElement.addEventListener('click', function () {
                        let token = this.parentNode.parentNode.querySelector('div input').value
                        let data = {
                            "data": {
                                "Program": "EasyImages",
                                "Host": getCurrentDomain(),
                                "Token": token
                            },
                            "ConfigName": getCurrentDomain() + chrome.i18n.getMessage("Config")
                        }
                        window.postMessage({ type: 'loadExternalConfig', data: data }, "*");
                    });
                    link.remove()
                });
            }
        }
    },
    "Chevereto": {
        "url": "/settings/api",
        "element": `meta[name="generator"][content^="Chevereto"]`, // 假设这是一个类选择器
        "function": function () {
            let pathname = localStorage.getItem(getCurrentDomain())
            if (pathname !== "true") {
                window.createNotification({
                    title: "发现：Chevereto图床",
                    type: "警告",
                    content: `点击【重新生成密钥】按钮，创建成功后点击【添加到` + chrome.i18n.getMessage("app_name") + `】按钮，可加载【添加到` + chrome.i18n.getMessage("app_name") + `】按钮。`,
                    duration: 0,
                    buttons: [
                        {
                            text: "添加到" + chrome.i18n.getMessage("app_name"),
                            style: "padding: 2px;width: 100%;border: none;border-radius: 10px;margin-bottom: 5px;",
                            init: function () {
                                this.addEventListener("click", function () {
                                    try {
                                        let token = document.querySelector("#api_v1_key").value;
                                        let data = {
                                            "data": {
                                                "UploadPath": "",
                                                "Album_id": "",
                                                "Program": "Chevereto",
                                                "Expiration": "NODEL",
                                                "Host": getCurrentDomain(),
                                                "Nsfw": "0",
                                                "Token": token
                                            },
                                            "ConfigName": getCurrentDomain() + chrome.i18n.getMessage("Config")
                                        }

                                        chrome.runtime.sendMessage({ loadConfig: { external: data } });
                                        this.disabled = true
                                    } catch (error) {
                                        alert("获取 Token 失败，请点击【重新生成密钥】按钮")
                                    }
                                });
                            }
                        },
                        {
                            text: "本站不再提示",
                            style: "padding: 2px;width: 100%;border: none;border-radius: 10px;",
                            init: function (close) {
                                this.addEventListener("click", function () {
                                    localStorage.setItem(getCurrentDomain(), "true");
                                    close();
                                });
                            }
                        }
                    ]
                });
            }
        }
    },
    "16best": {
        "url": "111666.best",
        "element": "#root",
        "function": function () {
            function openDatabase(dbName, storeName, upgradeCallback) {
                return new Promise((resolve, reject) => {
                    let request = indexedDB.open(dbName);

                    request.onerror = function (event) {
                        console.error("Database error: " + event.target.errorCode);
                        reject(event.target.errorCode);
                    };

                    request.onsuccess = function (event) {
                        resolve(event.target.result);
                    };

                    request.onupgradeneeded = function (event) {
                        let db = event.target.result;
                        upgradeCallback(db, storeName);
                    };
                });
            }

            function getAllDataFromIndexedDB(dbName, storeName) {
                return openDatabase(dbName, storeName, (db, storeName) => {
                    if (!db.objectStoreNames.contains(storeName)) {
                        db.createObjectStore(storeName, { keyPath: 'id' });
                    }
                }).then(db => {
                    return new Promise((resolve, reject) => {
                        let transaction = db.transaction(storeName, "readonly");
                        let store = transaction.objectStore(storeName);
                        let getAllRequest = store.getAll();

                        getAllRequest.onerror = function (event) {
                            console.error("Get all request error: " + event.target.errorCode);
                            reject(event.target.errorCode);
                        };

                        getAllRequest.onsuccess = function (event) {
                            resolve(getAllRequest.result);
                        };
                    });
                });
            }

            function addMultipleDataToIndexedDB(dbName, storeName, dataArray) {
                return new Promise((resolve, reject) => {
                    // 打开数据库
                    openDatabase(dbName, storeName, (db, storeName) => {
                        if (!db.objectStoreNames.contains(storeName)) {
                            let objectStore = db.createObjectStore(storeName, { keyPath: 'id' }); // 指定 id 作为 keyPath
                            objectStore.createIndex('url', 'url', { unique: false });
                            objectStore.createIndex('token', 'token', { unique: false });
                            objectStore.createIndex('timestamp', 'timestamp', { unique: false });
                        }
                    }).then(db => {
                        // 创建一个包含所有添加操作的 Promise 数组
                        const addPromises = dataArray.map(data => {
                            return new Promise((resolve, reject) => {
                                let transaction = db.transaction(storeName, "readwrite");
                                let store = transaction.objectStore(storeName);

                                let addRequest = store.put(data);

                                addRequest.onerror = function (event) {
                                    console.error("Add request error: " + event.target.errorCode);
                                    reject(event.target.errorCode);
                                };

                                addRequest.onsuccess = function (event) {
                                    resolve(addRequest.result);
                                };
                            });
                        });

                        // 使用 Promise.all 等待所有添加操作完成
                        Promise.all(addPromises)
                            .then(results => resolve(results))
                            .catch(error => reject(error));
                    }).catch(error => reject(error));
                });
            }
            // 清空对象存储的函数
            function clearObjectStore(dbName, storeName) {
                return openDatabase(dbName, storeName, (db, storeName) => {
                    if (!db.objectStoreNames.contains(storeName)) {
                        db.createObjectStore(storeName, { keyPath: 'id' }); // 如果对象存储不存在，则创建
                    }
                }).then(db => {
                    return new Promise((resolve, reject) => {
                        let transaction = db.transaction(storeName, "readwrite");
                        let store = transaction.objectStore(storeName);

                        let clearRequest = store.clear();

                        clearRequest.onerror = function (event) {
                            console.error("Clear request error: " + event.target.errorCode);
                            reject(event.target.errorCode);
                        };

                        clearRequest.onsuccess = function (event) {
                            resolve(event.target.result);
                        };
                    });
                });
            }

            let pathname = localStorage.getItem(getCurrentDomain())
            if (pathname !== "true") {

                getAllDataFromIndexedDB('image-hosting', 'config')
                    .then(data => {
                        data.forEach(item => {
                            if (item.key == 'token') {
                                window.createNotification({
                                    title: "发现：16图床",
                                    type: "警告",
                                    content: `点击【添加到` + chrome.i18n.getMessage("app_name") + `】按钮，可在` + chrome.i18n.getMessage("app_name") + "中使用。",
                                    duration: 0,
                                    buttons: [
                                        {
                                            text: "添加到" + chrome.i18n.getMessage("app_name"),
                                            style: "padding: 2px;width: 100%;border: none;border-radius: 10px;margin-bottom: 5px;",
                                            init: function () {
                                                this.addEventListener("click", function () {
                                                    try {
                                                        let data = {
                                                            "data": {
                                                                "Keyword_replacement1": "",
                                                                "Keyword_replacement2": "",
                                                                "custom_Base64Upload": false,
                                                                "custom_Base64UploadRemovePrefix": false,
                                                                "custom_BodyStringify": false,
                                                                "custom_BodyUpload": false,
                                                                "custom_KeywordReplacement": false,
                                                                "custom_ReturnAppend": "",
                                                                "custom_ReturnPrefix": "https://i.111666.best",
                                                                "open_json_button": false,
                                                                "options_Body": "",
                                                                "options_Headers": `{"Auth-Token":"` + item.value + `"}`,
                                                                "options_UploadPath": "",
                                                                "options_apihost": "https://i.111666.best/image",
                                                                "options_exe": "UserDiy",
                                                                "options_host": "https://i.111666.best/image",
                                                                "options_parameter": "image",
                                                                "options_return_success": "src",
                                                                "requestMethod": "POST"
                                                            },
                                                            "ConfigName": getCurrentDomain() + chrome.i18n.getMessage("Config")
                                                        }
                                                        console.log(data);

                                                        window.postMessage({ type: 'loadExternalConfig', data: data }, "*");
                                                        this.disabled = true
                                                    } catch (error) {
                                                        alert("获取 Token 失败，请点击【重新生成密钥】按钮")
                                                    }
                                                });
                                            }
                                        },
                                        {
                                            text: "本站不再提示",
                                            style: "padding: 2px;width: 100%;border: none;border-radius: 10px;",
                                            init: function (close) {
                                                this.addEventListener("click", function () {
                                                    localStorage.setItem(getCurrentDomain(), "true");
                                                    close();
                                                });
                                            }
                                        }
                                    ]
                                });
                            }
                        });
                    })
                    .catch(error => {

                    });
            }
            function convertTimestampToDate(timestamp) {
                const date = new Date(timestamp);
                return date.toLocaleString();
            }
            function convertDateToTimestamp(dateString) {
                const timestamp = Date.parse(dateString);
                if (!isNaN(timestamp)) {
                    return timestamp;
                } else {
                    return Date.parse(new Date())
                }
            }
            if (document.querySelector(".navbar-end") !== null) {
                let button = document.createElement("button");
                button.className = "button is-primary is-small";
                button.style = "margin-left: 10px;";
                button.innerHTML = "与" + chrome.i18n.getMessage("app_name") + "同步历史";
                button.addEventListener("click", function () {
                    window.createNotification({
                        title: "数据同步",
                        type: "警告",
                        content: `选择你要同步的对象`,
                        duration: 0,
                        buttons: [
                            {
                                text: getCurrentDomain() + "同步到" + chrome.i18n.getMessage("app_name"),
                                style: "padding: 2px;width: 100%;border: none;border-radius: 10px;margin-bottom: 5px;",
                                init: function () {
                                    this.addEventListener("click", function () {
                                        console.log("同步到盘络");
                                        chrome.storage.local.get('UploadLog', function (result) {
                                            UploadLog = result.UploadLog || [];
                                            if (!Array.isArray(UploadLog)) {
                                                UploadLog = [];
                                            }
                                            getAllDataFromIndexedDB('image-hosting', 'images')
                                                .then(data => {
                                                    data.forEach(item => {
                                                        UploadLog.push({
                                                            key: item.id,
                                                            url: "https://i.111666.best" + item.url,
                                                            uploadExe: "UserDiy",
                                                            upload_domain_name: getCurrentDomain(),
                                                            original_file_name: item.url,
                                                            file_size: 0,
                                                            img_file_size: "宽:不支持,高:不支持",
                                                            uploadTime: convertTimestampToDate(item.timestramp),
                                                            token: item.token,
                                                        });
                                                    });
                                                    chrome.storage.local.set({ 'UploadLog': UploadLog }, function () {
                                                        window.createNotification({
                                                            title: "数据同步成功",
                                                            type: "成功",
                                                            content: "数据同步成功啦！",
                                                            duration: 0,
                                                        });
                                                    })
                                                })
                                        });
                                    });
                                }
                            },
                            {
                                text: chrome.i18n.getMessage("app_name") + "同步到" + getCurrentDomain(),
                                style: "padding: 2px;width: 100%;border: none;border-radius: 10px;margin-bottom: 5px;",
                                init: function () {
                                    this.addEventListener("click", function () {

                                        chrome.runtime.sendMessage({ action: 'getInadexDbData' }, function (response) {
                                            if (response) {
                                                const filteredData = response.filter(data =>
                                                    data.uploadExe.includes("UserDiy") && data.upload_domain_name.includes("111666.best")
                                                ).map(data => ({
                                                    "id": data.key,
                                                    "url": data.url,
                                                    "token": data.token || "pl" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
                                                    "timestramp": convertDateToTimestamp(data.uploadTime)
                                                }));



                                                console.log(filteredData);
                                                addMultipleDataToIndexedDB('image-hosting', 'images', filteredData)
                                                    .then(results => {
                                                        window.createNotification({
                                                            title: "数据同步成功",
                                                            type: "成功",
                                                            content: "数据同步成功啦！",
                                                            duration: 0,
                                                        });
                                                    })
                                                    .catch(error => {
                                                        console.error('Error adding data:', error);
                                                        window.createNotification({
                                                            title: "数据同步失败",
                                                            type: "失败",
                                                            content: "详细错误信息，查看控制台！",
                                                            duration: 0,
                                                        });
                                                        //刷新当页面
                                                        window.location.reload();
                                                    });


                                            } else {
                                                console.error('No data received');
                                            }
                                        });


                                    });
                                }
                            },
                            {
                                text: "清空" + getCurrentDomain() + "数据",
                                style: "padding: 2px;width: 100%;border: none;border-radius: 10px;margin-bottom: 5px;",
                                init: function () {
                                    this.addEventListener("click", function () {
                                        clearObjectStore('image-hosting', 'images')
                                            .then(result => {
                                                window.createNotification({
                                                    title: "数据删除成功",
                                                    type: "成功",
                                                    content: "数据删除成功！",
                                                    duration: 0,
                                                });
                                                window.location.reload();
                                            })
                                            .catch(error => {
                                                console.error('Error clearing object store:', error);
                                            });
                                    });
                                }
                            }
                        ]
                    });
                });
                document.querySelector(".navbar-end").appendChild(button);


                // document.querySelector(".navbar-end .btn-ghost").addEventListener("click", function () {
                //     const spanElements = this.querySelectorAll('span');
                //     spanElements.forEach(span => {
                //         if (span.textContent.trim() === "历史图片") {
                //             // 延迟1秒
                //             setTimeout(() => {
                //                 let DeleteButton = document.querySelectorAll(".card-actions.justify-end");

                //                 DeleteButton.forEach(element => {
                //                     let figureElement = element.parentNode.parentNode.querySelector("figure > div");
                //                     if (figureElement) {
                //                         let backgroundImage = figureElement.style.backgroundImage;
                //                         let url = backgroundImage.match(/url\("(.*?)"\)/)[1];
                //                         let cleanedUrl = url.replace('blob:', '');
                //                         console.log('Cleaned URL:', cleanedUrl);
                //                     }
                //                     let button = document.createElement('button');
                //                     button.className = 'btn btn-outline btn-error btn-xs';
                //                     button.textContent = '强制删除';
                //                     element.appendChild(button);
                //                 });
                //             }, 1000);

                //         }
                //     });
                // });
            }

        }
    }
};

// 获取cookie
function xsrfTOKEN(button) {
    chrome.runtime.onMessage.addListener(async function (request) {
        if (request.XSRF_TOKEN) {
            try {
                const data = {
                    name: chrome.i18n.getMessage("app_name"),
                    abilities: [
                        "user:profile", "image:tokens", "image:upload",
                        "image:list", "image:delete", "album:list",
                        "album:delete", "strategy:list"
                    ]
                };
                const response = await fetch(window.location.origin + "/user/tokens", {
                    headers: {
                        "accept": "application/json, text/plain, */*",
                        "content-type": "application/json",
                        "x-xsrf-token": request.XSRF_TOKEN
                    },
                    body: JSON.stringify(data),
                    method: "POST",
                });
                const responseData = await response.json();
                if (responseData.data) {
                    const config = {
                        data: {
                            Album_id: "",
                            Program: "Lsky",
                            Host: getCurrentDomain(),
                            Permission: "0",
                            Source: "2",
                            Token: "Bearer " + responseData.data.token
                        },
                        ConfigName: getCurrentDomain() + chrome.i18n.getMessage("Config")
                    };
                    chrome.runtime.sendMessage({ loadConfig: { external: config } });
                    button.disabled = true;
                } else {
                    console.log(responseData);
                    window.createNotification({
                        title: "添加失败",
                        type: "error",
                        content: "详细报错请打开,开发者控制台(F12)查看",
                        duration: 15,
                    });
                }
            } catch (error) {
                console.error('Error:', error);
                window.createNotification({
                    title: "添加失败",
                    type: "error",
                    content: "详细报错请打开,开发者控制台(F12)查看",
                    duration: 15,
                });
            }
        }
    });
}

// 检查当前页面的函数
function checkAndExecute() {
    const specialHostnames = ["111666.best"]; // 配置包含所有特殊域名

    let currentPath = specialHostnames.includes(window.location.hostname)
        ? window.location.hostname
        : window.location.pathname;


    for (const key in dataWithFunctions) {
        if (dataWithFunctions.hasOwnProperty(key)) {
            const info = dataWithFunctions[key];
            if (currentPath === info.url && document.querySelector(info.element) !== null) {
                info.function();
                return;
            }
        }
    }
}
setTimeout(checkAndExecute, 800);
function getCurrentDomain() {
    return window.location.hostname;
}