<template>
  <form @submit.prevent="handleSubmit">
    <div v-for="item in formData.element" :key="item.label.id">
      <div v-if="item.input && item.label" class="w-full flex flex-col mb-3">
        <label v-html="item.label.text" class="flex items-center text-lg bg-white"></label>
        <input :id="item.input.id" :required="item.input.required" :type="item.input.type"
          class="px-2 h-8 ${inputClass} border focus-visible:border-blue-400 focus-visible:outline-none" />
      </div>

      <div v-if="item.select && item.label" class="w-full flex flex-col mb-3">
        <label v-html="item.label.text" class="flex items-center text-lg bg-white"> </label>
        <select :id="item.select.id" class="px-2 h-8 border">
          <option v-for="option in item.select.optionTag" :key="option.value" :value="option.value"
            :selected="option.Selected">
            {{ option.text }}
          </option>
        </select>

      </div>

      <div v-if="item.textarea && item.label" class="w-full flex flex-col mb-3">
        <label v-html="item.label.text" class="flex items-center text-lg bg-white"> </label>
        <textarea></textarea>
      </div>

      <div v-if="item.additionalElement">
        <div v-for="(item, index) in item.additionalElement" :key="index" v-html="item"></div>
      </div>

    </div>
    <div class="flex justify-center py-4" v-if="formHtml">
      <button class="text-white bg-green-600 p-2 px-4 w-9/12 active:bg-green-700" type="submit">保存 /
        启动</button>
    </div>
  </form>
</template>

<script setup>
import { defineProps, watchEffect, ref } from "vue";
const props = defineProps({
  formGroups: Object
});
let formData = []
watchEffect(() => {
  if (props.formGroups) {
    formData = props.formGroups
    console.log(formData);
  }
});


</script>