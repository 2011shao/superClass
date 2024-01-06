import { bitable, FieldType, ITable } from "@lark-base-open/js-sdk";
import { ref } from "vue";
let bit_table: ITable;
let imgWorker = "";
const bit_loading = ref(false);
const bit_all_fieldList = ref<any>([{ name: "ddd", id: "111", type: 1 }]);
bitable.base.onSelectionChange((event) => {
  initBaeData();
});

async function initBaeData() {
  // bit_loading.value = true;
  bit_table = await bitable.base.getActiveTable();
  getAllField(true);
}
async function getAllField(loadCache = false) {
  bit_loading.value = true;
  const fieldMetaList = await bit_table.getFieldMetaList();
  console.log("所有的字段", fieldMetaList);
  bit_all_fieldList.value = fieldMetaList;
  bit_loading.value = false;
}
// 新增字段
async function addBitNewField(fileName, fieldType = FieldType.Text) {
  const czItem = bit_all_fieldList.value.find((a) => a["name"] == fileName);
  if (czItem) {
    return "";
  } else {
    const fileId = await bit_table.addField({
      type: fieldType,
      name: fileName,
    });
    await getAllField();
    return fileId;
  }
}
// 新增记录
async function addBitRecord(arr) {
    const res = await bit_table.addRecords(arr);
    //   {
    //     fields: {
    //       [field.id]: 'new text field value1'
    //     }
    //   },
    //   {
    //     fields: {
    //       [field.id]: 'new text field value2'
    //     }
    //   },
    
  }

initBaeData();
export { initBaeData, getAllField, bit_all_fieldList, bit_loading, bit_table, addBitNewField,addBitRecord };
