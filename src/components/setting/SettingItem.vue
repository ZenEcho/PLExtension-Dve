<template>
	<div class="flex flex-row justify-between items-center">
		<span class="text-base font-medium">{{ item.label }}</span>
		<component :is="getComponentType(item)" v-model:value="item.model" :options="item.options"
			@click="handleAction(item.action)" @update:value="handleUpdate(item, $event)" class="max-w-[200px]">
			{{ item.buttonText }}
		</component>
	</div>
	<SetSidebarModal v-if="showSidebarModal" @close="closeSidebarModal" :uploadAreaData="uploadAreaData" />
</template>

<script setup>
import { ref, defineProps, inject } from 'vue';
import { NSwitch, NSelect, NButton } from 'naive-ui';
import { getChromeStorage } from '@/assets/js/public';
import SetSidebarModal from './setSidebar/setSidebar.vue';

const toggleDarkMode = inject('toggleDarkMode');

const props = defineProps({
	item: Object,
	ChromeStorageData: Object,
});

const showSidebarModal = ref(false);
const uploadAreaData = ref(null);

const getComponentType = (item) => {
	switch (item.type) {
		case 'switch':
			return NSwitch;
		case 'select':
			return NSelect;
		case 'button':
			return NButton;
		default:
			return 'div';
	}
};

const handleAction = (action) => {
	if (action === 'setSidebar') {
		showSidebarModal.value = true;
		getChromeStorage().then((result) => {
			uploadAreaData.value = result.uploadArea;
		});
	}
};

const handleUpdate = (item, value) => {
	console.log(`${item.type.charAt(0).toUpperCase() + item.type.slice(1)} "${item.label}" value updated:`, value);
	performAction(item.value, value);
};

const performAction = (value, newValue) => {
	const actions = {
		theme: () => {
			localStorage.setItem('darkMode', newValue.toString());
			toggleDarkMode();
		},
		openInTab: () => {
			console.log('Open in tab selected:', newValue);
			chrome.storage.local.set({ 'browser_Open_with': newValue }, () => {
				chrome.runtime.reload();
			});
		},
		autoCopy: () => saveUploadFunctionSettings(value, newValue),
		dragUpload: () => saveUploadFunctionSettings(value, newValue),
		rightClickUpload: () => {
			saveUploadFunctionSettings(value, newValue)
			if (newValue) {
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
		},
		setSidebar: () => showSidebarModal.value = true,
		imageProxy: () => console.log('Image proxy selected:', newValue),
		autoInsert: () => console.log('Image autoInsert selected:', newValue),
		editBoxPaste: () => saveUploadFunctionSettings(value, newValue),
		default: () => { },
	};

	(actions[value] || actions.default)();
};

const saveUploadFunctionSettings = async (value, newValue) => {
	try {
		const result = await getChromeStorage();
		result.uploadFunctionSettings[value] = newValue;
		await chrome.storage.local.set({ 'uploadFunctionSettings': result.uploadFunctionSettings });
		console.log('uploadFunctionSettings saved:', result.uploadFunctionSettings);
	} catch (error) {
		console.error('Error saving uploadFunctionSettings:', error);
	}
};

const closeSidebarModal = () => {
	showSidebarModal.value = false;
};
</script>