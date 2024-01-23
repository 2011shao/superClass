
<template>
  <a-spin :loading="bit_loading" style="width: 100%">
    <!-- <a-typography-text
      >点击→
      <a-typography-text type="primary" @click="helpVoid">
        查看教程
      </a-typography-text>
    </a-typography-text> -->
    <div class="row-between-center">
      <a-typography-text disabled>初次使用,请创建人员配置表</a-typography-text>
      <a-popconfirm content="确定创建" @ok="createTabLeVoid">
        <a-button type="primary" status="success">创建人员配置表</a-button>
      </a-popconfirm>
    </div>
    <a-divider></a-divider>
    <div class="grid-one p-all-1 grid-gap-5">
      <SelectTableView
        title="选择表"
        v-model="import_table_id"
        canAdd
      ></SelectTableView>
      <SelectField
        must=""
        title="姓名"
        v-model="bit_import_dic.name_filed"
        :typeNumArr="[1, 11]"
        :preSetArr="['姓名']"
        :allFieldDic="bit_import_dic"
      ></SelectField>
      <SelectField
        title="性别"
        v-model="bit_import_dic.sex_filed"
        :typeNumArr="[3]"
        :preSetArr="['性别']"
        :allFieldDic="bit_import_dic"
      ></SelectField>
      <SelectField
        title="是否参与排班"
        :label-style="{ width: '120px' }"
        v-model="bit_import_dic.canWork_filed"
        :typeNumArr="[3]"
        :preSetArr="['是否参与排班']"
        :allFieldDic="bit_import_dic"
      ></SelectField>
      <SelectField
        title="是否允许加班"
        :label-style="{ width: '120px' }"
        v-model="bit_import_dic.superWork_filed"
        :typeNumArr="[3]"
        :preSetArr="['是否允许加班']"
        :allFieldDic="bit_import_dic"
      ></SelectField>
      <SelectField
        title="预设工作日期"
        :label-style="{ width: '120px' }"
        v-model="bit_import_dic.workDate_filed"
        :typeNumArr="[1, 5]"
        :preSetArr="['预设工作日期']"
        :allFieldDic="bit_import_dic"
      ></SelectField>
      <SelectField
        title="预设休息日期"
        :label-style="{ width: '120px' }"
        v-model="bit_import_dic.freeDate_filed"
        :typeNumArr="[1, 5]"
        :preSetArr="['预设休息日期']"
        :allFieldDic="bit_import_dic"
      ></SelectField>

      <a-progress v-if="buttonLoading" :percent="progress" />
    </div>

    <a-affix :offsetBottom="40">
      <div class="row-between-center m-r-10 m-t-15">
        <a-tooltip>
          <template #content>
            <div class="grid-one grid-gap-5 m-t-5">
              <a-typography-text style="color: var(--color-neutral-4)"
                >姓名:字段可以是人员或文本,姓名相同时取第一个</a-typography-text
              >
              <a-typography-text style="color: var(--color-neutral-4)"
                >性别:字段要求单选,选项:男与女</a-typography-text
              >
              <a-typography-text style="color: var(--color-neutral-4)"
                >是否参与排班:字段要求单选,选项:是与否</a-typography-text
              >
              <a-typography-text style="color: var(--color-neutral-4)"
                >是否允许加班:字段要求单选,选项:是与否</a-typography-text
              >
              <a-typography-text style="color: var(--color-neutral-4)"
                >预设日期:字段要求文本或者日期,多个日期请用英文","隔开</a-typography-text
              >
            </div>
          </template>
          <a-typography-text>帮助<icon-question-circle /></a-typography-text>
        </a-tooltip>
        <a-button type="primary" @click="exportVoid"
          >下一步 <icon-right />
        </a-button>
      </div>
    </a-affix>
  </a-spin>
</template>

<script setup >
import { ref, onMounted, computed, watch, onUnmounted } from "vue";
import { Message, Modal } from "@arco-design/web-vue";
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
  addBitNewField,
  addBitNewTable,
  import_table_id,
  oneStepCreateManConfig,
  is_select_name_field_type
} from "../js/superBase";
import SelectTableView from "../superView/selectTable.vue";

import dayjs from "dayjs";
const buttonLoading = ref(false);
const progress = ref(0);
const bit_import_dic = ref({
  name_filed: "",
  sex_filed: "",
  workDate_filed: "", //工作日期
  freeDate_filed: "", //休息日期
  superWork_filed: "", //是否加班
  canWork_filed: "", //是否参与排班
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
    const nameDic = await getCellValue(
      record,
      bit_import_dic.value.name_filed,
      "name_filed"
    );
    const sex = await getCellValue(
      record,
      bit_import_dic.value.sex_filed,
      "sex_filed"
    );
    const canWork = await getCellValue(
      record,
      bit_import_dic.value.canWork_filed,
      "canWork_filed"
    );
    const workDateArr = await getCellValue(
      record,
      bit_import_dic.value.workDate_filed,
      "workDate_filed"
    );
    const freeDateArr = await getCellValue(
      record,
      bit_import_dic.value.freeDate_filed,
      "freeDate_filed"
    );
    const superWork = await getCellValue(
      record,
      bit_import_dic.value.superWork_filed,
      "superWork_filed"
    );
    if (nameDic) {
      const nameFileDic = bit_all_fieldList.value.find(
        (a) => a["id"] == bit_import_dic.value.name_filed
      );
      is_select_name_field_type.value=nameFileDic.type
      const dic = {
        name: nameFileDic.type == 11 ? nameDic.name : nameDic,
        id: nameFileDic.type == 11 ? nameDic.id : i,
        sex: sex.indexOf("女") >= 0 ? 2 : 1, //1男 2女 3不限制男女
        canWork: canWork == "否" ? false : true, //是否参见工作
        freeNum: freeNum.value,
        maxLxWorkNum: maxLxWorkNum.value,
        maxWorkNum: maxWorkNum.value,
        workDateArr: workDateArr || [],
        freeDateArr: freeDateArr || [],
        jiabanWorkArr: [],
        superWork: superWork == "否" ? false : true,
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
  switchTabIndex(4);
}

async function getCellValue(record, filedId, filedKey) {
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
      } else if (["workDate_filed", "freeDate_filed"].includes(filedKey)) {
        valueStr = value.map((a) => a["text"].split(','));
      } else {
        valueStr = value.map((a) => a["text"]).join("");
      }
    } else if (typeof value == "object") {
      valueStr = value["text"];
    } else {
      //  日期文字
      if (["workDate_filed", "freeDate_filed"].includes(filedKey)) {
        if (filedType.type == 5) {
          //日期处理
          valueStr = [dayjs(value).format("YYYY-MM")];
        } else {
          valueStr = value
            .split(",")
            .map((a) => dayjs(a, "YYYY-MM-DD", true).isValid());
        }
      } else {
        valueStr = value;
      }
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
// 一键创建表
async function createTabLeVoid() {
  bit_loading.value = true;
  bit_import_dic.value = {
    name_filed: "",
    sex_filed: "",
    workDate_filed: "", //工作日期
    freeDate_filed: "", //休息日期
    superWork_filed: "", //是否加班
    canWork_filed: "", //是否参与排班
  };
  await oneStepCreateManConfig();
  bit_loading.value = false;
}
</script>
<style>
.labelCss {
  width: 70px;
  text-align: center;
  flex-shrink: 0;
}
</style>
