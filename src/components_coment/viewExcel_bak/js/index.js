import XLSX from 'xlsx'

//将行,列转换
function transformSheets(sheets) {
  let tableObj = {};
  var content = []
  var content1 = []
  var tmplist = []
  for (let key in sheets) {
    //读出来的workbook数据很难读,转换为json格式,参考https://github.com/SheetJS/js-xlsx#utility-functions
    tmplist.push(XLSX.utils.sheet_to_json(sheets[key]).length);//多少行row
    content1.push(XLSX.utils.sheet_to_json(sheets[key]))
  }
  var maxLength = Math.max.apply(Math, tmplist)
  let titleTd;
  //进行行列转换
  for (let y in [...Array(maxLength)]) {
    content.push([])
    let columnNumGlobal = 0;//记录列数
    for (let x in [...Array(tmplist.length)]) {
      try {
        let columnNum = 0;//当行的列数
        titleTd = Object.keys(content1[x][y])
        // 记录合并
        let index=0;//合并从第几个开始的
        let num=0;//合并了几格
        for (let z in content1[x][y]) {
          console.log(content1[x][y])
          for (let zz in content1[x][y]) {
          }
          content[y].push({
            type: 'body',
            text: content1[x][y][z],
          });
          columnNum++;
        }
        // 记录当前sheet页最大的列数
        if (columnNumGlobal < columnNum) {
          columnNumGlobal = columnNum;
        }
      } catch (error) {
        content[y].push(' ')
      }
    }
    // 记录当前的最大列数
    tableObj.column=columnNumGlobal;
  }
  content.unshift(titleTd.map(item => {
    return {text: item, type: 'title'}
  }));
  for (let key in sheets) {
    tableObj.sheet = key;
  }
  tableObj.data = content;
  return tableObj;
}

export {transformSheets as default}
