import { dbHelper } from '@/assets/js/db';
import { buttonsData } from '@/assets/js/arrayObjectData';

export function createButtonIconMarkup(icon, w = 32, h = 32) {
    if (icon) {
        if (icon.trim().startsWith('<svg')) {
            return icon;
        }
        return `<img src="${icon}"class="w-full h-full" />`;
    }
    return `<svg t="1705755721640" class="w-full h-full" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1867" width="${w}" height="${h}"><path d="M0 0m64 0l896 0q64 0 64 64l0 896q0 64-64 64l-896 0q-64 0-64-64l0-896q0-64 64-64Z" fill="#F6F7FB" p-id="1868"></path><path d="M577.696 443.712c5.536-11.056 23.088-11.056 28.624 0L643.072 517.216H540.944l36.752-73.504zM672.016 245.216h-49.168l-9.232 16h58.4c8.816 0 16 7.168 16 16v224c0 8.832-7.184 16-16 16h-11.056l-40.32-80.656a31.84 31.84 0 0 0-28.624-17.696 31.84 31.84 0 0 0-28.64 17.696l-34.128 68.304-21.52-60.24-10.496 18.176L516.672 517.216H465.824L456.576 533.216h215.44a32 32 0 0 0 32-32V277.216a32 32 0 0 0-32-32z" fill="#A1A8BA" p-id="1869"></path><path d="M379.344 517.2l53.584-150.032A15.648 15.648 0 0 1 448 356.544c5.456 0 12.288 2.784 15.072 10.624l12.976 36.32 10.496-18.176-8.4-23.52A31.68 31.68 0 0 0 448 340.544a31.68 31.68 0 0 0-30.144 21.248l-55.504 155.408H352a16 16 0 0 1-16-16v-224a16 16 0 0 1 16-16h206.192l9.248-16H352a32 32 0 0 0-32 32v224a32 32 0 0 0 32 32h49.152l9.232-16h-31.04zM616 209.088a7.968 7.968 0 0 0-10.928 2.928L405.072 558.4a8 8 0 0 0 13.856 8l200-346.4a8 8 0 0 0-2.928-10.928M656 317.2a24 24 0 1 0-48.016 0.032A24 24 0 0 0 656 317.2" fill="#A1A8BA" p-id="1870"></path><path d="M231.84 751.84l8.16-8.16c-7.68-8-16.96-16-28.16-24l-8.16 8c11.84 8.48 21.28 16.48 28.16 24.16z m16.48 29.6c16.96-9.28 25.6-22.4 25.6-39.52v-7.52h33.76v26.56c0 9.12 4.8 13.76 14.4 13.76h21.12v-10.88h-18.24c-4 0-5.92-1.92-5.92-5.44v-34.88H262.4v19.68c0 12.8-7.36 22.56-21.76 29.44l7.68 8.8z m-22.72 8.64l8.32-8.16c-7.2-8-16-15.84-26.56-23.84l-8.16 8c11.2 8.48 20 16.48 26.4 24z m115.36 74.88l5.76-10.4c-17.6-4.16-32.64-10.24-44.8-18.24 13.6-10.88 23.52-23.84 29.92-38.88v-10.56h-84.48v11.04h10.08c5.12 14.72 13.76 27.52 25.76 38.08-12.16 7.36-26.72 13.28-44 17.92l5.76 10.56c18.4-5.6 34.24-12.64 47.52-21.28 12.8 9.28 28.96 16.48 48.48 21.76z m-48.32-35.36a86 86 0 0 1-24-31.68h50.4c-5.6 12.16-14.4 22.72-26.4 31.68z m-79.36 32.32c8.96-17.6 16.96-36.32 24.32-56.16l-10.4-4.16a465.6 465.6 0 0 1-25.44 55.36l11.52 4.96z m194.72 1.76v-34.24h63.52v18.24c0 3.84-2.08 5.76-6.24 5.76-5.28 0-11.04-0.32-17.12-0.64l2.88 10.56h17.92c8.96-0.32 13.44-4.32 13.44-12.16v-86.4h-74.24c3.84-5.92 7.2-12.16 10.4-18.56h84.32v-11.2h-79.52c2.24-5.6 4.16-11.36 6.08-17.28l-11.68-1.44c-1.92 6.24-4.32 12.48-7.04 18.72h-47.68v11.2h42.4c-11.04 20.64-26.56 38.88-46.72 54.88l7.52 9.76c11.52-9.28 21.92-19.68 30.88-30.88v83.68h10.88z m63.52-71.36H408v-17.44h63.52v17.44z m0 27.04H408v-16.96h63.52v16.96zM537.92 864v-6.56h108.16V864h11.2v-139.68h-130.56V864h11.2z m108.16-16.8h-108.16v-112.64h108.16v112.64z m-96.64-47.04c18.24-4 33.44-9.28 45.76-15.84 11.2 6.24 24.48 11.36 40 15.52l6.08-8.64c-13.76-3.2-25.92-7.52-36.64-12.64 9.12-6.4 15.84-13.92 20.32-22.4v-8h-42.24c1.6-2.88 2.88-5.76 4.16-8.8l-10.24-1.28c-5.12 12.16-15.04 22.56-29.6 31.2l6.4 8.32c6.08-3.84 11.52-8 16.32-12.48 4.48 4.8 9.92 9.28 16.16 13.44-11.2 5.28-25.12 9.44-41.6 12.32l5.12 9.28z m45.76-26.56c-7.36-4.48-13.92-9.44-19.52-14.88a7.52 7.52 0 0 1 1.44-1.92h36.32c-4.32 6.4-10.4 12-18.24 16.8z m13.92 44l5.44-8.32c-10.4-5.76-21.92-10.88-34.4-15.04l-5.28 7.68c11.84 3.84 23.2 8.96 34.24 15.68z m11.84 25.44l3.84-9.28c-19.52-7.36-40-13.12-61.28-17.12l-4.48 8.64c21.44 4.16 42.08 10.08 61.92 17.76z m174.24 21.28v-67.04h-74.4c0.32-5.28 0.64-10.88 0.8-16.8v-9.6h94.24v-11.04h-36v-42.56h-11.36v42.56H721.6v-38.08h-11.68v58.72c-0.32 34.56-8.8 59.84-25.6 75.68l8.8 7.68c13.6-12.8 22.4-31.36 26.24-55.36h64.32v55.84h11.52z" fill="#A1A8BA" p-id="1871"></path></svg>`;

}
export function createIconMarkup(data) {
    const match = buttonsData.find(button => button.value === data.data.Program);
    const defaultIconSvg = `<svg t="1705755721640" class="w-full h-full" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1867" width="200" height="200"><path d="M0 0m64 0l896 0q64 0 64 64l0 896q0 64-64 64l-896 0q-64 0-64-64l0-896q0-64 64-64Z" fill="#F6F7FB" p-id="1868"></path><path d="M577.696 443.712c5.536-11.056 23.088-11.056 28.624 0L643.072 517.216H540.944l36.752-73.504zM672.016 245.216h-49.168l-9.232 16h58.4c8.816 0 16 7.168 16 16v224c0 8.832-7.184 16-16 16h-11.056l-40.32-80.656a31.84 31.84 0 0 0-28.624-17.696 31.84 31.84 0 0 0-28.64 17.696l-34.128 68.304-21.52-60.24-10.496 18.176L516.672 517.216H465.824L456.576 533.216h215.44a32 32 0 0 0 32-32V277.216a32 32 0 0 0-32-32z" fill="#A1A8BA" p-id="1869"></path><path d="M379.344 517.2l53.584-150.032A15.648 15.648 0 0 1 448 356.544c5.456 0 12.288 2.784 15.072 10.624l12.976 36.32 10.496-18.176-8.4-23.52A31.68 31.68 0 0 0 448 340.544a31.68 31.68 0 0 0-30.144 21.248l-55.504 155.408H352a16 16 0 0 1-16-16v-224a16 16 0 0 1 16-16h206.192l9.248-16H352a32 32 0 0 0-32 32v224a32 32 0 0 0 32 32h49.152l9.232-16h-31.04zM616 209.088a7.968 7.968 0 0 0-10.928 2.928L405.072 558.4a8 8 0 0 0 13.856 8l200-346.4a8 8 0 0 0-2.928-10.928M656 317.2a24 24 0 1 0-48.016 0.032A24 24 0 0 0 656 317.2" fill="#A1A8BA" p-id="1870"></path><path d="M231.84 751.84l8.16-8.16c-7.68-8-16.96-16-28.16-24l-8.16 8c11.84 8.48 21.28 16.48 28.16 24.16z m16.48 29.6c16.96-9.28 25.6-22.4 25.6-39.52v-7.52h33.76v26.56c0 9.12 4.8 13.76 14.4 13.76h21.12v-10.88h-18.24c-4 0-5.92-1.92-5.92-5.44v-34.88H262.4v19.68c0 12.8-7.36 22.56-21.76 29.44l7.68 8.8z m-22.72 8.64l8.32-8.16c-7.2-8-16-15.84-26.56-23.84l-8.16 8c11.2 8.48 20 16.48 26.4 24z m115.36 74.88l5.76-10.4c-17.6-4.16-32.64-10.24-44.8-18.24 13.6-10.88 23.52-23.84 29.92-38.88v-10.56h-84.48v11.04h10.08c5.12 14.72 13.76 27.52 25.76 38.08-12.16 7.36-26.72 13.28-44 17.92l5.76 10.56c18.4-5.6 34.24-12.64 47.52-21.28 12.8 9.28 28.96 16.48 48.48 21.76z m-48.32-35.36a86 86 0 0 1-24-31.68h50.4c-5.6 12.16-14.4 22.72-26.4 31.68z m-79.36 32.32c8.96-17.6 16.96-36.32 24.32-56.16l-10.4-4.16a465.6 465.6 0 0 1-25.44 55.36l11.52 4.96z m194.72 1.76v-34.24h63.52v18.24c0 3.84-2.08 5.76-6.24 5.76-5.28 0-11.04-0.32-17.12-0.64l2.88 10.56h17.92c8.96-0.32 13.44-4.32 13.44-12.16v-86.4h-74.24c3.84-5.92 7.2-12.16 10.4-18.56h84.32v-11.2h-79.52c2.24-5.6 4.16-11.36 6.08-17.28l-11.68-1.44c-1.92 6.24-4.32 12.48-7.04 18.72h-47.68v11.2h42.4c-11.04 20.64-26.56 38.88-46.72 54.88l7.52 9.76c11.52-9.28 21.92-19.68 30.88-30.88v83.68h10.88z m63.52-71.36H408v-17.44h63.52v17.44z m0 27.04H408v-16.96h63.52v16.96zM537.92 864v-6.56h108.16V864h11.2v-139.68h-130.56V864h11.2z m108.16-16.8h-108.16v-112.64h108.16v112.64z m-96.64-47.04c18.24-4 33.44-9.28 45.76-15.84 11.2 6.24 24.48 11.36 40 15.52l6.08-8.64c-13.76-3.2-25.92-7.52-36.64-12.64 9.12-6.4 15.84-13.92 20.32-22.4v-8h-42.24c1.6-2.88 2.88-5.76 4.16-8.8l-10.24-1.28c-5.12 12.16-15.04 22.56-29.6 31.2l6.4 8.32c6.08-3.84 11.52-8 16.32-12.48 4.48 4.8 9.92 9.28 16.16 13.44-11.2 5.28-25.12 9.44-41.6 12.32l5.12 9.28z m45.76-26.56c-7.36-4.48-13.92-9.44-19.52-14.88a7.52 7.52 0 0 1 1.44-1.92h36.32c-4.32 6.4-10.4 12-18.24 16.8z m13.92 44l5.44-8.32c-10.4-5.76-21.92-10.88-34.4-15.04l-5.28 7.68c11.84 3.84 23.2 8.96 34.24 15.68z m11.84 25.44l3.84-9.28c-19.52-7.36-40-13.12-61.28-17.12l-4.48 8.64c21.44 4.16 42.08 10.08 61.92 17.76z m174.24 21.28v-67.04h-74.4c0.32-5.28 0.64-10.88 0.8-16.8v-9.6h94.24v-11.04h-36v-42.56h-11.36v42.56H721.6v-38.08h-11.68v58.72c-0.32 34.56-8.8 59.84-25.6 75.68l8.8 7.68c13.6-12.8 22.4-31.36 26.24-55.36h64.32v55.84h11.52z" fill="#A1A8BA" p-id="1871"></path></svg>`;
    if (match?.icon) {
        const icon = match.icon.trim();
        if (icon.startsWith('<svg')) {
            return icon;
        }
        return `<img src="${icon}" class="w-full h-full" />`;
    }
    return defaultIconSvg;
}
export function replaceKeywordsInText(text, keywords, replacements) {
    if (keywords.length != replacements.length) {
        return text;
    }
    for (let i = 0; i < keywords.length; i++) {
        let keyword = keywords[i];
        let replacement = replacements[i];
        text = text.replace(new RegExp(keyword, 'g'), replacement);
    }
    return text;
}
//-------
function sortObjectProperties(obj) {
    // 数据排序
    const sortedObj = {};
    const sortedKeys = Object.keys(obj).sort();

    for (const key of sortedKeys) {
        sortedObj[key] = obj[key];
    }

    return sortedObj;
}
function isSameData(data1, data2) {
    //非常重要，判断是否相同
    const excludedProps = ['ConfigName'];
    for (const key of Object.keys(data2)) {
        if (!excludedProps.includes(key) && data1[key] !== data2[key]) {
            return false;
        }
    }
    return true;
}
// 获取理论唯一id
function generateUniqueId() {
    return crypto.randomUUID();
}
// 存储配置记录
export function storeBedConfig(data, callback) {
    const sortedData = sortObjectProperties(data);
    dbHelper("BedConfigStore").then(result => {
        // 处理获取到的配置数据
        const { db } = result;
        db.getAll().then(BedConfig => {
            let existingData = BedConfig.find(existingData => isSameData(existingData.data, sortedData));

            if (existingData) {
                // 找到相同数据，更新它
                existingData.data = sortedData; // 或者根据需要更新其他属性
                db.put(existingData).then(() => {
                    console.log("Data updated successfully");
                    callback({
                        type: "success", message: {
                            title: "Data updated successfully",
                            content: "数据更新成功",
                            duration: 3000,
                            keepAliveOnHover: true, placement: 'bottom'
                        }
                    });
                }).catch(error => {
                    console.error("Error in updating data:", error);
                    callback({
                        type: "error", message: {
                            title: "Error in updating data",
                            content: "数据更新失败！",
                            duration: 3000,
                            keepAliveOnHover: true, placement: 'bottom'
                        }
                    });
                });
            } else {
                // 没有相同数据，添加新的数据项
                const uniqueId = generateUniqueId();
                const configData = {
                    id: uniqueId,
                    data: sortedData,
                    ConfigName: chrome.i18n.getMessage("Config") + BedConfig.length,
                };
                db.put(configData).then(() => {
                    console.log("Data added successfully with ID:", uniqueId);
                    callback({
                        type: "success", message: {
                            title: "Data added successfully",
                            content: "数据添加成功",
                            duration: 3000,
                            keepAliveOnHover: true, placement: 'bottom'
                        }
                    });
                }).catch(error => {
                    console.error("Error in adding data:", error);
                    callback({
                        type: "error", message: {
                            title: "Error in adding data",
                            content: "数据添加失败！",
                            duration: 3000,
                            keepAliveOnHover: true, placement: 'bottom'
                        }
                    });
                });
            }
            // setTimeout(function () {
            //     window.location.reload();
            // }, 1500); // 延迟 1.5 秒（1500 毫秒）
        })

    }).catch(error => {
        console.error("Error opening database:", error);
        callback({
            type: "error", message: {
                title: "Error opening database",
                content: "无法打开数据库,可能是浏览器不支持此功能",
                duration: 3000,
                keepAliveOnHover: true, placement: 'bottom'
            }
        });
    });
}
// ----------
// 将配置存储到chrome存储API中
export async function storProgramConfiguration(data) {
    return new Promise((resolve, reject) => {
        const PCLocalStorage = (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) ? chrome.storage.local : (typeof browser !== 'undefined' && browser.storage && browser.storage.local) ? browser.storage.local : null;
        if (PCLocalStorage) {
            PCLocalStorage.get("ProgramConfiguration", function (result) {
                if (chrome.runtime.lastError) {
                    reject({
                        type: "error", message: {
                            title: "失败",
                            content: "该浏览器不支持存储API",
                            duration: 3000,
                            keepAliveOnHover: true, placement: 'bottom'
                        }
                    }, chrome.runtime.lastError);
                } else {
                    const existingData = result.ProgramConfiguration || {};
                    const updatedData = { ...existingData, ...data };
                    PCLocalStorage.set({ "ProgramConfiguration": updatedData }, function () {
                        localStorage.webtitle_status = 1
                        resolve({ type: "success" });
                    });
                }
            });
        } else {
            reject({
                type: "error", message: {
                    title: "失败",
                    content: "该浏览器不支持存储API",
                    duration: 3000,
                    keepAliveOnHover: true, placement: 'bottom'
                }
            }, "该浏览器不支持存储API");
        }
    });
}
// chrome本地存储API 获取数据
export function getChromeStorage(key) {
    return new Promise((resolve, reject) => {
        // 错误处理函数
        const handleError = error => {
            if (error) {
                reject(error);
            }
        };
        // 获取数据
        chrome.storage.local.get(key ? [key] : null, result => {
            handleError(chrome.runtime.lastError);
            // 如果没有错误，返回结果
            resolve(key ? result[key] : result);
        });
    });
}

