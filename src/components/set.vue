<template>
  <a-tabs default-active-key="1">
    <a-tab-pane key="0" title="导入数据">
      <a-table :columns="resultClassColumns" :data="resultArr"></a-table>
    </a-tab-pane>
    <a-tab-pane key="1" title="设置班次">
      <a-table :columns="classColumns" :data="tableArr" :pagination="false">
        <template #delete="{ rowIndex }">
          <icon-minus-circle
            style="font-size: 20px; color: #999"
            @click="removeInx(rowIndex)"
          />
        </template>
        <template #node="{ record }">
          <a-input v-model="record['node']" placeholder="班次名字"></a-input>
        </template>
        <template #num="{ record }">
          <a-input-number
            mode="button"
            class="text-center"
            v-model="record['num']"
            :min="1"
            placeholder="人数"
          ></a-input-number>
        </template>
        <template #sex="{ record }">
          <a-select
            placeholder="性别要求"
            v-model="record['sex']"
            :options="[
              { label: '无要求', value: 3 },
              { label: '限男性', value: 1 },
              { label: '限女性', value: 2 },
            ]"
          ></a-select>
        </template>
        <template #footer>
          <div class="row-center-center" @click="addClass">
            <a-button type="primary">新增班次</a-button>
          </div>
        </template>
      </a-table>
    </a-tab-pane>
    <a-tab-pane key="2" title="工作设置">
      <div class="grid-one p-all-5">
        <div class="row-start-center">
          <a-typography-text class="labelText">连续工作天数</a-typography-text>
          <a-input-number
            mode="button"
            clear="flex-grow"
            placeholder="最大连续工作天数"
            v-model="maxWorkNum"
            :min="1"
          ></a-input-number>
        </div>
        <div class="row-start-center">
          <a-typography-text class="labelText">最多休息天数</a-typography-text>
          <a-input-number
            mode="button"
            clear="flex-grow"
            placeholder="每人最多休息天数"
            v-model="maxFreeNum"
            :min="1"
          ></a-input-number>
        </div>
        <div class="row-start-center">
          <a-typography-text class="labelText">排班顺序</a-typography-text>
          <a-select
            v-model="orderMode"
            placeholder="请选择排班顺序"
            :options="[
              { label: '随机', value: 1 },
              { label: '按照人员读取顺序', value: 2 },
            ]"
          ></a-select>
        </div>

        <div class="row-start-center">
          <a-typography-text class="labelText">排班日期</a-typography-text>
          <a-range-picker
            class="flex-grow"
            v-model="dateRangeArr"
            :shortcuts="[
              {
                label: '本月',
                value: () => [dayjs().startOf('month'), dayjs().endOf('month')],
              },
              {
                label: '下个月',
                value: () => [
                  dayjs().add(1, 'month').startOf('month'),
                  dayjs().add(1, 'month').endOf('month'),
                ],
              },
              {
                label: '下下个月',
                value: () => [
                  dayjs().add(2, 'month').startOf('month'),
                  dayjs().add(2, 'month').endOf('month'),
                ],
              },
            ]"
          ></a-range-picker>
        </div>
        <div class="row-start-center">
          <a-typography-text class="labelText">不排班日期</a-typography-text>
          <a-select
            v-model="noWorkDateArr"
            multiple
            :options="getNoWorkDateArr()"
            placeholder="不参与排班日期"
          >
            <template #header>
              <div style="padding: 6px 12px">
                <a-checkbox value="6" @change="noWorkFormWeek('星期六', $event)"
                  >周六</a-checkbox
                >
                <a-checkbox value="2" @change="noWorkFormWeek('星期日', $event)"
                  >周日</a-checkbox
                >
              </div>
            </template>
            <template #option="{ data }">
              <a-typography-text>{{ data.label }}</a-typography-text>
              <a-typography-text>&ensp;({{ data.weekNum }})</a-typography-text>
            </template>
          </a-select>
        </div>
      </div>
    </a-tab-pane>
    <a-tab-pane key="3" title="预设">
      <div class="row-between-center p-all-5">
        <a-space direction="vertical" size="large">
          <a-radio-group :options="manCounDic" v-model="showCountIndex" />
        </a-space>
      </div>
      <div
        class="grid-one p-all-5"
        v-for="(item, index) in filterManArr"
        :key="index"
      >
        <div class="row-between-center">
          <a-typography-text>{{ item.name }}</a-typography-text>
          <icon-eye-invisible
            v-if="!item.canWork"
            style="font-size: 20px"
            @click="changeManWorkStatus(item)"
          />
          <icon-eye
            v-else
            style="font-size: 20px"
            @click="changeManWorkStatus(item)"
          />
        </div>
        <a-select
          v-model="item.freeDateArr"
          multiple
          :options="getOptionDateArr(item, true)"
          :limit="maxFreeNum"
          placeholder="预设休息日期"
        >
          <template #option="{ data }">
            <a-typography-text>{{ data.label }}</a-typography-text>
            <a-typography-text>&ensp;({{ data.weekNum }})</a-typography-text>
          </template>
        </a-select>
        <a-select
          v-model="item.workDateArr"
          multiple
          :options="getOptionDateArr(item, false)"
          placeholder="预设工作日期"
        >
          <template #option="{ data }">
            <a-typography-text>{{ data.label }}</a-typography-text>
            <a-typography-text>&ensp;({{ data.weekNum }})</a-typography-text>
          </template>
        </a-select>
      </div>
    </a-tab-pane>
    <a-tab-pane key="4" title="排班结果">
      <a-table :columns="resultClassColumns" :data="resultArr"></a-table>
    </a-tab-pane>
  </a-tabs>
