<template>
  <n-notification-provider :placement='"bottom-right"'>

    <main class="dark:bg-gray-200 min-w-[640px] min-h-svh">
      <div class="flex flex-row">
        <SideNavigation @foundData="handleFoundData" @addButton="onShowModal" ref="sidebarRef" />
        <div class="flex flex-row">
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
import SideNavigation from '@/components/header/SideNavigation.vue';
import SiteTitle from '@/components/siteTitle.vue';
import BedForm from '@/components/bedForm.vue'
import ConfigRecord from '@/components/configRecord.vue'
import Sidebar from './sidebar.vue'
import NewSidebar from './NewSidebar.vue'
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