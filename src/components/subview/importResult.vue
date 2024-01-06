<template>
  <div>
    <div class="grid-one p-all-1 grid-gap-5">
      <div class="row-start-center">
        <a-typography-text>日期-></a-typography-text>
        <SelectField
          title="日期"
          v-model="bit_import_dic.date"
          :typeNumArr="[1, 11]"
          :preSetArr="['日期']"
          :allFieldDic="bit_import_dic"
        ></SelectField>
      </div>
      <div
        class="row-start-center"
        v-for="(item, index) in classArr"
        :key="index"
      >
        <a-typography-text>{{ item.name }}-></a-typography-text>
        <SelectField
          :title="item.name"
          v-model="bit_import_dic[item['field']]"
          :typeNumArr="[1, 11]"
          :preSetArr="[item['name']]"
          :allFieldDic="bit_import_dic"
        ></SelectField>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";
import { classArr, dataArr, computedWork, middleArr } from "../common";
import SelectField from "../SelectField.vue";
const showTable = ref(1);
const bit_import_dic = ref({date:''});
onMounted(() => {
  for (let item of classArr.value) {
    bit_import_dic.value[item.field] = "";
  }
});
function fixToBitData(){
for(let item of dataArr.value)
{



}





}
</script>
<style scoped>
.labelText {
  width: 100px;
  flex-shrink: 0;
}
</style>
                                    
                        