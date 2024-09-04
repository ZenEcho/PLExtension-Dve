import { getChromeStorage } from '@/assets/js/public';

const DEFAULT_SETTINGS = {
	uploadArea: {
		width: 32,
		height: 30,
		location: 34,
		opacity: 0.3,
		closeTime: 2,
		position: "Right"
	},
	uploadFunctionSettings: {
		dragUpload: true,
		autoInsert: true,
		autoCopy: false,
		rightClickUpload: true,
		imageProxy: false,
		editBoxPaste: false
	},
	StickerOptional: 0,
	StickerCodeSelect: "URL",
	StickerURL: "https://plextension-sticker.pnglog.com/sticker.json"
};

const FIREFOX_USER_AGENT = 'Firefox';
const POPUP_URL = 'popup.html';
const OPTIONS_URL = 'options.html';
const ICON_URL = 'icons/logo32.png';

/**
 * 显示通知
 * @param {string} title - 通知的标题
 * @param {string} message - 通知的消息内容
 * @param {function} onClickCallback - 点击通知时的回调函数
 */
function showNotification(title, message, onClickCallback) {
	const notificationTitle = title || chrome.i18n.getMessage("app_name");
	chrome.notifications.create({
		type: 'basic',
		title: notificationTitle,
		message: message,
		iconUrl: ICON_URL
	}, () => { });

	if (onClickCallback) {
		chrome.notifications.onClicked.addListener(onClickCallback);
	}
}

/**
 * 初始化设置
 * 将默认设置存储到本地存储，并创建右键菜单项
 */
function initializeSettings() {
	chrome.storage.local.set(DEFAULT_SETTINGS);
	chrome.contextMenus.create({
		title: chrome.i18n.getMessage("Right_click_menu_upload_prompt"),
		contexts: ["image"],
		id: "upload_imagea"
	});
}

/**
 * 处理扩展安装事件
 * 设置浏览器打开方式，初始化设置，并显示安装完成通知
 */
function handleInstall() {
	const browserOpenWith = 1;
	chrome.storage.local.set({ 'browser_Open_with': browserOpenWith }, () => {
		chrome.action.create({ popup: POPUP_URL });
		console.log(chrome.i18n.getMessage("Installing_initialization"));
	});

	const currentVersion = chrome.runtime.getManifest().version;
	chrome.storage.local.set({ extensionVersion: currentVersion });

	initializeSettings();

	chrome.storage.local.get(["browser_Open_with"], () => {
		showNotification(null, chrome.i18n.getMessage("Installing_initialization_completed"), () => {
			chrome.tabs.create({ 'url': OPTIONS_URL });
		});
	});
}

/**
 * 升级设置
 * @param {object} result - 本地存储中的设置对象
 */
function upgradeSettings() {
	chrome.storage.local.get(null, (result) => {
		const keyMappings = {
			FuncDomain: {
				"AutoCopy": "autoCopy",
				"GlobalUpload": "dragUpload",
				"AutoInsert": "autoInsert",
				"Right_click_menu_upload": "rightClickUpload",
				"ImageProxy": "imageProxy",
				"EditPasteUpload": "editBoxPaste"
			},
			uploadArea: {
				"uploadArea_width": "width",
				"uploadArea_height": "height",
				"uploadArea_Location": "location",
				"uploadArea_opacity": "opacity",
				"uploadArea_auto_close_time": "closeTime",
				"uploadArea_Left_or_Right": "position"
			}
		};

		const upgradeDomain = (domain, mappings, newDomain = domain) => {
			if (result[domain]) {
				const updatedDomain = {};
				for (const key in result[domain]) {
					const newKey = mappings[key] || key;
					updatedDomain[newKey] = result[domain][key] === "on" ? true : result[domain][key] === "off" ? false : result[domain][key];
				}
				chrome.storage.local.set({ [newDomain]: updatedDomain }, () => {
					console.log(`${newDomain} 设置已升级:`, updatedDomain);
				});
			}
		};

		// 升级旧版本的 FuncDomain 为新版本的 uploadFunctionSettings
		upgradeDomain("FuncDomain", keyMappings.FuncDomain, "uploadFunctionSettings");

		// 升级 uploadArea
		upgradeDomain("uploadArea", keyMappings.uploadArea);
	});
}

