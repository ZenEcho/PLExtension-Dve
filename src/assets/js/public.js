import { dbHelper } from '@/assets/js/db';
import { buttonsData } from '@/assets/js/arrayObjectData';

export function createButtonIconMarkup(icon, w = 32, h = 32) {
    if (icon && icon.trim().startsWith('<svg')) {
        return icon;
    } else if (icon) {
        return `<img src="${icon}"class="w-full h-full" />`;
    } else {
        return `<svg t="1703817171733" class="w-full h-full" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
      p-id="11159" width="${w}" height="${h}">
      <path
          d="M432.718512 194.015006H916.517638c21.847665 0 39.559857 17.522773 39.559857 39.134945v564.763883c0 21.616267-17.712192 39.132897-39.559857 39.132897H105.718208c-21.847665 0-39.561905-17.51663-39.561906-39.132897v-564.764907c0-21.612171 17.71424-39.134945 39.561906-39.134945h327.000304z"
          fill="#FFFFFF" p-id="11160"></path>
      <path
          d="M916.516614 220.416913c7.255251 0 13.15795 5.712256 13.15795 12.732014v564.763883c0 7.019758-5.902699 12.73099-13.15795 12.73099H105.718208c-7.256275 0-13.158974-5.711232-13.158975-12.73099V233.148927c0-7.020782 5.902699-12.732014 13.158975-12.732014h810.798406m0-26.401907H105.718208c-21.847665 0-39.561905 17.522773-39.561906 39.133921v564.763883c0 21.616267 17.71424 39.132897 39.561906 39.132897h810.798406c21.847665 0 39.560881-17.51663 39.560881-39.132897V233.148927c0-21.611148-17.713216-39.133921-39.560881-39.133921z"
          fill="#4E6DC4" p-id="11161"></path>
      <path
          d="M934.895356 796.822372c0 12.132017-13.619723 21.96746-30.421681 21.96746H120.391508c-16.800934 0-30.421681-9.835442-30.421681-21.96746v-83.544947s98.066713-164.881373 169.187835-161.261939c33.551698 1.707841 152.003968 87.402947 238.010335 87.402947 84.053818 0 123.329035-179.371398 237.161534-179.371398 61.054282 0 200.564801 109.915114 200.564801 109.915113v226.860224z"
          fill="#DCE5F7" p-id="11162"></path>
      <path
          d="M904.478794 831.996928H120.391508c-24.468811 0-43.625706-15.444286-43.625706-35.168413v-83.55109c0-2.372342 0.645048-4.705777 1.856304-6.742285 10.339194-17.404003 104.976915-171.982018 181.206201-167.702177 15.276369 0.773033 39.048939 12.801638 71.948422 29.444894 48.331483 24.449358 114.529765 57.941671 165.388197 57.94167 32.319964 0 59.920841-36.109364 89.146623-74.340217 37.617547-49.233526 80.276705-105.035276 148.023102-105.035277 63.788056 0 194.084631 101.205945 208.730286 112.744109a13.230646 13.230646 0 0 1 5.027277 10.370935v226.868414c-0.001024 19.725151-19.157918 35.169437-43.61342 35.169437zM103.167709 716.938839v79.889676c0 3.493497 6.871294 8.766506 17.223799 8.766506h784.087286c10.352505 0 17.210488-5.273009 17.210489-8.766506V576.405459c-41.614795-32.106996-142.969203-103.159518-187.355656-103.159519-54.70005 0-91.480058 48.124658-127.047787 94.664342-33.299822 43.561201-64.755627 84.711152-110.120914 84.711152-57.16147 0-126.596253-35.129505-177.312365-60.783976-25.409762-12.852832-51.670373-26.144912-61.36452-26.640472l-1.650503-0.038908c-50.819524 0-126.325947 106.691923-153.669829 151.780761z"
          fill="#4E6DC4" p-id="11163"></path>
      <path
          d="M290.78548 382.564513m-65.512279 0a65.512279 65.512279 0 1 0 131.024558 0 65.512279 65.512279 0 1 0-131.024558 0Z"
          fill="#FFFFFF" p-id="11164"></path>
      <path
          d="M290.806982 461.276721l-1.250164-0.006143c-21.026509-0.328667-40.660534-8.823844-55.29288-23.927176-14.632345-15.096165-22.509095-34.994353-22.186571-56.014719 0.670645-42.716496 35.968068-77.472283 78.690707-77.472283 22.276673 0.334811 41.910698 8.831011 56.543043 23.93332 14.632345 15.096165 22.495784 34.988209 22.173261 56.008575-0.669621 42.721615-35.967044 77.478426-78.677396 77.478426z m0.786344-131.012271c-29.225783 0-52.675828 23.088614-53.114052 51.476859-0.219111 13.975011 5.01499 27.195418 14.748045 37.224375 9.720767 10.036124 22.767114 15.682852 36.741101 15.901963l0.837538 13.207097v-13.200954c28.387221 0 51.837266-23.095781 52.275489-51.489145 0.219111-13.967844-5.01499-27.188251-14.734734-37.224375-9.720767-10.029981-22.767114-15.676708-36.741101-15.89582h-0.012286z"
          fill="#4E6DC4" p-id="11165"></path>
  </svg>`;
    }
}
export function createIconMarkup(data) {
    const match = buttonsData.find(button => button.value === data.data.program);
    let icon = match.icon
    if (icon && icon.trim().startsWith('<svg')) {
        return icon;
    } else if (icon) {
        return `<img src="${icon}"class="w-full h-full" />`;
    } else {
        return `<svg t="1703817171733" class="w-full h-full" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
      p-id="11159" width="32" height="32">
      <path
          d="M432.718512 194.015006H916.517638c21.847665 0 39.559857 17.522773 39.559857 39.134945v564.763883c0 21.616267-17.712192 39.132897-39.559857 39.132897H105.718208c-21.847665 0-39.561905-17.51663-39.561906-39.132897v-564.764907c0-21.612171 17.71424-39.134945 39.561906-39.134945h327.000304z"
          fill="#FFFFFF" p-id="11160"></path>
      <path
          d="M916.516614 220.416913c7.255251 0 13.15795 5.712256 13.15795 12.732014v564.763883c0 7.019758-5.902699 12.73099-13.15795 12.73099H105.718208c-7.256275 0-13.158974-5.711232-13.158975-12.73099V233.148927c0-7.020782 5.902699-12.732014 13.158975-12.732014h810.798406m0-26.401907H105.718208c-21.847665 0-39.561905 17.522773-39.561906 39.133921v564.763883c0 21.616267 17.71424 39.132897 39.561906 39.132897h810.798406c21.847665 0 39.560881-17.51663 39.560881-39.132897V233.148927c0-21.611148-17.713216-39.133921-39.560881-39.133921z"
          fill="#4E6DC4" p-id="11161"></path>
      <path
          d="M934.895356 796.822372c0 12.132017-13.619723 21.96746-30.421681 21.96746H120.391508c-16.800934 0-30.421681-9.835442-30.421681-21.96746v-83.544947s98.066713-164.881373 169.187835-161.261939c33.551698 1.707841 152.003968 87.402947 238.010335 87.402947 84.053818 0 123.329035-179.371398 237.161534-179.371398 61.054282 0 200.564801 109.915114 200.564801 109.915113v226.860224z"
          fill="#DCE5F7" p-id="11162"></path>
      <path
          d="M904.478794 831.996928H120.391508c-24.468811 0-43.625706-15.444286-43.625706-35.168413v-83.55109c0-2.372342 0.645048-4.705777 1.856304-6.742285 10.339194-17.404003 104.976915-171.982018 181.206201-167.702177 15.276369 0.773033 39.048939 12.801638 71.948422 29.444894 48.331483 24.449358 114.529765 57.941671 165.388197 57.94167 32.319964 0 59.920841-36.109364 89.146623-74.340217 37.617547-49.233526 80.276705-105.035276 148.023102-105.035277 63.788056 0 194.084631 101.205945 208.730286 112.744109a13.230646 13.230646 0 0 1 5.027277 10.370935v226.868414c-0.001024 19.725151-19.157918 35.169437-43.61342 35.169437zM103.167709 716.938839v79.889676c0 3.493497 6.871294 8.766506 17.223799 8.766506h784.087286c10.352505 0 17.210488-5.273009 17.210489-8.766506V576.405459c-41.614795-32.106996-142.969203-103.159518-187.355656-103.159519-54.70005 0-91.480058 48.124658-127.047787 94.664342-33.299822 43.561201-64.755627 84.711152-110.120914 84.711152-57.16147 0-126.596253-35.129505-177.312365-60.783976-25.409762-12.852832-51.670373-26.144912-61.36452-26.640472l-1.650503-0.038908c-50.819524 0-126.325947 106.691923-153.669829 151.780761z"
          fill="#4E6DC4" p-id="11163"></path>
      <path
          d="M290.78548 382.564513m-65.512279 0a65.512279 65.512279 0 1 0 131.024558 0 65.512279 65.512279 0 1 0-131.024558 0Z"
          fill="#FFFFFF" p-id="11164"></path>
      <path
          d="M290.806982 461.276721l-1.250164-0.006143c-21.026509-0.328667-40.660534-8.823844-55.29288-23.927176-14.632345-15.096165-22.509095-34.994353-22.186571-56.014719 0.670645-42.716496 35.968068-77.472283 78.690707-77.472283 22.276673 0.334811 41.910698 8.831011 56.543043 23.93332 14.632345 15.096165 22.495784 34.988209 22.173261 56.008575-0.669621 42.721615-35.967044 77.478426-78.677396 77.478426z m0.786344-131.012271c-29.225783 0-52.675828 23.088614-53.114052 51.476859-0.219111 13.975011 5.01499 27.195418 14.748045 37.224375 9.720767 10.036124 22.767114 15.682852 36.741101 15.901963l0.837538 13.207097v-13.200954c28.387221 0 51.837266-23.095781 52.275489-51.489145 0.219111-13.967844-5.01499-27.188251-14.734734-37.224375-9.720767-10.029981-22.767114-15.676708-36.741101-15.89582h-0.012286z"
          fill="#4E6DC4" p-id="11165"></path>
  </svg>`;
    }
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
                        localStorage.options_webtitle_status = 1
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
        chrome.storage.local.get([key], function (result) {
            if (chrome.runtime.lastError) {
                // 处理错误
                reject(chrome.runtime.lastError);
            } else {
                // 返回对应键的值
                resolve(result[key]);
            }
        });
    });
}
// 存储安装图床的
export async function storExeButtons(data) {
    return new Promise((resolve, reject) => {
        let filteredData = buttonsData.filter(Data => {
            return Data.value === data.data.program;
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
export function LocalStorage(data) {

    let pluginPopup = chrome.runtime.getURL("popup.html");
    let currentURL = window.location.href;

    return new Promise((resolveC, rejectC) => {
        let filename = data.file.name || data.file.file.name;
        let imageUrl = data.url
        let MethodName = data.MethodName || "normal";
        let uploadDomainName = data.uploadDomainName || data.Host;
        if (pluginPopup != currentURL) {
            chrome.runtime.sendMessage({ "Progress_bar": { "filename": filename, "status": 2 } });
        }
        chrome.storage.local.get('UploadLog', function (result) {
            let UploadLog = result.UploadLog || [];
            if (!Array.isArray(UploadLog)) {
                UploadLog = [];
            }
            let d = new Date();
            let UploadLogData = {
                key: crypto.randomUUID(),
                url: imageUrl,
                uploadExe: data.Host + "-" + MethodName,
                upload_domain_name: uploadDomainName,
                original_file_name: filename,
                file_size: data.file.file.size,
                img_file_size: "宽:不支持,高:不支持",
                uploadTime: d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日" + d.getHours() + "时" + d.getMinutes() + "分" + d.getSeconds() + "秒"
            }
            if (typeof UploadLog !== 'object') {
                UploadLog = JSON.parse(UploadLog);
            }
            UploadLog.push(UploadLogData);
            chrome.storage.local.set({ 'UploadLog': UploadLog }, function () {
                if (window.location.href.startsWith('http')) {
                    chrome.runtime.sendMessage({ Loudspeaker: chrome.i18n.getMessage("Upload_prompt2") });
                    AutoInsertFun(imageUrl, false)
                }
                resolveC(true);
            })
        });
    });
}
// 文本域自动高度
export function autoExpand(event) {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}


