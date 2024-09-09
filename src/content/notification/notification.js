const notificationModule = (function () {
    const storageAPI = typeof browser !== 'undefined' && browser.storage ? browser.storage : typeof chrome !== 'undefined' && chrome.storage ? chrome.storage : null;
    const MAX_NOTIFICATIONS = 8; // 最大允许的通知数量
    const notifications = [];

    /**
     * 创建通知函数
     * @param {object} config 
     * @returns 
     */
    function createNotification(config) {
        const defaultConfig = {
            type: 'info',  // 默认类型为信息通知
            title: chrome.i18n.getMessage("app_name") + ':', // 默认标题为通知
            content: 'No Data',   // 默认内容为空
            duration: 10,   // 默认持续时间为10秒
            style: "", // content的行内样式
            overwrite: true, // 默认重复内容覆盖
            saved: false, // 存储通知, 刷新页面也会通知
            buttons: [], // 按钮组
        };

        // 合并配置项
        config = { ...defaultConfig, ...config };
        config.type = mapNotificationType(config.type);

        if (notifications.length >= MAX_NOTIFICATIONS) {
            // 如果通知数量达到最大值，删除最早的通知
            const oldestNotification = notifications.shift();
            closeNotification(oldestNotification, config);
        }

        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = "notification-container";
            container.className = "notification-container";
            document.body.appendChild(container);
        }

        const icon = getNotificationIcon(config.type);
        const existingNotification = notifications.find(item => item.content === config.content);

        if (existingNotification && config.overwrite) {
            updateExistingNotification(existingNotification, config, icon);
            return;
        }

        // 构建通知
        const notificationElement = createNotificationElement(config, icon);
        container.appendChild(notificationElement);

        notifications.push({
            type: config.type,
            content: config.content,
            duration: config.duration,
            element: notificationElement
        });

        if (config.saved) {
            saveNotificationToStorage(config);
        }
    }

    function mapNotificationType(type) {
        switch (type) {
            case "信息": return "info";
            case "成功": return "success";
            case "失败": return "error";
            case "警告": return "warning";
            default: return type;
        }
    }

    function getNotificationIcon(type) {
        const icons = {
            success: `<svg t="1698570611098" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1018" width="200" height="200"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#52C41A" p-id="1019"></path><path d="M178.614857 557.860571a42.496 42.496 0 0 1 60.123429-60.050285l85.942857 87.625143a42.496 42.496 0 0 1-60.050286 60.123428L178.614857 557.860571z m561.005714-250.148571a42.496 42.496 0 1 1 65.097143 54.637714L394.459429 725.577143a42.496 42.496 0 0 1-65.097143-54.637714l410.112-363.373715z" fill="#FFFFFF" p-id="1020"></path></svg>`, // 省略部分SVG内容
            warning: `<svg t="1698570630797" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1173" width="200" height="200"><path d="M492.763429 0C220.745143 0 0 218.477714 0 487.643429c0 269.165714 220.745143 487.570286 492.763429 487.570285 272.018286 0 492.763429-218.404571 492.763428-487.570285S764.781714 0 492.763429 0z m-49.298286 682.642286c0-26.916571 21.869714-48.713143 48.786286-48.713143h1.024a48.786286 48.786286 0 0 1 0 97.499428H492.251429a48.786286 48.786286 0 0 1-48.786286-48.786285z m0-195.510857V293.083429a49.298286 49.298286 0 1 1 98.523428 0V487.131429a49.298286 49.298286 0 1 1-98.523428 0z" fill="#FAAD14" p-id="1174"></path></svg>`,
            error: `<svg t="1698570641215" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1327" width="200" height="200"><path d="M512 0a512 512 0 0 0-512 512 512 512 0 0 0 512 512 512 512 0 0 0 512-512 512 512 0 0 0-512-512z" fill="#FD6B6D" p-id="1328"></path><path d="M513.755429 565.540571L359.277714 720.018286a39.058286 39.058286 0 0 1-55.296-0.073143 39.277714 39.277714 0 0 1 0.073143-55.442286l154.331429-154.331428-155.062857-155.136a36.571429 36.571429 0 0 1 51.712-51.785143l365.714285 365.714285a36.571429 36.571429 0 1 1-51.785143 51.785143L513.755429 565.540571z m157.549714-262.582857a35.254857 35.254857 0 1 1 49.737143 49.737143l-106.057143 108.982857a35.254857 35.254857 0 1 1-49.883429-49.810285l106.203429-108.982858z" fill="#FFFFFF" p-id="1329"></path></svg>`,
            info: `<svg t="1698570649880" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1482" width="200" height="200"><path d="M512 0a512 512 0 0 0-512 512 512 512 0 0 0 512 512 512 512 0 0 0 512-512 512 512 0 0 0-512-512z" fill="#05CFA4" p-id="1483"></path><path d="M541.769143 393.142857a50.322286 50.322286 0 1 1 0-100.571428 50.322286 50.322286 0 0 1 0 100.571428zM369.810286 542.061714c-24.502857 20.333714 67.437714-95.085714 100.352-115.565714 32.914286-20.406857 91.209143-4.973714 83.163428 42.276571-8.045714 47.323429-59.172571 220.013714-70.802285 261.12-11.702857 41.106286 71.68-38.107429 88.137142-48.128 16.457143-9.947429-62.902857 93.184-100.498285 114.907429-37.595429 21.723429-93.769143-7.68-82.651429-47.030857 11.190857-39.424 52.662857-186.514286 69.632-244.882286 16.969143-58.441143-62.902857 16.969143-87.332571 37.302857z" fill="#FFFFFF" p-id="1484"></path></svg>`
        };
        return icons[type] || icons.info;
    }

    function updateExistingNotification(existingNotification, config, icon) {
        existingNotification.element.className = `notification ${config.type}`;
        existingNotification.element.querySelector(".icon").innerHTML = icon;
        existingNotification.element.querySelector(".title").innerHTML = config.title;
        updateCountdown(config, existingNotification.element);
        updateNotificationInStorage(config, () => {
            console.log('通知已更新');
        });
    }

    function createNotificationElement(config, icon) {
        const notificationElement = document.createElement('div');
        notificationElement.className = `notification ${config.type}`;
        notificationElement.innerHTML = `
            <div class="notification-title">
                <span class="icon">${icon}</span>
                <span class="title">${config.title}</span>  
            </div>
            <hr>
            <div class="notification-content" style="${config.style}">${config.content}</div>`;

        const closeButton = createButton('X', 'close', () => closeNotification(notificationElement, config));
        const reduceButton = createButton('>', 'reduce', () => toggleNotificationSize(notificationElement));

        notificationElement.appendChild(closeButton);
        notificationElement.appendChild(reduceButton);

        if (config.buttons) {
            const buttonsContainer = createButtonsContainer(config.buttons, notificationElement, config);
            notificationElement.appendChild(buttonsContainer);
        }

        updateCountdown(config, notificationElement);
        return notificationElement;
    }

    function createButton(text, className, onClick) {
        const button = document.createElement('button');
        button.innerHTML = text;
        if (className) button.className = className;
        if (onClick) button.addEventListener('click', onClick);
        return button;
    }

    function createButtonsContainer(buttonsConfig, notificationElement, config) {
        const buttonsContainer = document.createElement(buttonsConfig.label || 'div');
        if (buttonsConfig.class) buttonsContainer.className = buttonsConfig.class;
        if (buttonsConfig.style) buttonsContainer.style = buttonsConfig.style;

        const buttons = Array.isArray(buttonsConfig) ? buttonsConfig : buttonsConfig.buttons;

        buttons.forEach(btnConfig => {
            const button = createButton(btnConfig.text || "我是一个按钮", btnConfig.class);
            if (typeof btnConfig.init === 'function') {
                btnConfig.init.call(button, () => closeNotification(notificationElement, config));
            }
            if (btnConfig.style) button.style = btnConfig.style;
            buttonsContainer.appendChild(button);
        });

        return buttonsContainer;
    }
    function updateCountdown(config, notificationElement) {
        if (config.duration < 1) return;

        let timer;
        const progressBar = document.createElement('div');
        progressBar.className = "progress-bar";
        notificationElement.appendChild(progressBar);
        progressBar.style.animation = `PLprogress ${config.duration}s linear`;

        let remainingTime = config.duration;
        const updateRemainingTime = () => {
            progressBar.textContent = `${remainingTime}`;
        };

        timer = setInterval(() => {
            remainingTime--;
            updateRemainingTime();
        }, 1000);

        const handleAnimationEnd = () => {
            progressBar.removeEventListener('animationend', handleAnimationEnd);
            progressBar.remove();
            closeNotification(notificationElement, config);
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                clearInterval(timer);
                progressBar.style.animationPlayState = 'paused';
            } else {
                timer = setInterval(() => {
                    remainingTime--;
                    updateRemainingTime();
                }, 1000);
                progressBar.style.animationPlayState = 'running';
            }
        };

        const handleMouseEnter = () => {
            clearInterval(timer);
            progressBar.style.animationPlayState = 'paused';
        };

        const handleMouseLeave = () => {
            timer = setInterval(() => {
                remainingTime--;
                updateRemainingTime();
            }, 1000);
            progressBar.style.animationPlayState = 'running';
        };

        progressBar.addEventListener('animationend', handleAnimationEnd);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        notificationElement.addEventListener('mouseenter', handleMouseEnter);
        notificationElement.addEventListener('mouseleave', handleMouseLeave);
    }

    function closeNotification(notificationElement, config) {
        removeNotificationFromStorage(config);
        notificationElement.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notificationElement.remove();
            const index = notifications.findIndex(item => item.content === config.content);
            if (index !== -1) {
                notifications.splice(index, 1);
            }
        }, 300);
    }

    function toggleNotificationSize(notificationElement) {
        const isReduced = notificationElement.style.minWidth === '0px';
        notificationElement.style.minWidth = isReduced ? '200px' : '0px';
        notificationElement.querySelector('.reduce').textContent = isReduced ? '<' : '>';
        notificationElement.querySelectorAll('*').forEach(child => {
            child.classList.toggle('reduceActive');
        });
    }

    function getSavedNotifications(callback) {
        if (!storageAPI) {
            console.error('存储API不受支持');
            return;
        }
        storageAPI.local.get({ 'PLSavedNotifications': [] }, (data) => {
            const savedNotifications = data.PLSavedNotifications || [];
            callback(savedNotifications);
        });
    }

    function saveNotificationToStorage(config) {
        if (!storageAPI) {
            console.error('存储API不受支持');
            return;
        }
        delete config.saved;
        getSavedNotifications((savedNotifications) => {
            savedNotifications.push(config);
            if (savedNotifications.length > MAX_NOTIFICATIONS) {
                savedNotifications.shift();
            }
            storageAPI.local.set({ 'PLSavedNotifications': savedNotifications });
        });
    }

    function removeNotificationFromStorage(config) {
        if (!storageAPI) {
            console.error('存储API不受支持');
            return;
        }
        getSavedNotifications((savedNotifications) => {
            const updatedNotifications = savedNotifications.filter(item => item.content !== config.content);
            storageAPI.local.set({ 'PLSavedNotifications': updatedNotifications });
        });
    }

    function updateNotificationInStorage(updatedNotification, callback) {
        if (!storageAPI) {
            console.error('存储API不受支持');
            return;
        }
        getSavedNotifications((savedNotifications) => {
            const updatedNotifications = savedNotifications.map(notification => {
                return notification.content === updatedNotification.content ? updatedNotification : notification;
            });
            storageAPI.local.set({ 'PLSavedNotifications': updatedNotifications }, callback);
        });
    }

    // 在页面加载时检索并显示已保存的通知
    getSavedNotifications((savedNotifications) => {
        savedNotifications.forEach(notification => {
            createNotification(notification);
        });
    });

    chrome.runtime.onMessage.addListener((request) => {
        // chrome.runtime.sendMessage({
        //     notification: {
        //         injectPage: {
        //             type: 'info',  // 默认类型为信息通知
        //             title: '盘络上传:', // 默认标题为通知
        //             content: 'No Data',   // 默认内容为空
        //             duration: 10,   // 默认持续时间为10秒
        //             saved: false, //存储通知,刷新页面也会通知
        //         }
        //     },
        // });
        if (!request.diffuseNotification) return;
        const { injectPage, progressBar } = request.diffuseNotification;
        if (injectPage) {
            createNotification(injectPage);
        }
        if (progressBar) {
            const status = progressBar.status
            const type = status == "2" ? "success" : status == "1" ? "warning" : status == "0" ? "error" : "info";
            const title = status == "2" ? "上传成功" : status == "1" ? "上传中..." : status == "0" ? "上传失败" : "上传失败";
            const duration = status == "2" ? 15 : 0;
            const saved = status == "2" ? false : status == "1" ? true : false;
            createNotification({
                title: title,
                type: type,
                content: progressBar.filename,
                duration: duration,
                saved: saved,
            });
        }
    });

    window.addEventListener('message', (event) => {
        if (event.data.type === 'PLNotification') {
            const data = typeof event.data.data === "object" ? event.data.data : JSON.parse(event.data.data);
            createNotification(data);
        }
    });
    window.createNotification = createNotification;
})();

