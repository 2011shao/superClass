<template>
  <div>
    <SetView></SetView>
  </div>
</template>
 <script setup>
import dayjs from "dayjs";
import SetView from "./set.vue";
import { computed, nextTick, ref } from "vue";
import {manArr,dataArr,nodeDic} from "./common"


</script>
<style scoped>
.labelText {
  width: 130px;
  flex-shrink: 0;
}
</style>
            
