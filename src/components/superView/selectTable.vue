
<template>
  <div class="grid-one p-all-1 grid-gap-5">
    <div class="row-start-center">
      <a-typography-text class="flex-shrink labelCss">
        {{ props.title }}
      </a-typography-text>
      <a-select
        allow-clear
        :trigger-props="{ preventFocus: false }"
        v-model="props.modelValue"
        :placeholder="'选择' + props.title"
        :options="getCanOption"
        :field-names="{ value: 'id', label: 'name' }"
        @change="changeValue"
        @clear="changeValue('')"
        show-header-on-empty
        :show-extra-options="false"
      >
        <template #header v-if="canAdd">
          <a-input-search
            placeholder="创建新表"
            search-button
            :loading="addInputLoading"
            v-model="newFieldName"
            @search="sureAdd"
            button-text="确定"
          >
          </a-input-search>
        </template>
      </a-select>
    </div>
  </div>
</template>

<script setup >
import {
  bit_all_table,
  bit_select_dic,
  addBitNewTable,
  switchTable,
} from "../js/superBase";
import { cloneDeep } from "lodash";
import { computed, ref, watch, watchEffect } from "vue";
import { Message } from "@arco-design/web-vue";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  canAdd: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: String,
    default: "",
  },
  allFieldDic: {
    //选中的字段
    type: Object,
    default: () => {
      return {}
    },
  },
  preSetArr: {
    //预设匹配值 姓名
    type: Array,
    default: () => [],
  },
});
const newFieldName = ref("");
const addInputLoading = ref(false);
async function sureAdd() {
  addInputLoading.value = true;
  newFieldName.value = newFieldName.value.trim();
  if (newFieldName.value) {
    await addBitNewTable(newFieldName.value);
  } else {
    Message.info("表名不能为空");
  }
  addInputLoading.value = false;
}
const emit = defineEmits(["update:modelValue"]);
function changeValue(e) {
  emit("update:modelValue", e);
  switchTable(e)
}
const getCanOption = computed(() => {
  const tableList = cloneDeep(bit_all_table.value);
  const allFieldArr = Object.values(props.allFieldDic);
  for (let item of tableList) {
    item["disabled"] = false;
    if (allFieldArr.includes(item.id)) {
      item["disabled"] = true;
      continue;
    }
    if (props.preSetArr.includes(item.name) && !props.modelValue) {
      emit("update:modelValue", item.id);
    }
  }
  return tableList;
});
</script>
<style>
.labelCss {
  width: 70px;
  text-align: center;
  flex-shrink: 0;
}
</style>
