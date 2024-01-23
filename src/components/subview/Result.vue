<template>
  <div>
    <div class="column-center-center m-t-15" v-if="manArr.length == 0">
      <icon-exclamation-polygon-fill style="font-size: 30px; color: #aaa" />
      <a-typography-text class="m-t-5" disabled>{{ tsMsg }}</a-typography-text>
    </div>
    <div v-if="manArr.length > 0 && classArr.length > 0 && dataArr.length > 0">
      <div class="row-between-center m-b-10">
        <div class="grid-two grid-gap-5">
          <a-tooltip content="排班视图">
            <a-button
              :type="showTable == 2 ? 'primary' : 'dashed'"
              @click="() => (showTable = 2)"
            >
              <template #icon>
                <icon-calendar />
              </template>
            </a-button>
          </a-tooltip>
          <a-tooltip content="人员视图">
            <a-button
              :type="showTable == 1 ? 'primary' : 'dashed'"
              @click="() => (showTable = 1)"
            >
              <template #icon>
                <icon-user />
              </template>
            </a-button>
          </a-tooltip>
        </div>

        <a-button type="primary" @click="switchTabIndex(5)">下一步</a-button>
      </div>

      <a-table
        v-show="showTable == 1"
        stripe
        column-resizable
        :bordered="{ cell: true }"
        v-if="middleArr.length > 0"
        :columns="manColumns"
        :data="middleArr"
        :pagination="false"
      >
        <template #workNum="{ record, column }">
          <a-tooltip :content="record[column.dataIndex].join('\n|\n')">
            <a-typography-text type="primary">{{
              record[column.dataIndex]["length"]
            }}</a-typography-text>
          </a-tooltip>
        </template>
        <template #jiabanWorkArr="{ record, column }">
          <a-tooltip
            :content="record[column.dataIndex].join('\n|\n')"
            :content-style="{
              maxHeight: '400px',
              overflow: 'auto',
              background: 'rgb(var(--red-3))',
            }"
          >
            <a-typography-text type="primary">{{
              record[column.dataIndex]["length"]
            }}</a-typography-text>
          </a-tooltip>
        </template>
      </a-table>
      <a-table
        v-show="showTable == 2"
        stripe
        column-resizable
        :bordered="{ cell: true }"
        v-if="dataArr.length > 0"
        :columns="resultClassColumns"
        :data="dataArr"
        :pagination="false"
      ></a-table>
    </div>
  </div>
</template>
             <script setup>
import { Message } from "@arco-design/web-vue";
import { computed, ref } from "vue";
import {
  classArr,
  dataArr,
  computedWork,
  middleArr,
  manArr,
  switchTabIndex,
  stepNumIndex,
} from "../js/common";
const tsMsg = computed(() => {
  let msg = "";
  const exitEmpty = classArr.value.find((a) => {
    if (!a["node"] || a["dateRange"].length == 0) {
      return true;
    }
  });
  if (classArr.value.length == 0) {
    msg = "请设置班次";
  } else if (exitEmpty) {
    msg = "班次信息未设置完善";
  } else if (manArr.value.length == 0) {
    msg = "请先加载人员配置";
  } else if (dataArr.value.length == 0) {
    msg = "人员不足";
  }
  if (stepNumIndex.value == 4) {
    Message.info({content:msg,position:"bottom"});
  }
  return msg;
});

const showTable = ref(2);
const manColumns = computed(() => {
  const arr = classArr.value.map((a) => {
    return {
      key: 1,
      title: a["node"] + "\n" + a["dateRange"][0] + "~" + a["dateRange"][1],
      dataIndex: a["node"],
      align: "center",
      slotName: "workNum",
    };
  });
  return [
    {
      key: 1,
      title: "姓名",
      dataIndex: "name",
    },
    ...arr,
    {
      key: 1,
      title: "加班",
      dataIndex: "jiabanWorkArr",
      slotName: "jiabanWorkArr",
    },
  ];
});

const resultClassColumns = computed(() => {
  const arr = classArr.value.map((a) => {
    return {
      key: 1,
      title: a["node"] + "\n" + a["dateRange"][0] + "~" + a["dateRange"][1],
      dataIndex: a["node"],
      align: "center",
      render: ({ record, column }) =>
        record[column.dataIndex].map((a) => a["name"]).join(","),
    };
  });
  return [
    {
      key: 1,
      title: "排班结果",
      dataIndex: "node",
      slotName: "node",
      children: [
        {
          key: 1,
          title: "日期",
          dataIndex: "date",
          align: "center",
          width: 110,
        },
        ...arr,
      ],
    },
  ];
});
</script>
            <style scoped>
.labelText {
  width: 100px;
  flex-shrink: 0;
}
</style>
                                    
                        