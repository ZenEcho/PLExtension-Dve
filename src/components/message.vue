<template></template>
  
<script setup>
import { useMessage } from 'naive-ui';
const messageInstance = useMessage();
function showMessage({ message, type, props }) {
  if (typeof messageInstance[type] === 'function') {
    messageInstance[type](message, props);
  } else {
    messageInstance.info(message, props);
  }
}

defineExpose({ showMessage });
</script>