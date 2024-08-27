<template>
  <n-notification-provider :placement='"bottom-right"'>

    <main class="dark:bg-gray-200 min-w-[640px] min-h-svh">
      <Navbar />
      <div class="flex flex-row">
        <Sidebar class="sticky h-full max-sm:hidden top-[80px] sidebar " @foundData="handleFoundData"
          @addButton="onShowModal" ref="sidebarRef"></Sidebar>
        <div
          class="fixed flex w-7 top-1/2 hover:text-gray-700/50 max-sm:left-0 text-gray-500 dark:text-gray-700 max-sm:hidden"
          @click="toggleSidebar($event)" :class="hiddenSidebar ? 'left-0' : 'left-44'">
          <svg v-if="!hiddenSidebar" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 7l-5 5l5 5"></path>
              <path d="M17 7l-5 5l5 5"></path>
            </g>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M7 7l5 5l-5 5"></path>
              <path d="M13 7l5 5l-5 5"></path>
            </g>
          </svg>
        </div>
        <div class="w-full  bg-gray-100"
          :class="hiddenSidebar ? 'h-[calc(100vh-65px)] overflow-auto' : 'overflow-hidden'">
          <SiteTitle />
          <div class="w-full px-3 flex flex-row max-lg:flex-col">

            <BedForm class="min-w-[400px]  w-full h-full shadow-xl  border rounded-lg bg-gray-50 p-2 dark:bg-gray-100"
              :form-groups="formGroups" @submit-success="handleBedFormSubmit" />
            <n-dialog-provider>
              <n-message-provider>
                <ConfigRecord
                  class="max-lg:my-3 min-w-96 h-full lg:ml-2 p-2 border rounded-lg bg-gray-50 shadow-xl dark:bg-gray-100"
                  ref="configRecordRef">
                </ConfigRecord>
              </n-message-provider>
            </n-dialog-provider>

          </div>
        </div>
      </div>
      <n-message-provider>
        <Messagetag ref="messageRef" />
      </n-message-provider>

      <n-modal v-model:show="showModal" @addButton="onShowModal" class="dark:bg-gray-100">
        <ButtomModal class="w-5/6 min-w-[500px] min-h-96 " :bordered="false" size="huge" role="dialog" aria-modal="true"
          @close="showModal = false" closable> </ButtomModal>
      </n-modal>
    </main>

  </n-notification-provider>
</template>
<script setup>
import Navbar from '@/components/header.vue'
import SiteTitle from '@/components/siteTitle.vue';
import BedForm from '@/components/bedForm.vue'
import ConfigRecord from '@/components/configRecord.vue'
import Sidebar from './sidebar.vue'
import Messagetag from '@/components/message.vue';
import ButtomModal from '@/components/buttomModal.vue';
import { ref, provide } from 'vue';
const hiddenSidebar = ref('');
const formGroups = ref('');
const messageRef = ref(null);
const showModal = ref(false);
const configRecordRef = ref(null);
const sidebarRef = ref(null);


function handleFoundData(data) {
  if (data) {
    formGroups.value = data;
  } else {
    formGroups.value = false
  }

}
function onShowModal(data) {
  if (data.type == "addButton") {
    showModal.value = data.state;
    if (data.state == false) {
      sidebarRef.value.readbedButton()
    }
  }

}

const handleBedFormSubmit = () => {
  if (configRecordRef.value) {
    configRecordRef.value.readBedConfig();
  }
};

function toggleSidebar(event) {
  const sidebar = event.currentTarget.parentNode.querySelector(".sidebar");
  sidebar.classList.toggle("hidden");
  hiddenSidebar.value = sidebar.classList.contains("hidden");
}
function showMessage(message) {
  if (messageRef.value) {
    messageRef.value.showMessage(message);
  }
}
provide('showMessage', showMessage);
provide('onShowModal', onShowModal);
</script>
<style scoped>
.height {
  height: calc(100vh - 65px);
}
</style>