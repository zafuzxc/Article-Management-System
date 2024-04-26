<template>
  <el-select :style="{ width }" :modelValue="modelValue" @update:modelValue="emit('update:modelValue', $event)">
    <el-option v-for="item in channel" :key="item.id" :label="item.cate_name" :value="item.id"></el-option>
  </el-select>
</template>

<script setup>
import { getArticleService } from '@/api/article'
import { ref } from 'vue'

defineProps({
  modelValue: {
    type: [String, Number]
  },
  width: {
    type: String
  }
})
const emit = defineEmits(['update:modelValue'])
const channel = ref([])
const getArticleList = async () => {
  const res = await getArticleService()
  channel.value = res.data.data
}
getArticleList()
</script>
