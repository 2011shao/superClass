import { bitable, FieldType, ITable } from "@lark-base-open/js-sdk";
import { ref } from "vue";
let bit_table: ITable;
const bit_loading = ref(false);
const bit_all_fieldList = ref<any>([{ name: "ddd", id: "111", type: 1 }]);
const bit_all_table = ref<any>([])
const bit_select_dic = ref<any>({
  baseId: "", fieldId: "", recordId: "", tableId: "", viewId: "",
})
const import_table_id = ref('')//导入人员时的表
const export_table_id = ref('')//导出人员时的表

bitable.base.onSelectionChange((event) => {
  // initBaeData();
  console.log('对对对', event)
  if (event.data.tableId != bit_select_dic.value.tableId) {
    initBaeData()
  }
  bit_select_dic.value = event.data

});

async function initBaeData() {
  bit_loading.value = true;
  bit_table = await bitable.base.getActiveTable();
  bit_select_dic.value.tableId = bit_table.id
  console.log('dd', bit_table)
  getAllField(true);
}
async function getAllField(loadCache = false) {
  bit_loading.value = true;
  const fieldMetaList = await bit_table.getFieldMetaList();
  console.log("所有的字段", fieldMetaList);
  bit_all_fieldList.value = fieldMetaList;
  bit_loading.value = false;
}
initBaeData();
export { initBaeData, getAllField, import_table_id, export_table_id }
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

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

export { bit_all_fieldList, bit_loading, bit_table, addBitNewField, addBitRecord };

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// 获取所有的表格
async function getAllTable(loadCache = false) {
  bit_all_table.value = await bitable.base.getTableMetaList();
}
async function addBitNewTable(name) {
  try {
    const { tableId, index } = await bitable.base.addTable({ name: name, fields: [] })
    await getAllTable()
    await bitable.ui.switchToTable(tableId);
  } catch (e) {
  }
}
async function switchTable(tableId) {
  await bitable.ui.switchToTable(tableId);
  initBaeData()

}
getAllTable()
export { getAllTable, bit_all_table, bit_select_dic, addBitNewTable, switchTable }

// ----------------------------------一键创建配置表

async function oneStepCreateManConfig() {
  const tableName = "一键排班-人员配置表"
  const tableList = await bitable.base.getTableMetaList()
  const isExit = tableList.find((a) => a['name'] == tableName)
  if (isExit) {
    switchTable(isExit.id)
    return
  }

  const { tableId, index } = await bitable.base.addTable({ name: tableName, fields: [] })
  const table = await bitable.base.getTableById(tableId);



  let dic = {}
  const name_id = await table.addField({ type: FieldType.Text, name: "姓名", description: { content: "插件[一键排班]与姓名(人员)二选一" } })
  const name_man = await table.addField({ type: FieldType.User, name: "姓名(人员)", description: { content: "插件[一键排班]与姓名二选一" } })
  dic[name_id] = '测试-张三'
  const sex_id = await table.addField({ type: FieldType.SingleSelect, name: "性别", description: { content: "插件[一键排班]不填写默认为男性" } })
  const sex_filed = await table.getField(sex_id)
  await sex_filed.addOptions([{ name: '男' }, { name: '女' }]);
  const sex_optione = await sex_filed.getOptions();
  dic[sex_id] = sex_optione[0]


  const canwork_id = await table.addField({ type: FieldType.SingleSelect, name: "是否参与排班", description: { content: "插件[一键排班]不填写默认为参加" } })
  const canwork_filed = await table.getField(canwork_id)
  await canwork_filed.addOptions([{ name: '是' }, { name: '否' }]);
  const can_optione = await canwork_filed.getOptions();
  dic[canwork_id] = can_optione[0]


  const superwork_id = await table.addField({ type: FieldType.SingleSelect, name: "是否允许加班", description: { content: "插件[一键排班]不填写默认为是 " } })
  const superwork_filed = await table.getField(superwork_id)
  await superwork_filed.addOptions([{ name: '是' }, { name: '否' }]);
  const superwork_optione = await superwork_filed.getOptions();
  dic[superwork_id] = superwork_optione[0]



  const workdate_id = await table.addField({ type: FieldType.Text, name: "预设工作日期", description: { content: "插件[一键排班]多个日期用因为逗号','隔开" } })
  const freedate_id = await table.addField({ type: FieldType.Text, name: "预设休息日期", description: { content: "插件[一键排班]多个日期用因为逗号','隔开" } })
  dic[workdate_id] = '2024-01-01,2024-01-02'
  dic[freedate_id] = '2024-01-03,2024-01-04'
  table.addRecord({ fields: dic })
  switchTable(tableId)


}
export { oneStepCreateManConfig }