/**
 * 处理扩展更新事件
 * 检查并记录扩展版本更新
 */
function handleUpdate() {
	console.log("程序函数被调用...");

	chrome.storage.local.get(['extensionVersion'], (result) => {
		const previousVersion = result.extensionVersion;
		const currentVersion = chrome.runtime.getManifest().version;
		if (previousVersion !== currentVersion) {
			console.log("升级..");
			upgradeSettings();
		}
	});
}

/**
 * 处理扩展图标点击事件
 * 根据设置打开相应的页面
 */
function handleActionClick() {
	chrome.storage.local.get(["browser_Open_with"], (result) => {
		const browserOpenWith = result.browser_Open_with || 1;
		chrome.storage.local.set({ 'browser_Open_with': browserOpenWith });

		const openActions = {
			1: () => chrome.tabs.create({ 'url': POPUP_URL }),
			2: () => chrome.windows.create({
				type: "popup",
				url: POPUP_URL,
				width: 1200,
				height: 750
			}),
			3: () => chrome.action.setPopup({ popup: POPUP_URL }),
			default: () => chrome.tabs.create({ 'url': POPUP_URL })
		};

		(openActions[browserOpenWith] || openActions.default)();
	});
}

/**
 * 创建右键菜单项
 */
function createContextMenu() {
	chrome.storage.local.get(["uploadFunctionSettings"], (result) => {
		if (result.uploadFunctionSettings && result.uploadFunctionSettings.rightClickUpload) {
			chrome.contextMenus.create({
				title: chrome.i18n.getMessage("Right_click_menu_upload_prompt"),
				contexts: ["image"],
				id: "upload_imagea"
			}, () => {
				if (chrome.runtime.lastError) {
					console.log("Menu item created successfully.");
				}
			});
		} else {
			chrome.contextMenus.removeAll(() => {
				if (chrome.runtime.lastError) {
					console.log("Failed to remove menu items.");
				} else {
					console.log("Menu items removed successfully.");
				}
			});
		}
	});
}

/**
 * 处理右键菜单点击事件
 * @param {object} info - 右键菜单点击信息
 */
function handleContextMenuClick(info) {
	if (info.menuItemId === "upload_imagea") {
		const imgUrl = info.srcUrl;
		fetchImageBlob(imgUrl)
			.then(blob => {
				fetchUpload(imgUrl, blob)
			})

	}
}

/**
 * 处理消息事件
 * @param {object} request - 请求对象
 * @param {object} sender - 发送者对象
 * @param {function} sendResponse - 响应回调函数
 */
