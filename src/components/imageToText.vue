
<template>
  <div>
    <a-typography-text
      >点击→
      <a-typography-text type="primary" @click="helpVoid">
        查看教程
      </a-typography-text>
    </a-typography-text>
    <a-spin :loading="loading" style="width: 100%">
      <div class="grid-one p-all-1 grid-gap-5">
        <a-typography-title :heading="6" style="">
          选择要识别的图片
        </a-typography-title>
        <a-select
          allow-clear
          v-model="origin_filed"
          placeholder="选择图片"
          :options="mediaOption"
          :field-names="{ value: 'id', label: 'name' }"
        ></a-select>
        <div class="row-between-center">
          <a-typography-title :heading="6" class="flex-grow">
            解析后存放字段
          </a-typography-title>
        </div>

        <a-select
          class="flex-grow"
          allow-clear
          v-model="target_filed"
          :options="textOption"
          placeholder="收货人姓名"
          :field-names="{ value: 'id', label: 'name' }"
          @clear="() => (target_dic.name = '')"
        >
        </a-select>
        <a-button
          :loading="buttonLoading"
          :disabled="!commitCan"
          type="primary"
          @click="exportVoid"
          >开始转换</a-button
        >
        <a-progress v-if="buttonLoading" :percent="progress" />
      </div>
    </a-spin>
  </div>
</template>

<script setup >
import { bitable, FieldType } from "@lark-base-open/js-sdk";
import { ref, onMounted, computed, watch, onUnmounted } from "vue";
import { Message } from "@arco-design/web-vue";
import { cloneDeep, parseInt } from "lodash";

const buttonLoading = ref(false);
const loading = ref(false);
const fieldList = ref([]);
const origin_filed = ref("");
const target_filed = ref("");
const progress = ref(0);
const mediaOption = computed(() => fieldList.value.filter((a) => a.type == 17));
const textOption = computed(() => fieldList.value.filter((a) => a.type == 1));
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
  const attachmentField = await table.getField(origin_filed.value);
  for (const record of recordList) {
    if (!recordIdList.includes(record.id)) {
      continue;
    }
    const imgArr = await attachmentField.getAttachmentUrls(record.id);
    let textArr = [];
    for (let url of imgArr) {
      // const ret = await imgWorker.recognize(url);
      // console.log("对对对", ret.data.text);
      // textArr.push(ret.data.text);
    }
    const dic = {
      recordId: record.id,
      fields: {
        [target_filed.value]: textArr.join(","),
      },
    };
    newDataArr.push(dic);
    i++;
    progress.value = parseInt(i / recordIdList.length);
  }

  await table.setRecords(newDataArr);
  buttonLoading.value = false;
  loading.value = false;
}

const commitCan = computed(() => {
  if (origin_filed.value && target_filed.value) {
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
