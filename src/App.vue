
<template>
  <main>
    <superclass class="p-all-5" />
  </main>
</template>
<script setup>
import superclass from "./components/superclass.vue";
console.log('3月19日更新')
</script>

<style>
@import "@/assets/superStyle/superCss.css";
@import "@/assets/superStyle/selfCss.css";
.arco-picker-range-wrapper {
  display: flex;
  flex-direction: column;
}
/* 在屏幕宽度小于等于500px时应用以下样式 */
@media (max-width: 500px) {
  .arco-picker-range-wrapper {
    flex-direction: column;
  }
}

/* 在屏幕宽度大于500px时应用以下样式 */
@media (min-width: 501px) {
  .arco-picker-range-wrapper {
    flex-direction: row;
  }
}

h4 {
  font-size: calc(1.275rem + 0.3vw);
  margin-bottom: 1rem;
}
code {
  font-size: 0.875em;
  color: #d63384;
  word-wrap: break-word;
}
</style>
