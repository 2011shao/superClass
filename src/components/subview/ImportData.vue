
<template>
  <div>
    <!-- <a-typography-text
      >点击→
      <a-typography-text type="primary" @click="helpVoid">
        查看教程
      </a-typography-text>
    </a-typography-text> -->
    <a-spin :loading="loading" style="width: 100%">
      <div class="grid-one p-all-1 grid-gap-5">
        <div class="row-start-center">
          <a-typography-text class="flex-shrink labelCss">
            姓名
          </a-typography-text>
          <a-select
            allow-clear
            v-model="name_filed"
            placeholder="选择姓名"
            :options="nameOption"
            :field-names="{ value: 'id', label: 'name' }"
          ></a-select>
        </div>
        <div class="row-start-center">
          <a-typography-text class="flex-shrink labelCss">
            性别
          </a-typography-text>
          <a-select
            allow-clear
            v-model="sex_filed"
            placeholder="选择性别"
            :options="sexOption"
            :field-names="{ value: 'id', label: 'name' }"
          ></a-select>
        </div>

        <a-progress v-if="buttonLoading" :percent="progress" />
      </div>

      <a-affix :offsetBottom="40" >
        <div class="row-between-center m-r-10">
          <a-typography-text class="m-t-15 d-block m-l-5"
            >姓名相同时会去重</a-typography-text
          >
          <a-button type="primary" @click="exportVoid">下一步</a-button>
        </div>
      </a-affix>
    </a-spin>
  </div>
</template>

<script setup >
import { bitable, FieldType } from "@lark-base-open/js-sdk";
import { ref, onMounted, computed, watch, onUnmounted } from "vue";
import { Message } from "@arco-design/web-vue";
import { cloneDeep, parseInt } from "lodash";
import {
  classArr,
  manArr,
  maxLxWorkNum,
  maxWorkNum,
  freeNum,
  switchTabIndex,
} from "../common";

const buttonLoading = ref(false);
const loading = ref(false);
const fieldList = ref([]);
const name_filed = ref("");
const sex_filed = ref("");
const progress = ref(0);
const nameOption = computed(() =>
  fieldList.value.filter((a) => [1, 11].includes(a.type))
);
const sexOption = computed(() =>
  fieldList.value.filter((a) => a.type == 3 || a.type == 1)
);
let table = "";
let imgWorker = "";
onMounted(async () => {
  initBaeData();
  watchSwitchTable();
});
async function watchSwitchTable() {
  bitable.base.onSelectionChange((event) => {
    initBaeData();
  });
}
async function initBaeData() {
  loading.value = true;
  table = await bitable.base.getActiveTable();
  getAllField(true);
}
async function getAllField(loadCache = false) {
  loading.value = true;
  const fieldMetaList = await table.getFieldMetaList();
  console.log("ddd", fieldMetaList);
  fieldList.value = fieldMetaList;
  if (!name_filed.value) {
    for (let item of fieldMetaList) {
      if (item.type == 11 || ["姓名", "名字"].includes(item.name)) {
        name_filed.value = item.id;
      }
      if (item.type == 3 || "性别" == item.name) {
        sex_filed.value = item.id;
      }
    }
  }
  loading.value = false;
}

// 导出word
async function exportVoid() {
  progress.value = 0;
  buttonLoading.value = true;
  loading.value = true;
  const recordList = await table.getRecordList();
  const view = await table.getActiveView();
  const recordIdList = await view.getVisibleRecordIdList();
  let newDataArr = [];
  let i = 0;
  for (const record of recordList) {
    if (!recordIdList.includes(record.id)) {
      continue;
    }
    const nameDic = await getCellValue(record, name_filed.value);
    const sex = await getCellValue(record, sex_filed.value);
    debugger;
    if (nameDic) {
      const nameFileDic = fieldList.value.find(
        (a) => a["id"] == name_filed.value
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
  console.log("对对对", newDataArr);
  buttonLoading.value = false;
  loading.value = false;
  switchTabIndex(3);
}

async function getCellValue(record, filedId) {
  if (!filedId) {
    return "";
  }
  let valueStr = "";
  const cell = await record.getCellByField(filedId);
  const value = cell.val;
  const filedType = fieldList.value.find((a) => a["id"] == filedId);
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
