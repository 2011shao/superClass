<template>
  <div>
    <div v-if="manArr.length == 0">
      <a-empty description="请先导入数据" @click="switchTabIndex(2)" />
    </div>

    <div v-if="manArr.length > 0">
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
          <a-typography-text>{{ item["name"] }}</a-typography-text>
          <a-space>
            <a-switch v-model="item.canWork">
              <template #checked>参与排班</template>
              <template #unchecked>不参与排班</template>
            </a-switch>
            <a-switch v-model="item.superWork">
              <template #checked>可以加班</template>
              <template #unchecked>禁止加班</template>
            </a-switch>
          </a-space>
        </div>
        <a-select
          v-model="item['freeDateArr']"
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
          v-model="item['workDateArr']"
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
    </div>
    <div class="m-b-15"> </div>
    <a-affix :offsetBottom="40">
      <div class="row-end-center m-r-10">
        <a-button type="primary" @click="switchTabIndex(4)">下一步</a-button>
      </div>
    </a-affix>
  </div>
</template>
<script setup lang="ts">
import { Message } from "@arco-design/web-vue";
import dayjs from "dayjs";
import { computed, ref } from "vue";
import { manArr, dateRangeArr, maxFreeNum, switchTabIndex } from "../common";

const showCountIndex = ref(0);
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
  if (dateRangeArr.value.length < 2) {
    return [];
  }
  const startDate = dateRangeArr.value[0];
  const endDate = dateRangeArr.value[1];
  let datesInRange = <any>[];
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

// 是否参与排版
function changeManWorkStatus(item) {
  item["canWork"] = !item["canWork"];
  if (item["canWork"]) {
    Message.info("参与排班");
  } else {
    Message.info("暂停排班");
  }
}
</script>
 <style scoped>
.labelText {
  width: 100px;
  flex-shrink: 0;
}
</style>
                                    
                        