// 存储安装图床的
export async function storExeButtons(data) {
    return new Promise((resolve, reject) => {
        let filteredData = buttonsData.filter(Data => {
            return Data.value === data.data.Program;
        });

        let indexedData = filteredData.map((item, index) => {
            return {
                ...item,
                index: 1000 + index
            };
        });
        if (indexedData.length < 1) {
            reject("按钮组未找到匹配的数据")
        }
        storProgramConfiguration(data.data)
            .then(() => {
                if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
                    chrome.storage.local.set({ "exeButtons": indexedData }, function () {
                        if (chrome.runtime.lastError) {
                            reject(chrome.runtime.lastError);
                        } else {
                            resolve(true);
                        }
                    });
                } else {
                    dbHelper("exeButtons").then(result => {
                        // 处理获取到的配置数据
                        const { db } = result;
                        db.put(indexedData).then(() => {
                            resolve(true);
                        })
                    }).catch(error => {
                        reject(error);
                    });
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
}


// 存储上传记录的
export async function LocalStorage(data) {
    const pluginPopupURL = chrome.runtime.getURL("popup.html");
    const currentURL = window.location.href;
    const filename = data.file.name || data.file.file.name;
    const imageUrl = data.url;
    const methodName = data.MethodName || "normal";
    const uploadDomainName = data.uploadDomainName || data.Program;

    if (pluginPopupURL !== currentURL) {
        chrome.runtime.sendMessage({ "Progress_bar": { "filename": filename, "status": 2 } });
    }

    try {
        const { UploadLog: existingUploadLog } = await chrome.storage.local.get('UploadLog');
        const uploadLog = Array.isArray(existingUploadLog) ? existingUploadLog : [];

        const currentDate = new Date();
        const uploadLogEntry = {
            key: crypto.randomUUID(),
            url: imageUrl,
            uploadExe: `${data.Program}-${methodName}`,
            upload_domain_name: uploadDomainName,
            original_file_name: filename,
            file_size: data.file.file.size,
            img_file_size: "宽:不支持,高:不支持",
            uploadTime: `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月${currentDate.getDate()}日${currentDate.getHours()}时${currentDate.getMinutes()}分${currentDate.getSeconds()}秒`
        };

        uploadLog.push(uploadLogEntry);

        await chrome.storage.local.set({ 'UploadLog': uploadLog });

        if (currentURL.startsWith('http')) {
            const uploadPromptMessage = chrome.i18n.getMessage("Upload_prompt2");
            chrome.runtime.sendMessage({ Loudspeaker: uploadPromptMessage });
            AutoInsertFun(imageUrl, false);
        }

        return true;
    } catch (error) {
        console.error('Error saving to local storage:', error);
        throw error; // 抛出错误以便调用者处理
    }
}


/**
 * 自动调整文本域的高度以适应内容。
 * @param {HTMLElement} element - 要自动调整高度的文本域元素。
 */
export function autoExpand(element) {
    element.style.height = 'auto';
    element.style.height = element.scrollHeight + 'px';
}

// 导入配置 内容判定
/**
 * @param {String} inputValue - 包含 JSON 格式内容的字符串。
 * @returns {Promise} - 返回一个 Promise
 */
export function parseJsonInput(inputValue) {
    return new Promise((resolve, reject) => {
        // 检查输入是否为空
        if (!inputValue || inputValue.trim() === "") {
            return reject(createError("导入配置:输入内容为空"));
        }

        try {
            // 检查是否需要将输入包裹在数组中
            inputValue = wrapInputInArray(inputValue.trim());
            // 尝试将字符串解析为JSON
            let jsonArray = JSON.parse(inputValue);
            // 检测解析后的值是否为数组或对象
            if (isValidJson(jsonArray)) {
                if (jsonArray.length === 0) { return; }
                let newArray = processJsonArray(jsonArray);
                resolve(newArray);
                if (newArray.length === 1) {
                    storExeButtons(newArray[0]).then(() => {
                        localStorage.options_webtitle_status = 1;
                    });
                }
            } else {
                reject(createError("导入配置:无法处理数据,请查看报错!"));
            }
        } catch (error) {
            console.error(error);
            reject(createError("导入配置:转换或者数据处理过程中出错了,详细错误请查看开发者工具(F12)!"));
        }
    });
}

function wrapInputInArray(input) {
    if (input.startsWith('{') && input.endsWith('}')) {
        return '[' + input + ']';
    }
    return input;
}

function isValidJson(jsonArray) {
    return Array.isArray(jsonArray) || (typeof jsonArray === 'object' && jsonArray !== null);
}

function processJsonArray(jsonArray) {
    let newArray = [];
    const versionCheck = compareVersions("1.1.8.1");
    for (const item of jsonArray) {
        if (Object.keys(item).length === 0) {
            continue;
        }
        if (!item.data) {
            const newItem = { ...item }
            delete newItem.ConfigName
            delete newItem.ConfigTime
            newArray.push({
                id: generateUniqueId(),
                data: oldVersionTransformData(newItem),
                ConfigName: item.ConfigName || chrome.i18n.getMessage("Config"),
            });

        } else {
            item.data = oldVersionTransformData(item.data)
            newArray.push({ ...item, id: generateUniqueId() });
        }
    }
    return newArray;
}
function oldVersionTransformData(oldData) {
    const fieldMapping = {
        options_UploadPath: 'UploadPath', //路径
        options_exe: 'Program',// 程序
        options_host: 'Host', //√
        options_token: 'Token',//token
        options_album_id: 'Album_id',//相册ip
        options_expiration_select: 'Expiration', //有效期
        options_nsfw_select: 'Nsfw', //nsfw
        options_source: 'Source', //来源
        options_AppId: 'AppId',//  AppId
        options_Bucket: 'Bucket', // 存储桶
        options_Custom_domain_name: 'custom_DomainName', // 自定义域名
        options_Region: 'Region', // 地域
        options_SecretId: 'SecretId', // 密钥
        options_SecretKey: 'SecretKey', // 密钥
        options_uid: 'Uid', // uid
        options_imgur_post_mode: 'imgur_post_mode', // 模式
        options_Endpoint: 'Endpoint', // 端点
        options_owner: 'Owner',
        options_repository: 'Repository',
        options_parameter: 'Parameter',
        options_return_success: 'return_success',
        Keyword_replacement1: 'Keyword_replacement1',
        Keyword_replacement2: 'Keyword_replacement2',
        custom_Base64Upload: 'custom_Base64Upload',
        custom_Base64UploadRemovePrefix: 'custom_Base64UploadRemovePrefix',
        custom_BodyStringify: 'custom_BodyStringify',
        custom_BodyUpload: 'custom_BodyUpload',
        custom_KeywordReplacement: 'custom_KeywordReplacement',
        custom_ReturnAppend: 'custom_ReturnAppend',
        custom_ReturnJson: 'custom_ReturnJson',
        custom_ReturnPrefix: 'custom_ReturnPrefix',
        options_Body: 'Body',
        options_Headers: 'Headers',
        options_apihost: 'Url',
        requestMethod: 'requestMethod'
    };
    const valueMapping = {
        Program: {
            "GitHubUP": "GitHub",
            "imgdd": "IMGDD",
            "UserDiy": "Custom",
            "BaiJiaHaoBed": "BaiJiaHao",
            "toutiaoBed": "toutiao",
        },
        // Host: {
        //     "pnglog.com": "google.com"
        // }
    };
    let newData = {};
    for (const [oldKey, oldValue] of Object.entries(oldData)) {
        const newKey = fieldMapping[oldKey] || oldKey;
        newData[newKey] = oldValue;
    }

    // 根据 valueMapping 进行特定值的转换
    for (const [field, mappings] of Object.entries(valueMapping)) {
        if (field in newData && newData[field] in mappings) {
            newData[field] = mappings[newData[field]];
        }
    }

    return newData;
}
function createError(content) {
    return {
        type: "error",
        message: {
            title: "失败",
            content,
            duration: 3000,
            keepAliveOnHover: true,
            placement: 'bottom'
        }
    };
}

/**
 * 复制文本内容到剪贴板。
 * @param {String} value - 要复制到剪贴板的文本内容。
 * @param {Function} callback - 复制操作完成后的回调函数。
 * @throws {Error} 如果复制操作失败，将抛出一个错误。
 */
export function copyText(value, callback) {
    navigator.clipboard.writeText(value)
        .then(() => {
            callback({ message: "复制成功！", type: "success" });
        })
        .catch(err => {
            callback({ message: "复制失败！", type: "error" });
            throw new Error("复制操作失败：" + err.message);
        });
}

/**
 * 生成不同格式的链接或图像标记。
 * @param {String} mode - 生成链接的模式，可选值为 'URL', 'HTML', 'BBCode', 'Markdown', 'MDWithLink'。
 * @param {String} src - 图片的源 URL。
 * @param {String} name - 图片的名称或 alt 文本（仅在某些模式下使用）。
 * @returns {String} - 返回根据模式生成的链接或图像标记。
 */
export function generateLink(mode, src, name) {
    const linkFormats = {
        'URL': src,
        'HTML': `<img src="${src}" alt="${name}" title="${name}">`,
        'BBCode': `[img]${src}[/img]`,
        'Markdown': `![${name}](${src})`,
        'MDWithLink': `[![${name}](${src})](${src})`,
    };

    return linkFormats[mode] || '';
}

/**
 * 根据传值计算文件大小和单位
 * @param {String} size - 文件大小
 * @returns {String} - 返回计算后的文件大小和单位
 */
export function getFormatFileSize(size) {
    if (typeof size !== 'number') {
        size = Number(size);
    }
    if (isNaN(size)) {
        return 'Invalid size';
    }
    const units = ["byte", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB", "BB", "NB", "DB", "CB", "XB", "?B"];
    let index = 0;
    while (size >= 1024 && index < units.length - 1) {
        size /= 1024;
        index++;
    }
    return size.toFixed(2) + units[index];
}

//使用判断当前版本
export function compareVersions(version) {
    const v1Parts = version.split('.').map(Number);
    const v2Parts = chrome.runtime.getManifest().version.split('.').map(Number);
    const length = Math.max(v1Parts.length, v2Parts.length);

    for (let i = 0; i < length; i++) {
        const v1 = v1Parts[i] || 0;
        const v2 = v2Parts[i] || 0;

        if (v1 > v2) {
            return 1;
        }
        if (v1 < v2) {
            return -1;
        }
    }

    return 0;
}