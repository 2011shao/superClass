<template>
  <a-spin :loading="loading" style="width: 100%">
    <div class="grid-one p-all-1 grid-gap-5">
      <SelectTableView
        title="选择表"
        v-model="bit_select_dic.tableId"
        canAdd
      ></SelectTableView>
      <SelectFieldView
        title="日期"
        v-model="bit_import_dic.date"
        :typeNumArr="[1, 11]"
        :preSetArr="['日期']"
        :allFieldDic="bit_import_dic"
        canAdd
      ></SelectFieldView>

      <SelectFieldView
        v-for="(item, index) in classArr"
        :key="index"
        :title="item.node"
        v-model="bit_import_dic[item['field']]"
        :typeNumArr="[]"
        :preSetArr="[item['node']]"
        :allFieldDic="bit_import_dic"
        :show-extra-options="false"

        canAdd
      ></SelectFieldView>
    </div>
    <div class="row-center-center m-t-10">
      <a-button :disabled="!canImport" type="primary" @click="fixToBitData"
        >开始导入</a-button
      >
    </div>
  </a-spin>
</template>
<script setup>
import { Message } from "@arco-design/web-vue";
import { computed, onMounted, ref } from "vue";
import { classArr, dataArr, computedWork, middleArr } from "../js/common";
import {
  bit_select_dic,
  addBitRecord,
  export_table_id,
  bit_table,
} from "../js/superBase";
import SelectFieldView from "../superView/SelectField.vue";
import SelectTableView from "../superView/selectTable.vue";
const bit_import_dic = ref({ date: "" });
const loading = ref(false);
onMounted(() => {
  for (let item of classArr.value) {
    bit_import_dic.value[item.field] = "";
  }
});
const canImport = computed(
  () =>
    !Object.values(bit_import_dic.value).includes("") &&
    dataArr.value.length > 0
);
async function fixToBitData() {
  if (dataArr.value.length == 0) {
    return Message.info("无可导入的数据");
  }
  loading.value = true;
  export_table_id.value = bit_table.id; //记录导入人员的表

  let fieldNameDic = {
    date: bit_import_dic.value.date,
    ...Object.fromEntries(
      classArr.value.map((item) => [
        item.node,
        bit_import_dic.value[item.field],
      ])
    ),
  };
  let arr = dataArr.value.map((item) => {
    const dic = { fields: {} };
    for (let [key, fieldName] of Object.entries(fieldNameDic)) {
      if (key !== "date") {
        let isManType = false;
        const manList = item[key].map((a) => {
          if (a.fieldType === 11) {
            isManType = true;
            return { id: a.id };
          } else {
            return a.name;
          }
        });
        dic.fields[fieldName] = isManType ? manList : manList.join(",");
      } else {
        dic.fields[fieldName] = item[key];
      }
    }
    return dic;
  });
  await addBitRecord(arr);
  Message.success("导入成功");
  loading.value = false;
}
</script>
<style scoped>
.labelText {
  width: 100px;
  flex-shrink: 0;
}
</style>
                                    
                        