function handleMessage(request, sender, sendResponse) {
	if (request.action === "getStorage") {
		getChromeStorage().then(storage => {
			sendResponse(storage);
		});
		return true;  // 表示将异步发送响应
	}
	if (request.uploadMessage) {
		// 收到上传信息
		const { data, uploadMode, type } = request.uploadMessage;
		if (type == "link") {
			fetchImageBlob(data)
				.then(blob => {
					fetchUpload(data, blob)
				})
		} else {
			let base64Files = data
			let files = base64Files.map(base64File => {
				let byteString = atob(base64File.data.split(',')[1]);
				let mimeString = base64File.data.split(',')[0].split(':')[1].split(';')[0];
				let ab = new ArrayBuffer(byteString.length);
				let ia = new Uint8Array(ab);
				for (let i = 0; i < byteString.length; i++) {
					ia[i] = byteString.charCodeAt(i);
				}
				return { blob: new Blob([ab], { type: mimeString }), name: base64File.name, type: base64File.type };
			});
			// 调用逐个上传函数
			uploadFilesSequentially(files);
		}
	}
}
async function uploadFilesSequentially(files) {
	for (let file of files) {
		try {
			await fetchUpload(file.name, file.blob);
		} catch (error) {
			console.error("Error uploading file:", error);
		}
	}
}
async function fetchUpload(imgUrl, blob, uploadMode = "", callback = () => { }) {
	const d = new Date();
	const storage = await getChromeStorage();
	const { ProgramConfiguration } = storage;

	// 设置 CORS 代理
	const corsProxy = ProgramConfiguration.CorsProxyState ? ProgramConfiguration.CorsProxy : "";

	// 显示上传提示通知
	showNotification(null, chrome.i18n.getMessage("Upload_prompt1"));

	// 获取图片文件扩展名
	const imageExtension = getImageFileExtension(imgUrl, blob);
	const fileName = `${ProgramConfiguration.Program}_${uploadMode}_${d.getTime()}.${imageExtension}`;
	const file = new File([blob], fileName, { type: `image/${imageExtension}` });

	// 构建表单数据
	const formData = new FormData();
	let optionsUrl, optionHeaders = {};

	switch (ProgramConfiguration.Program) {
		case 'Lsky':
			optionsUrl = `${corsProxy}https://${ProgramConfiguration.Host}/api/v1/upload`;
			optionHeaders = { "Authorization": ProgramConfiguration.Token };
			formData.append('file', file);
			if (ProgramConfiguration.Source) formData.append("strategy_id", ProgramConfiguration.Source);
			if (ProgramConfiguration.Album_id) formData.append("album_id", ProgramConfiguration.Album_id);
			formData.append("permission", ProgramConfiguration.Permission);
			break;
		case 'EasyImages':
			optionsUrl = `${corsProxy}https://${ProgramConfiguration.Host}/api/index.php`;
			formData.append('image', file);
			formData.append('token', ProgramConfiguration.Token);
			break;
		case 'ImgURL':
			optionsUrl = `${corsProxy}https://${ProgramConfiguration.Host}/api/v2/upload`;
			formData.append('uid', ProgramConfiguration.Uid);
			formData.append('token', ProgramConfiguration.Token);
			formData.append('file', file);
			break;
		case 'SM_MS':
			optionsUrl = `${corsProxy}https://${ProgramConfiguration.Host}/api/v2/upload`;
			optionHeaders = { "Authorization": ProgramConfiguration.Token };
			formData.append('smfile', file);
			break;
		case 'Chevereto':
			optionsUrl = `${corsProxy}https://${ProgramConfiguration.Host}/api/1/upload/?key=${ProgramConfiguration.Token}`;
			optionHeaders = { "Authorization": ProgramConfiguration.Token };
			formData.append('source', file);
			if (ProgramConfiguration.Expiration !== "NODEL") formData.append("expiration", ProgramConfiguration.Expiration);
			if (ProgramConfiguration.Album_id) formData.append("album_id", ProgramConfiguration.Album_id);
			if (ProgramConfiguration.Nsfw) formData.append("nsfw", ProgramConfiguration.Nsfw);
			break;
		case 'Hellohao':
			optionsUrl = `${corsProxy}https://${ProgramConfiguration.Host}/api/uploadbytoken/`;
			formData.append('file', file);
			formData.append('token', ProgramConfiguration.Token);
			formData.append('source', ProgramConfiguration.Source);
			break;
		case 'Imgur':
			optionsUrl = `${corsProxy}https://${ProgramConfiguration.Host}/3/upload`;
			optionHeaders = { "Authorization": `Client-ID ${ProgramConfiguration.Token}` };
			formData.append("image", file);
			break;
		case 'Telegra_ph':
			optionsUrl = `${corsProxy}https://${ProgramConfiguration.Host}/upload`;
			optionHeaders = { "Accept": "application/json" };
			formData.append("file", file);
			break;
		case 'imgdd':
			optionsUrl = `${corsProxy}https://${ProgramConfiguration.Host}/api/v1/upload`;
			optionHeaders = { "Accept": "application/json", "User-Agent": "PLExtension" };
			formData.append("image", file);
			break;
		case 'BaiJiaHaoBed':
			optionsUrl = `${corsProxy}https://baijiahao.baidu.com/pcui/picture/upload`;
			optionHeaders = { "Accept": "application/json" };
			formData.append("media", file);
			formData.append("type", "image");
			break;
		case 'freebufBed':
			optionsUrl = `${corsProxy}https://www.freebuf.com/fapi/frontend/upload/image`;
			optionHeaders = {
				"Accept": "application/json, text/plain, */*",
				"Referer": "https://www.freebuf.com/write",
				"User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
			};
			formData.append("file", file);
			break;
		case 'toutiaoBed':
			const randomAid = Math.floor(Math.random() * 24) + 1;
			optionsUrl = `${corsProxy}https://i.snssdk.com/feedback/image/v1/upload/?appkey=toutiao_web-web&aid=${randomAid}&app_name=toutiao_web`;
			optionHeaders = {
				"Accept": "application/json, text/plain, */*",
				"Referer": "https://helpdesk.bytedance.com/",
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 Edg/117.0.2045.31"
			};
			formData.append("image", file);
			formData.append("app_id", randomAid);
			break;
		default:
			throw new Error("Unsupported program configuration");
	}

	try {
		const response = await fetch(optionsUrl, {
			method: 'POST',
			body: formData,
			headers: optionHeaders
		});
		const res = await response.json();
		let imageUrl;

		switch (ProgramConfiguration.Program) {
			case 'Lsky':
				imageUrl = res.data.links.url;
				break;
			case 'EasyImages':
				imageUrl = res.url;
				break;
			case 'ImgURL':
				imageUrl = res.data.url;
				break;
			case 'SM_MS':
				imageUrl = res.code === "image_repeated" ? res.images : res.data.url;
				break;
			case 'Chevereto':
				imageUrl = res.image.url;
				break;
			case 'Hellohao':
				imageUrl = res.data.url;
				break;
			case 'Imgur':
				imageUrl = res.data.link;
				break;
			case 'Telegra_ph':
				if (res.error) {
					showNotification(null, res.error);
					return;
				}
				imageUrl = `https://telegra.ph${res[0].src}`;
				break;
			case 'imgdd':
				imageUrl = res.url;
				break;
			case 'BaiJiaHaoBed':
				imageUrl = res.ret.https_url;
				break;
			case 'freebufBed':
				imageUrl = res.data.url.replace(/\\/g, "").replace('!small', '');
				break;
			default:
				throw new Error("Unsupported program configuration");
		}

		console.log(imageUrl);
		callback(imageUrl);
	} catch (error) {
		console.error(error);
		callback(null, new Error(chrome.i18n.getMessage("Upload_prompt3")));
		showNotification(null, `${chrome.i18n.getMessage("Upload_prompt4")}${error.toString()}`);
	}
}

