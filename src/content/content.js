(function () {
    // 初始化状态
    let isDragging = false;
    let dragTimeout;
    let isClickPrevented = false;
    let isMouseOverSidebar = false;
    let uploadAreaRect;
    let isIframeMouseOver = false;
    let closeIframeTimeout;
    let startY, startTop;

    // 初始化数据
    let configData = null;
    const logoURL = chrome.runtime.getURL("icons/logo256.png");

    // 初始化函数
    function initialize() {
        fetchConfigData().then(result => {
            configData = result;
            if (!configData.uploadFunctionSettings.dragUpload) { return; }
            const uploadArea = createUploadArea();
            const iframeContainer = createIframeContainer();
            const iframe = createIframe(iframeContainer);

            document.body.appendChild(uploadArea);
            document.body.appendChild(iframeContainer);

            applyUploadAreaStyles(uploadArea, result.uploadArea);
            applyIframeStyles(iframeContainer, iframe);

            uploadAreaRect = uploadArea.getBoundingClientRect();
            window.addEventListener('resize', () => {
                uploadArea.style.display = "block";
                uploadAreaRect = uploadArea.getBoundingClientRect();
            });

            handleSidebarPosition(uploadArea, iframe, result.uploadArea.position);

            uploadArea.addEventListener('mousedown', (e) => handleMouseDown(e, uploadArea));
            document.addEventListener('mouseup', (e) => handleMouseUp(e, uploadArea));
            document.addEventListener('mousemove', (e) => handleMouseMove(e, uploadArea, uploadAreaRect, result.uploadArea.position));
            applyUploadAreaBackground(uploadArea, result.uploadArea.opacity);

            document.addEventListener("dragover", (event) => handleDragOver(event, uploadArea, result.uploadFunctionSettings.dragUpload, result.uploadArea.position));
            document.addEventListener("dragend", (event) => handleDragEnd(event, uploadArea));
            document.addEventListener('drop', (event) => handleDrop(event, uploadArea));

            if (result.uploadFunctionSettings.dragUpload) {
                uploadArea.addEventListener("drop", (event) => handleUploadDrop(event, uploadArea));
            }

            uploadArea.addEventListener('click', () => handleUploadAreaClick(uploadArea, iframe, iframeContainer, result.uploadFunctionSettings.dragUpload));
            iframeContainer.addEventListener('click', () => handleIframeContainerClick(iframe, iframeContainer, uploadArea));

            iframe.addEventListener('mouseout', () => {
                isIframeMouseOver = true;
                closeIframeTimeout = setTimeout(() => {
                    hideIframe(iframe, iframeContainer, uploadArea);
                }, result.uploadArea.closeTime * 1000);
            });

            iframe.addEventListener('mouseover', () => {
                clearTimeout(closeIframeTimeout);
            });

            // injectResources(["static/content/notification/notification.css"], ["static/content/notification/notification.js"])
        });
    }

    initialize();

    // 获取配置数据函数
    function fetchConfigData() {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ action: "getStorage" }, response => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(response);
                }
            });
        });
    }

    // 创建上传区域
    function createUploadArea() {
        const uploadArea = document.createElement('PL-Extension');
        uploadArea.id = 'PL_uploadArea';
        uploadArea.setAttribute('title', '长按拖动');
        return uploadArea;
    }

    // 创建 iframe 容器
    function createIframeContainer() {
        const iframeContainer = document.createElement('pl-iframebox');
        return iframeContainer;
    }

    // 创建 iframe
    function createIframe(iframeContainer) {
        const iframe = document.createElement('iframe');
        iframe.className = 'PL-iframe';
        iframe.allow = 'clipboard-write'; // Add allow attribute
        iframeContainer.appendChild(iframe);
        return iframe;
    }

    // 应用上传区域样式
    function applyUploadAreaStyles(uploadArea, config) {
        uploadArea.style.width = `${config.width}px`;
        uploadArea.style.height = `${config.height}%`;
        uploadArea.style.top = `${config.location}%`;
        uploadArea.style.zIndex = `${Math.pow(2, 31) - 1}`;
    }

    // 应用 iframe 样式
    function applyIframeStyles(iframeContainer, iframe) {
        const maxZIndex = Math.pow(2, 31) - 1;
        iframeContainer.style.zIndex = `${maxZIndex - 1}`;
        iframe.style.zIndex = `${maxZIndex}`;
    }

    // 处理侧边栏位置
    function handleSidebarPosition(uploadArea, iframe, position) {
        switch (position) {
            case "Left":
                uploadArea.style.borderRadius = "0px 10px 10px 0px";
                uploadArea.style.left = `-${configData.uploadArea.width + 10}px`;
                uploadArea.style.transition = "left 0.3s ease-in-out";
                iframe.style.left = "-900px";
                iframe.style.transition = "left 0.3s ease-in-out";
                break;
            case "Right":
                uploadArea.style.borderRadius = "10px 0px 0px 10px";
                uploadArea.style.right = `-${configData.uploadArea.width + 10}px`;
                uploadArea.style.transition = "right 0.3s ease-in-out";
                iframe.style.right = "-900px";
                iframe.style.transition = "right 0.3s ease-in-out";
                break;
        }
    }

    // 处理鼠标移动事件
    function handleMouseMove(e, uploadArea, uploadAreaRect, position) {
        const x = e.clientX;
        const y = e.clientY;
        let w = window.innerWidth;
        let h = window.innerHeight;

        if (isDragging) {
            const deltaY = y - startY;
            const newTop = startTop + deltaY;
            if (newTop >= 0 && newTop + uploadArea.clientHeight <= uploadArea.parentElement.clientHeight) {
                uploadArea.style.top = `${newTop}px`;
                uploadArea.style[position === 'Left' ? 'left' : 'right'] = '0';
                isClickPrevented = true;
            }
            uploadAreaRect = uploadArea.getBoundingClientRect();
            return;
        }

        const isLeft = position === 'Left';
        const isRight = position === 'Right';

        if (isRight && document.body.scrollHeight > window.innerHeight) {
            w -= window.innerWidth - document.body.clientWidth;
            h -= window.innerHeight - document.body.clientHeight;
        }

        const isXWithinSidebar = (isLeft && x < uploadAreaRect.width) || (isRight && x > w - uploadAreaRect.width);

        if (isXWithinSidebar && y > uploadAreaRect.top && y < uploadAreaRect.top + uploadAreaRect.height) {
            uploadArea.style[isLeft ? 'left' : 'right'] = '0';
            isMouseOverSidebar = true;
        } else {
            isMouseOverSidebar = false;
        }

        if (!isMouseOverSidebar) {
            uploadArea.style[isLeft ? 'left' : 'right'] = `-${configData.uploadArea.width + 10}px`;
        }
    }

    // 应用上传区域背景
    function applyUploadAreaBackground(uploadArea, opacity) {
        uploadArea.style.background = `url(${logoURL}) no-repeat center rgba(60,64,67,${opacity / 100})`;
        uploadArea.style.backgroundSize = "contain";
    }

    // 处理鼠标按下事件
    function handleMouseDown(e, uploadArea) {
        dragTimeout = setTimeout(() => {
            isDragging = true;
            isClickPrevented = false;
            startY = e.clientY;
            startTop = uploadArea.offsetTop;
            uploadArea.classList.add('box-shadow-Blink');
        }, 500);
    }

    // 处理鼠标抬起事件
    function handleMouseUp(e, uploadArea) {
        clearTimeout(dragTimeout);
        isDragging = false;
        if (isClickPrevented) {
            uploadArea.style.display = "block";
            uploadAreaRect = uploadArea.getBoundingClientRect();
            uploadArea.classList.remove('box-shadow-Blink');
            setTimeout(() => { isClickPrevented = false }, 100);
        }
    }

    // 处理拖拽上传事件
    function handleDragOver(event, uploadArea, globalUpload, position) {
        const { uploadAreaX, uploadAreaY } = getUploadAreaCoordinates(event, uploadArea);

        if ((uploadAreaX >= 0 && uploadAreaX <= uploadAreaRect.width && uploadAreaY >= 0 && uploadAreaY <= uploadAreaRect.height) || event.dataTransfer.types.includes("Files")) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (event.target.tagName === "IMG" || event.dataTransfer.types.includes("Files")) {
            if (globalUpload) {
                event.target.setAttribute("data-PLExtension", "true");
                uploadArea.classList.remove('box-shadow-Blink');
                uploadArea.classList.add('box-shadow-Blink');
                uploadArea.style[position === "Left" ? 'left' : 'right'] = "0";
            }
        }
    }

    function handleDragEnd(event, uploadArea) {
        const { uploadAreaX, uploadAreaY } = getUploadAreaCoordinates(event, uploadArea);

        if (uploadAreaX >= 0 && uploadAreaX <= uploadAreaRect.width && uploadAreaY >= 0 && uploadAreaY <= uploadAreaRect.height) {
            event.preventDefault();
            event.stopPropagation();
        }
        uploadArea.classList.remove('box-shadow-Blink');
    }

    function handleDrop(event, uploadArea) {
        if (event.dataTransfer.types.includes("Files")) {
            event.preventDefault();
            event.stopPropagation();
            uploadArea.classList.remove('box-shadow-Blink');
        }
    }

    function handleUploadDrop(event, uploadArea) {
        event.preventDefault();
        event.stopPropagation();
        uploadPush(event)
        uploadArea.classList.remove('box-shadow-Blink');
    }

    // 处理点击事件
    function handleUploadAreaClick(uploadArea, iframe, iframeContainer, globalUpload) {
        if (isClickPrevented) return;
        showIframe(uploadArea, iframe, iframeContainer, globalUpload);
    }

    function handleIframeContainerClick(iframe, iframeContainer, uploadArea) {
        hideIframe(iframe, iframeContainer, uploadArea);
    }

    function showIframe(uploadArea, iframe, iframeContainer, globalUpload) {
        if (globalUpload) {
            iframeContainer.classList.add('PL-IframeBox');
            iframeSrc(iframe)
            iframe.style[configData.uploadArea.position === "Left" ? 'left' : 'right'] = "1px";
            iframe.contentWindow.focus();
            isIframeMouseOver = true;
            uploadArea.style.display = "none";
        }
    }

    function hideIframe(iframe, iframeContainer, uploadArea) {
        iframeContainer.classList.remove('PL-IframeBox');
        clearTimeout(closeIframeTimeout);
        if (isIframeMouseOver) {
            isIframeMouseOver = false;
            iframe.style[configData.uploadArea.position === "Left" ? 'left' : 'right'] = "-900px";
            uploadArea.style.display = "block";
        }
    }
    function iframeSrc(iframe) {
        if (!iframe.src) {
            iframe.src = chrome.runtime.getURL('popup.html');
            iframe.onload = () => iframe.contentWindow.focus();
        }
    }
    // 获取上传区域坐标
    function getUploadAreaCoordinates(event, uploadArea) {
        const uploadAreaRect = uploadArea.getBoundingClientRect();
        const uploadAreaX = event.clientX - uploadAreaRect.left;
        const uploadAreaY = event.clientY - uploadAreaRect.top;
        return { uploadAreaX, uploadAreaY };
    }
    function uploadPush(event) {
        if (event.dataTransfer.types.includes('text/uri-list')) {
            // 拖拽的是网络资源（URL）
            let htmlData = event.dataTransfer.getData('text/html');
            // 解析HTML数据为DOM树
            let parser = new DOMParser();
            let doc = parser.parseFromString(htmlData, 'text/html');
            // 在DOM树中查找img标签并获取src属性
            let imgTags = doc.getElementsByTagName('img');
            if (imgTags.length > 0) {
                let src = imgTags[0].getAttribute('src');
                chrome.runtime.sendMessage({
                    uploadMessage: {
                        data: src,
                        uploadMode: "dragUpload",
                        type: "link"
                    }
                });
                doc = null; //释放资源
            }
        } else if (event.dataTransfer.types.includes('Files')) {
            // 拖拽的是本地资源（文件）
            let files = event.dataTransfer.files;

            if (files.length > 0) {
                let fileReaders = [];
                let base64Files = [];

                for (let i = 0; i < files.length; i++) {
                    let file = files[i];
                    let reader = new FileReader();

                    reader.onload = function (event) {
                        base64Files.push({
                            name: file.name,
                            type: file.type,
                            size: file.size,
                            data: event.target.result
                        });

                        // 当所有文件都被读取完毕后，发送消息
                        if (base64Files.length === files.length) {
                            chrome.runtime.sendMessage({
                                uploadMessage: {
                                    data: base64Files,
                                    uploadMode: "dragUpload",
                                    type: "files",
                                }
                            });
                        }
                    };
                    reader.readAsDataURL(file);
                    fileReaders.push(reader);
                }
            }
        }
    }

    /**
     * 动态注入 CSS 和 JS 文件到页面
     * @param {string[]} cssPaths - CSS 文件路径数组
     * @param {string[]} jsPaths - JS 文件路径数组
     */
    function injectResources(cssPaths, jsPaths) {
        // 注入 CSS 文件
        cssPaths.forEach(cssPath => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = chrome.runtime.getURL(cssPath);
            document.head.appendChild(link);
        });

        // 注入 JS 文件
        jsPaths.forEach(jsPath => {
            const script = document.createElement('script');
            script.src = chrome.runtime.getURL(jsPath);
            document.body.appendChild(script);
        });
    }
    function handleMessage(request, sender, sendResponse) {
        if (request.diffuseNotification) {
            // diffuseNotification 扩散通知
            const { progressBar } = request.diffuseNotification;


        }
    }
})();