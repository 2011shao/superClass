
<template>
  <div>
    <!-- <a-typography-text
      >点击→
      <a-typography-text type="primary" @click="helpVoid">
        查看教程
      </a-typography-text>
    </a-typography-text> -->
    <a-spin :loading="bit_loading" style="width: 100%">
      <div class="grid-one p-all-1 grid-gap-5">
        <SelectField
          title="姓名"
          v-model="bit_import_dic.name_filed"
          :typeNumArr="[1, 11]"
          :preSetArr="['姓名']"
          :allFieldDic="bit_import_dic"
        ></SelectField>
        <SelectField
          title="性别"
          v-model="bit_import_dic.sex_filed"
          :typeNumArr="[1, 3]"
          :preSetArr="['性别']"
          :allFieldDic="bit_import_dic"
        ></SelectField>

        <a-progress v-if="buttonLoading" :percent="progress" />
      </div>

      <a-affix :offsetBottom="40">
        <div class="row-between-center m-r-10 m-t-15">
          <a-typography-text class="d-block m-l-5"
            >姓名相同时会去重</a-typography-text
          >
          <a-button type="primary" @click="exportVoid"
            >下一步 <icon-right />
          </a-button>
        </div>
      </a-affix>
    </a-spin>
  </div>
</template>

<script setup >
import { ref, onMounted, computed, watch, onUnmounted } from "vue";
import { Message } from "@arco-design/web-vue";
import SelectField from "../superView/SelectField.vue";
import { cloneDeep, parseInt } from "lodash";
import {
  classArr,
  manArr,
  maxLxWorkNum,
  maxWorkNum,
  freeNum,
  switchTabIndex,
} from "../js/common";
import {
  initBaeData,
  getAllField,
  bit_all_fieldList,
  bit_loading,
  bit_table,
  import_table_id,
} from "../js/superBase";
const buttonLoading = ref(false);
const progress = ref(0);
const bit_import_dic = ref({
  name_filed: "",
  sex_filed: "",
});

// 导出word
async function exportVoid() {
  if (!bit_import_dic.value.name_filed) {
    Message.info("选择姓名字段");
    return;
  }
  progress.value = 0;
  buttonLoading.value = true;
  bit_loading.value = true;
  const recordList = await bit_table.getRecordList();
  const view = await bit_table.getActiveView();
  const recordIdList = await view.getVisibleRecordIdList();
  let newDataArr = [];
  let i = 0;
  import_table_id.value = bit_table.id; //记录导入人员的表
  for (const record of recordList) {
    if (!recordIdList.includes(record.id)) {
      continue;
    }
    const nameDic = await getCellValue(record, bit_import_dic.value.name_filed);
    const sex = await getCellValue(record, bit_import_dic.value.sex_filed);
    if (nameDic) {
      const nameFileDic = bit_all_fieldList.value.find(
        (a) => a["id"] == bit_import_dic.value.name_filed
      );
      const dic = {
        name: nameFileDic.type == 11 ? nameDic.name : nameDic,
        id: nameFileDic.type == 11 ? nameDic.id : i,
        sex: sex.indexOf("女") >= 0 ? 2 : 1, //1男 2女 3不限制男女
        canWork: true, //是否参见工作
        freeNum: freeNum.value,
        maxLxWorkNum: maxLxWorkNum.value,
        maxWorkNum: maxWorkNum.value,
        workDateArr: [],
        freeDateArr: [],
        jiabanWorkArr: [],
        superWork: true,
        fieldType: nameFileDic.type,
      };
      const czMan = newDataArr.find((e) => e.name == dic.name);
      if (!czMan) {
        newDataArr.push(dic);
      }
    }
    i++;
    progress.value = parseInt(i / recordIdList.length);
  }
  manArr.value = newDataArr;
  buttonLoading.value = false;
  bit_loading.value = false;
  switchTabIndex(3);
}

async function getCellValue(record, filedId) {
  if (!filedId) {
    return "";
  }
  let valueStr = "";
  const cell = await record.getCellByField(filedId);
  const value = cell.val;
  const filedType = bit_all_fieldList.value.find((a) => a["id"] == filedId);
  if (value) {
    if (Array.isArray(value)) {
      if (filedType.type == 11 && value.length > 0) {
        //人员特殊处理 返回字典
        valueStr = value[0];
      } else {
        valueStr = value.map((a) => a["text"]).join("");
      }
    } else if (typeof value == "object") {
      valueStr = value["text"];
    } else {
      valueStr = value;
    }
  }
  return valueStr;
}

const commitCan = computed(() => {
  if (name_filed.value) {
    return true;
  }
  return false;
});
function helpVoid(params) {
  window.open(
    "https://y35xdslz6g.feishu.cn/docx/QB5udpPFgotthpxKRaJcSaTmnOM?from=from_copylink",
    "_blank"
  );
}
</script>
<style>
.labelCss {
  width: 70px;
  text-align: center;
  flex-shrink: 0;
}
</style>
