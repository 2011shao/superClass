
<template>
  <div class="grid-one p-all-1 grid-gap-5">
    <div class="row-start-center">
      <a-typography-text class="flex-shrink labelCss">
        {{ props.title }}
      </a-typography-text>
      <a-select
        allow-clear
        :trigger-props="{ preventFocus: false }"
        @change="changeValue"
        v-model="modelValue"
        :placeholder="'选择' + props.title"
        :options="getCanOption"
        @clear="changeValue('')"
        :field-names="{ value: 'id', label: 'name' }"
        show-header-on-empty
      >
        <template #header v-if="canAdd">
          <a-input-search
            placeholder="新增字段,新增字段默认为text"
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
  initBaeData,
  getAllField,
  bit_all_fieldList,
  bit_loading,
  addBitNewField,
} from "./superBase";
import { cloneDeep } from "lodash";
import { computed, ref, watch, watchEffect } from "vue";
import { Message } from "@arco-design/web-vue";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  typeNumArr: {
    type: Array,
    default: () => [1],
  },
  preSetArr: {
    //预设匹配值 姓名
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: String,
    default: "",
  },
  canAdd: {
    type: Boolean,
    default: false,
  },
  allFieldDic: {
    //选中的字段
    type: Object,
    default: () => {},
  },
});
const newFieldName = ref("");
const addInputLoading = ref(false);
async function sureAdd() {
  addInputLoading.value = true;
  newFieldName.value = newFieldName.value.trim();
  if (newFieldName.value) {
    const filedId = await addBitNewField();
    changeValue(filedId);
  }
  addInputLoading.value = false;

  Message.info("字段名字不能为空");
}

const emit = defineEmits(["update:modelValue"]);
function changeValue(e) {
  emit("update:modelValue", e);
}

const getCanOption = computed(() => {
  const fieldMetaList = cloneDeep(bit_all_fieldList.value);
  const allFieldArr = Object.values(props.allFieldDic);
  console.log("搜了几次");

  for (let item of fieldMetaList) {
    item["disabled"] = false;

    if (
      allFieldArr.includes(item.id) ||
      !props.typeNumArr.includes(item.type)
    ) {
      item["disabled"] = true;
      continue;
    }
    if (props.preSetArr.includes(item.name)) {
      emit("update:modelValue", item.id);
    }
  }
  console.log("dddd", props.allFieldDic);
  return fieldMetaList;
});
</script>
<style>
.labelCss {
  width: 70px;
  text-align: center;
  flex-shrink: 0;
}
</style>
