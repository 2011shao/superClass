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
        <a-input v-model="record['node']" placeholder="班次名字"></a-input>
      </template>
      <template #dateRange="{ record }">
        <a-time-picker
          type="time-range"
          format="HH:mm"
          v-model="record['dateRange']"
        ></a-time-picker>
      </template>
      <template #num="{ record }">
        <a-input-number
          class="text-center"
          style="text-align: center"
          v-model="record['num']"
          :min="1"
          placeholder="人数"
        ></a-input-number>
      </template>
      <template #sex="{ record }">
        <a-select
          placeholder="性别"
          v-model="record['sex']"
          :options="[
            { label: '无要求', value: 3 },
            { label: '限男性', value: 1 },
            { label: '限女性', value: 2 },
          ]"
        ></a-select>
      </template>
      <template #footer>
        <div class="row-between-center">
          <a-button type="primary" status="success" @click="addClass">
            <template #icon>
              <icon-plus />
            </template>
            新增班次</a-button
          >
          <a-button type="primary" @click="switchTabIndex(1)"
            >下一步 <icon-right />
          </a-button>
        </div>
      </template>
    </a-table>
    <div class="row-between-center p-all-5">
      <a-typography-text>根据实际工作需求设置班次</a-typography-text>
      <a-button type="text" @click="helpVoid">查看教程</a-button>
    </div>
  </div>
</template>
             <script setup>
import { Message } from "@arco-design/web-vue";
import { ref } from "vue";
import { classArr, switchTabIndex } from "../js/common";
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
        title: "班次",
        dataIndex: "node",
        slotName: "node",
        align: "center",
        width: 100,
      },
      {
        key: 1,
        title: "班次时间",
        dataIndex: "dateRange",
        slotName: "dateRange",
        align: "center",
        width: 160,
      },
      {
        key: 1,
        title: "人数",
        dataIndex: "num",
        slotName: "num",
        align: "center",
        width: 100,
      },
      {
        key: 1,
        title: "性别",
        dataIndex: "性别要求",
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
    field: `field_${maxNum + 1}`,
  });
}
function removeInx(inx) {
  if (classArr.value.length > 1) {
    classArr.value.splice(inx, 1);
  } else {
    Message.info("不能再删除了");
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
                                    
                        