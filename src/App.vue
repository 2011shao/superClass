
<template>
  <main>
    <superclass class="p-all-5" />
  </main>
</template>
<script setup>
import superclass from "./components/superclass.vue";
</script>

<style>
@import "@/assets/superStyle/superCss.css";
@import "@/assets/superStyle/selfCss.css";

main {
  /* padding: 103px; */
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
