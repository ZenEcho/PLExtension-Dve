<template>
  <n-notification-provider :placement='"bottom-right"'>

    <main class="dark:bg-neutral-100 overflow-x-hidden min-h-[500px] min-w-[500px] bg-neutral-50">
      <div class="flex flex-row h-screen">
        <SideNavigation @foundData="handleFoundData" @addButton="onShowModal" ref="sideNavRef" :isOpenMenu="isOpenMenu"
          @update:isOpenMenu="refresh" />
        <div class="px-2 flex flex-row w-full overflow-auto">
          <div class="w-full ">
            <SiteTitle />
            <div class="w-full flex flex-row max-lg:flex-col">

              <BedForm class="lg:w-full p-2 h-full shadow-xl rounded-lg bg-gray-50  dark:bg-gray-100"
                :form-groups="formGroups" @submit-success="handleBedFormSubmit" />
              <n-dialog-provider>
                <n-message-provider>
                  <ConfigRecord
                    class="max-lg:my-3 min-w-96 h-full lg:ml-2 p-2 shadow-xl rounded-lg bg-gray-50 dark:bg-gray-100"
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
import Messagetag from '@/components/message.vue';
import ButtomModal from '@/components/buttomModal.vue';
import { ref, provide, onMounted } from 'vue';
const formGroups = ref('');
const messageRef = ref(null);
const showModal = ref(false);
const configRecordRef = ref(null);
const sideNavRef = ref(null);
const isOpenMenu = ref(false);
onMounted(() => {
  isOpenMenu.value = true
})
function handleFoundData(data) {
  if (data) {
    formGroups.value = data;
  } else {
    formGroups.value = false
  }

}
// 孙组件刷新
const refresh = () => {
  sideNavRef.value.$refs.newSidebarRef[0].readbedButton(); //孙组件的方法
}

//显示安装弹窗
function onShowModal(data) {
  if (data.type == "addButton") {
    showModal.value = data.state;
    if (data.state == false) {
      // sideNavRef.value.readbedButton() 子组件的方法
      refresh()
    }
  }

}

const handleBedFormSubmit = () => {
  if (configRecordRef.value) {
    configRecordRef.value.readBedConfig();
  }
};

function showMessage(message) {
  if (messageRef.value) {
    messageRef.value.showMessage(message);
  }
}
provide('showMessage', showMessage);
provide('onShowModal', onShowModal);
</script>