</template>
 <script setup>
import { Message } from "@arco-design/web-vue";
import dayjs from "dayjs";
import { computed, ref } from "vue";
import {
  manArr,
  nodeDic,
  dateRangeArr,
  maxWorkNum,
  maxFreeNum,
  orderMode,
  noWorkDateArr,
} from "./common";

const showCountIndex = ref(1);
const manCounDic = computed(() => {
  const canNum = manArr.value.filter((a) => a["canWork"]);
  return [
    {
      label: `共有:${manArr.value.length}人`,
      value: 0,
    },
    {
      label: `参与排班:${canNum.length}人`,
      value: 1,
    },
    {
      label: `不参与排班:${manArr.value.length - canNum.length}人`,
      value: 2,
    },
  ];
});
const filterManArr = computed(() => {
  if (showCountIndex.value == 0) {
    return manArr.value;
  } else if (showCountIndex.value == 1) {
    return manArr.value.filter((a) => a["canWork"]);
  } else {
    return manArr.value.filter((a) => !a["canWork"]);
  }
});

// 获取休息与工作可选日期
function getOptionDateArr(man, isFree) {
  const startDate = dateRangeArr.value[0];
  const endDate = dateRangeArr.value[1];
  const datesInRange = [];
  let currentDate = startDate;
  while (currentDate <= endDate) {
    datesInRange.push({
      label: currentDate,
      weekNum: dayjs(currentDate).format("dddd"),
      value: currentDate,
      disabled: isFree
        ? man.workDateArr.includes(currentDate)
        : man.freeDateArr.includes(currentDate),
    });
    currentDate = dayjs(currentDate).add(1, "day").format("YYYY-MM-DD");
  }
  return datesInRange;
}
// 获取不工作日期
function getNoWorkDateArr(week) {
  const startDate = dateRangeArr.value[0];
  const endDate = dateRangeArr.value[1];
  const datesInRange = [];
  let currentDate = startDate;
  while (currentDate <= endDate) {
    datesInRange.push({
      label: currentDate,
      weekNum: dayjs(currentDate).format("dddd"),
      value: currentDate,
    });
    currentDate = dayjs(currentDate).add(1, "day").format("YYYY-MM-DD");
  }
  return datesInRange;
}
// 周六 日 一键全选
function noWorkFormWeek(week, e) {
  const startDate = dateRangeArr.value[0];
  const endDate = dateRangeArr.value[1];
  let datesInRange = noWorkDateArr.value;
  if (e) {
    let currentDate = startDate;
    while (currentDate <= endDate) {
      const aa = dayjs(currentDate).format("dddd");
      if (week == aa && !datesInRange.includes(currentDate)) {
        datesInRange.push(currentDate);
      }
      currentDate = dayjs(currentDate).add(1, "day").format("YYYY-MM-DD");
    }
  } else {
    datesInRange = noWorkDateArr.value.filter(
      (a) => dayjs(a).format("dddd") != week
    );
  }
  noWorkDateArr.value = datesInRange;
}
// 是否参与排版
function changeManWorkStatus(item) {
  item["canWork"] = !item["canWork"];
  if (item["canWork"]) {
    Message.info("参与排班");
  } else {
    Message.info("暂停排班");
  }
}
//table
const tableArr = ref([
  {
    node: "早班",
    num: 2,
    sex: 3,
  },
  {
    node: "白班",
    num: 2,
    sex: 3,
  },
  {
    node: "夜班",
    num: 2,
    sex: 3,
  },
]);

const classColumns = [
  {
    key: 1,
    title: "班次设置",
    dataIndex: "node",
    slotName: "node",
    children: [
      {
        key: 1,
        title: "操作",
        dataIndex: "delete",
        slotName: "delete",
        align: "center",
        width: 60,
      },
      {
        key: 1,
        title: "班次名称",
        dataIndex: "node",
        slotName: "node",
        align: "center",
        width: 100,
      },
      {
        key: 1,
        title: "需要人数",
        dataIndex: "num",
        slotName: "num",
        align: "center",
      },
      {
        key: 1,
        title: "性别要求",
        dataIndex: "性别要求",
        slotName: "sex",
        align: "center",
      },
    ],
  },
];

const resultClassColumns = computed(() => {
  const arr = tableArr.value.map((a) => {
    return {
      key: 1,
      title: a["node"],
      dataIndex: a["node"],
      align: "center",
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
        },
        ...arr,
      ],
    },
  ];
});
function addClass() {
  tableArr.value.push({
    node: "",
    num: 2,
    sex: 3,
  });
}
function removeInx(inx) {
  if (tableArr.value.length > 1) {
    tableArr.value.splice(inx, 1);
  } else {
    Message.info("不能再删除了");
  }
}
</script>
<style scoped>
.labelText {
  width: 100px;
  flex-shrink: 0;
}
</style>
                        
            