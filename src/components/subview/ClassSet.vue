<template>
  <div>
    <a-table :columns="classColumns" :data="classArr" :pagination="false">
      <template #delete="{ rowIndex }">
        <icon-minus-circle
          style="font-size: 20px; color: #999"
          @click="removeInx(rowIndex)"
        />
      </template>
      <template #node="{ record }">
        <a-input v-model="record['node']" :placeholder="t('班次名字')"></a-input>
      </template>
      <template #dateRange="{ record }">
        <a-space>
          <a-time-picker format="HH:mm" v-model="record['startTime']">
            <template #suffix-icon>
              <a-typography-text></a-typography-text>
            </template>
          </a-time-picker>
          <a-time-picker format="HH:mm" v-model="record['endTime']">
            <template #suffix-icon>
              <a-typography-text></a-typography-text>
            </template>
          </a-time-picker>
        </a-space>
      </template>
      <template #num="{ record }">
        <a-input-number
          class="text-center"
          style="text-align: center"
          v-model="record['num']"
          :min="1"
          :placeholder="t('人数')"
        ></a-input-number>
      </template>
      <template #sex="{ record }">
        <a-select
          :placeholder="t('性别')"
          v-model="record['sex']"
          :options="[
            { label: t('无要求'), value: 3 },
            { label: t('限男性'), value: 1 },
            { label: t('限女性'), value: 2 },
          ]"
        ></a-select>
      </template>
      <template #footer>
        <div class="row-between-center">
          <a-button type="primary" status="success" @click="addClass">
            <template #icon>
              <icon-plus />
            </template>
            {{t('新增班次')}}</a-button
          >
          <a-button type="primary" @click="switchTabIndex(1)"
            >{{t('下一步')}} <icon-right />
          </a-button>
        </div>
      </template>
    </a-table>
    <div class="row-between-center p-all-5">
      <a-typography-text>{{t('根据实际工作需求设置班次,班次设置请自行效验')}}</a-typography-text>
      <a-button type="text" @click="helpVoid">{{t('查看教程')}}</a-button>
    </div>
  </div>
</template>
             <script setup>
import { Message } from "@arco-design/web-vue";
import { ref } from "vue";
import { classArr, switchTabIndex } from "../js/common";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const classColumns = [
  {
    key: 1,
    title: t("班次设置"),
    dataIndex: "node",
    slotName: "node",
    children: [
      {
        key: 1,
        title: t("操作"),
        dataIndex: "delete",
        slotName: "delete",
        align: "center",
        width: 60,
      },
      {
        key: 1,
        title:t("班次"),
        dataIndex: "node",
        slotName: "node",
        align: "center",
        width: 100,
      },
      {
        key: 1,
        title:t("班次时间"),
        dataIndex: "dateRange",
        slotName: "dateRange",
        align: "center",
        width: 160,
      },
      {
        key: 1,
        title:t("人数"),
        dataIndex: "num",
        slotName: "num",
        align: "center",
        width: 100,
      },
      {
        key: 1,
        title: t("性别"),
        dataIndex: t("性别要求"),
        slotName: "sex",
        align: "center",
        width: 60,
      },
    ],
  },
];

function addClass() {
  let maxNum = 0;
  for (let item of classArr.value) {
    const num = parseInt(item["field"].replace("field_", ""));
    if (num > maxNum) {
      maxNum = num;
    }
  }
  classArr.value.push({
    node: "",
    num: 2,
    sex: 3,
    startTime:"",
    endTime:"",
    field: `field_${maxNum + 1}`,
  });
}
function removeInx(inx) {
  if (classArr.value.length > 1) {
    classArr.value.splice(inx, 1);
  } else {
    Message.info(t("不能再删除了"));
  }
}
// bang
function helpVoid() {
  window.open(
    "https://y35xdslz6g.feishu.cn/docx/HLsddDe0doK9egxxEHVc31BFn7g?from=from_copylink",
    "_blank"
  );
}
</script>
            <style scoped>
.labelText {
  width: 100px;
  flex-shrink: 0;
}
</style>
                                    
                        