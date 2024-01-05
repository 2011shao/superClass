
<template>
  <div>
      <div class="grid-one p-all-1 grid-gap-5">
        <div class="row-start-center">
          <a-typography-text class="flex-shrink labelCss">
            {{ props.title }}
          </a-typography-text>
          <a-select
            allow-clear
            v-model="name_filed"
            :placeholder="'选择'+props.title"
            :options="getCanOption"
            :field-names="{ value: 'id', label: 'name' }"
          ></a-select>
        </div>
        
  </div>
</template>

<script setup >
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  typeNumArr: {
    type: Array,
    default: () => [1,2],
  },
  preSetArr: {//预设匹配值 姓名
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: String,
    default: "",
  },
  allFieldDic: {//选中的字段
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(["update:modelValue"]);

function getCanOption() {
  const fieldMetaList = []; //await table.getFieldMetaList();
  const allFieldArr = Object.values(props.allFieldDic);
  for (let item of fieldMetaList) {
    if (allFieldArr.includes(item.id) || !props.typeNumArr.includes(item.type)) {
      continue;
    }
    if (props.preSetArr.includes(item.name)) {
      emit("update:modelValue", item.id);
    }
  }
}


</script>
<style>
.labelCss {
  width: 70px;
  text-align: center;
  flex-shrink: 0;
}
</style>
