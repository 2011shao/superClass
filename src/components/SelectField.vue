
<template>
  <div class="grid-one p-all-1 grid-gap-5">
    <div class="row-start-center">
      <a-typography-text class="flex-shrink labelCss">
        {{ props.title }}
      </a-typography-text>
      <a-select
        allow-clear
        v-model="modelValue"
        :placeholder="'选择' + props.title"
        :options="getCanOption"
        :field-names="{ value: 'id', label: 'name' }"
      >
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
} from "./superBase";
import { cloneDeep } from "lodash";
import { computed } from "vue";

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
  allFieldDic: {
    //选中的字段
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(["update:modelValue"]);

const getCanOption = computed(() => {
  const fieldMetaList = cloneDeep(bit_all_fieldList.value);

  const allFieldArr = Object.values(props.allFieldDic);
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
  console.log("dddd", allFieldArr);
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