/**
 * 获取图片文件扩展名
 * @param {string} imgUrl - 图片 URL
 * @param {Blob} file - 图片文件 Blob
 * @returns {string} - 图片文件扩展名
 */
function getImageFileExtension(imgUrl, file) {
	const validExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'webp', 'svg', 'ico', 'apng', 'jng'];
	let extension;

	if (imgUrl) {
		const urlParts = imgUrl.split(".");
		if (urlParts.length > 1) {
			const fileType = urlParts.pop().toLowerCase();
			const candidateExtension = fileType.split(";")[0].split("/").pop();
			if (validExtensions.includes(candidateExtension)) {
				extension = candidateExtension;
				console.log("url:", extension);
				return extension;
			}
		}
	}

	if (!validExtensions.includes(extension) && file.type) {
		const fileTypeParts = file.type.split("/");
		if (fileTypeParts.length > 1) {
			extension = fileTypeParts.pop().toLowerCase();
			console.log("file:", extension);
			return extension;
		}
	}
	return "png";
}
async function fetchImageBlob(url) {
	const { CorsProxyState, CorsProxy = "" } = await getChromeStorage("ProgramConfiguration") || {};
	const finalUrl = CorsProxyState ? `${CorsProxy}${url}` : url;
	return await fetch(finalUrl)
		.then(response => response.blob())
		.catch(error => {
			console.error(error);
			throw new Error('Failed to fetch image blob');
		});
}


// 监听扩展安装和更新事件
chrome.runtime.onInstalled.addListener((details) => {
	if (details.reason === "install") {
		handleInstall();
	} else if (details.reason === 'update') {
		handleUpdate();
	}
});

// 监听扩展图标点击事件
chrome.action.onClicked.addListener(handleActionClick);

// 创建右键菜单项
createContextMenu();

// 监听右键菜单点击事件
chrome.contextMenus.onClicked.addListener(handleContextMenuClick);

// 监听消息事件
chrome.runtime.onMessage.addListener(handleMessage);
