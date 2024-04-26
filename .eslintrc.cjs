/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/eslint-config-prettier/skip-formatting'],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    /**关注代码美观度 */
    //需要禁用vscode插件： perttier 以及 format on save
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true, //单引号
        semi: false, //无分号
        printWidth: 150, //每行至多80个字符
        trailingComma: 'none', //不加 对象、数字 最后逗号
        endOfLine: 'auto' //换行符号不限制
      }
    ],
    /**Eslint关注规范 */
    'vue/multi-word-component-names': [
      'warn',
      {
        ignores: ['index'] //vue组件名称多单词组成 忽略index.vue
      }
    ],
    'vue/no-setup-props-destructure': ['off'], //关闭props解构的校验（props解构丢失响应式）
    'no-undef': 'error' //添加未定义变量错误提示  off
  },
  globals: {
    ElMessage: 'readonly',
    ElMessageBox: 'readonly',
    ElLoading: 'readonly'
  }
}
