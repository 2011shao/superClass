<template>
  <div class="grid-one p-all-5">
    <div class="row-start-center" v-if="1 > 2">
      <a-tooltip content="最多工作天数">
        <a-typography-text class="labelText">最多工作天数 </a-typography-text>
      </a-tooltip>
      <a-input-number
        mode="button"
        clear="flex-grow"
        placeholder="最多工作天数"
        v-model="maxWorkNum"
        :min="1"
      ></a-input-number>
    </div>
    <div class="row-start-center" v-if="1 > 2">
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
      <a-tooltip :content="`上${maxLxWorkNum}休${freeNum}`">
        <a-typography-text class="labelText">连续工作天数 </a-typography-text>
      </a-tooltip>
      <a-input-number
        mode="button"
        clear="flex-grow"
        placeholder="最大连续工作天数"
        v-model="maxLxWorkNum"
        :min="1"
      ></a-input-number>
    </div>
    <div class="row-start-center">
      <a-tooltip :content="`上${maxLxWorkNum}休${freeNum}`">
        <a-typography-text class="labelText">休息的天数 </a-typography-text>
      </a-tooltip>
      <a-input-number
        mode="button"
        clear="flex-grow"
        placeholder="休息天数"
        v-model="freeNum"
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
        :allow-clear="false"
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
      <a-typography-text class="labelText">休息日期</a-typography-text>
      <a-select
        v-model="noWorkDateArr"
        class="flex-grow"
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
    <div class="row-start-center">
      <a-typography-text class="labelText">是否允许加班</a-typography-text>
      <a-radio-group v-model="superWork">
        <a-radio :value="true">是</a-radio>
        <a-radio :value="false">否</a-radio>
      </a-radio-group>
    </div>
    <div class="row-start-center">
      <a-tooltip>
        <template #content>
          <div class="grid-one grid-gap-5 ">
            <a-typography-text style="color: var(--color-neutral-4)">
              人员不足时,开启允许加班,会以完成工作为主
            </a-typography-text>
          </div>
        </template>
        <icon-question-circle />
      </a-tooltip>
      <a-typography-text
      class="flex-grow"
        >{{ `上${maxLxWorkNum}休${freeNum}` }},最少需要{{
          minManWorkNum
        }}人能满足工作</a-typography-text
      >
      <a-button type="primary" @click="switchTabIndex(2)"
        >下一步<icon-right />
      </a-button>
    </div>
  </div>
</template>
             <script setup lang="ts">
import { Message } from "@arco-design/web-vue";
import dayjs from "dayjs";
import { computed, onMounted, ref } from "vue";
import {
  manArr,
  dateRangeArr,
  maxWorkNum,
  maxLxWorkNum,
  maxFreeNum,
  orderMode,
  noWorkDateArr,
  switchTabIndex,
  freeNum,
  minManWorkNum,
  superWork,
} from "../js/common";
const dateRange=ref()
onMounted(() => {
  console.log(dateRange.value)
});
// 获取不工作日期
function getNoWorkDateArr() {

  if (dateRangeArr.value.length < 2) {
    return [];
  }
  const startDate = dateRangeArr.value[0];
  const endDate = dateRangeArr.value[1];
  type DateObject = {
    label: string;
    weekNum: string;
    value: string;
  };
  const datesInRange: DateObject[] = [];
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
  if (dateRangeArr.value.length < 2) {
    return [];
  }
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
</script>
<style>
.labelText {
  width: 100px;
  flex-shrink: 0;
}

</style>
                                    
                        