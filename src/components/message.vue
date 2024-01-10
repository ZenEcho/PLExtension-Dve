<template></template>
  
<script setup>
import { useMessage } from 'naive-ui';
const messageInstance = useMessage();
function showMessage({ message, type }) {
  if (typeof messageInstance[type] === 'function') {
    messageInstance[type](message);
  } else {
    messageInstance.info(message);
  }
}

defineExpose({ showMessage });
</script>