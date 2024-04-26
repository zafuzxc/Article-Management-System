<template>
  <el-drawer v-model="visibleDrawer" :title="formModel.id ? '编辑文章' : '添加文章'" direction="rtl" size="50%">
    <!-- 发表文章表单 -->
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <channel-select v-model="formModel.cate_id" width="100%"></channel-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <!-- 此处需要关闭element-plus的自动上传，只需要做前端的本地预览图片即可，无需在提交前上传图片
        URL.createObjectURL() 创建本地预览的地址，来预览 -->
        <el-upload class="avatar-uploader" :show-file-list="false" :on-change="onSelectFile" :auto-upload="false">
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <quill-editor ref="editorRef" v-model:content="formModel.content" content-type="html" theme="snow"></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="onPublish('已发布')" type="primary">发布</el-button>
        <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import ChannelSelect from './ChannelSelect.vue'
import { QuillEditor } from '@vueup/vue-quill'
import { publishArticleService, getDetailService, editDetailService } from '@/api/article'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { ElMessage } from 'element-plus'
import { baseURL } from '@/utils/request'
import axios from 'axios'
// 默认数据
const defaultForm = {
  title: '', // 标题
  cate_id: '', // 分类id
  cover_img: '', // 封面图片 file 对象
  content: '', // string 内容
  state: '' // 状态
}

// 准备数据
const formModel = ref({ ...defaultForm })
//图片上传相关逻辑
const imageUrl = ref('')

const onSelectFile = (uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw) //预览图片
  formModel.value.cover_img = uploadFile.raw //提交图片
}

const emit = defineEmits(['success'])
const onPublish = async (state) => {
  formModel.value.state = state
  //当前接口需要formdata对象 将对象转换成formdata对象
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }
  //发请求
  if (formModel.value.id) {
    //编辑
    await editDetailService(fd)
    visibleDrawer.value = false
    emit('success', 'edit')
  } else {
    //添加
    // for (let [key, value] of fd.entries()) {
    //   console.log(`${key}: ${value}`)
    // }
    await publishArticleService(fd)
    ElMessage.success('添加成功')
    visibleDrawer.value = false
    //通知父组件，添加成功
    emit('success', 'add')
  }
}

//控制抽屉显示隐藏
const visibleDrawer = ref(false)
const editorRef = ref()
const open = async (row) => {
  visibleDrawer.value = true
  if (row.id) {
    const res = await getDetailService(row.id)
    formModel.value = res.data.data
    //图片需要单独回显
    imageUrl.value = baseURL + formModel.value.cover_img
    const file = await fetchImageAsFile(imageUrl.value)
    formModel.value.cover_img = file
  } else {
    formModel.value = { ...defaultForm }
    imageUrl.value = ''
    editorRef.value.setHTML('')
  }
}

function fetchImageAsFile(imageUrl) {
  return axios({
    method: 'get',
    url: imageUrl,
    responseType: 'blob' // 告诉axios我们想要得到一个blob
  }).then((response) => {
    // 创建一个Blob对象
    const blob = new Blob([response.data], { type: response.headers['content-type'] })

    // 创建一个指向该Blob对象的URL
    // const url = URL.createObjectURL(blob)

    // 创建一个File对象（如果需要的话）
    // 注意：File对象实际上是Blob对象的扩展，因此你也可以直接使用blob
    const file = new File([blob], 'image.jpg', { type: response.headers['content-type'] })

    return file
  })
}

defineExpose({
  open
})
</script>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
