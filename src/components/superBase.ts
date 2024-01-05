
import { bitable, FieldType, ITable } from "@lark-base-open/js-sdk";
import { ref } from "vue";
let bit_table: ITable;
let imgWorker = "";
const bit_loading = ref(false)
const bit_all_fieldList = ref<any>([])
bitable.base.onSelectionChange((event) => {
    initBaeData();
});



async function initBaeData() {
    bit_loading.value = true;
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
initBaeData()
export { initBaeData, getAllField, bit_all_fieldList, bit_loading,bit_table }
