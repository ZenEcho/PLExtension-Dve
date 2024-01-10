<template></template>
  
<script setup>
import { useNotification } from 'naive-ui';
const messageInstance = useNotification();
function showNotification(type, message) {
    if (typeof messageInstance[type] === 'function') {
        messageInstance[type](message);
    } else {
        messageInstance.info(message);
    }
}

defineExpose({ showNotification });
</script>