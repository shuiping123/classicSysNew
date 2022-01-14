<template>
  <div style="width:100%;height:100%;">
    <table-content
      filter="topTable"
      @cell-click="cellClick"
      @row-dbclick="dbclickFun"
      @reloadTableForThisPage="reloadTableForThisPage"
      :page_bottom="true"
      :page_head="true"
      :data="tableData">
      <div slot="t_header">
        <div style="height: 30px">

        </div>
      </div>
    </table-content>
  </div>
</template>

<script>
  import tableContent from "@/components_coment/tableContent";

    export default {
        name: "index",
      components: {tableContent},
        data() {
            return {
              tableData:{
                "title": [
                  {
                    "type": "selection",
                    "name": "",
                    "prop": "",
                    "width": "40px",
                    "sort": true,
                    "template": ""
                  },
                  {
                    "type": "",
                    "name": "项目名称",
                    "prop": "ProName",
                    "width": "200px",
                    "sort": true,
                    "template": ""
                  },
                  {
                    "type": "",
                    "name": "档案号",
                    "prop": "ProArchNo",
                    "width": "100px",
                    "sort": true,
                    "template": ""
                  },
                  {
                    "type": "",
                    "name": "分类文件夹",
                    "prop": "FolderName",
                    "width": "120px",
                    "sort": true,
                    "template": ""
                  },
                  {
                    "type": "",
                    "name": "项目经理",
                    "prop": "UsrId_MgrName",
                    "width": "110px",
                    "sort": true,
                    "template": ""
                  },
                  {
                    "type": "",
                    "name": "总承包",
                    "prop": "OverallContract",
                    "width": "100px",
                    "sort": true,
                    "template": ""
                  },
                  {
                    "type": "",
                    "name": "密级",
                    "prop": "ScrClsJsonName",
                    "width": "140px",
                    "sort": true,
                    "template": ""
                  },
                  {
                    "type": "",
                    "name": "保管期限",
                    "prop": "StorageName",
                    "width": "110px",
                    "sort": true,
                    "template": ""
                  },
                  {
                    "type": "",
                    "name": "借阅期限(天)",
                    "prop": "TotalDay_Brw",
                    "width": "130px",
                    "sort": true,
                    "template": ""
                  },
                  {
                    "type": "",
                    "name": "续借期限(天)",
                    "prop": "TotalDay_Ren",
                    "width": "130px",
                    "sort": true,
                    "template": ""
                  },
                  {
                    "type": "",
                    "name": "归档开始日期",
                    "prop": "ProSDate",
                    "width": "130px",
                    "sort": true,
                    "template": ""
                  },
                  {
                    "type": "",
                    "name": "归档结束日期",
                    "prop": "ProEDate",
                    "width": "130px",
                    "sort": true,
                    "template": ""
                  },
                  {
                    "type": "",
                    "name": "创建人",
                    "prop": "CreateUsrName",
                    "width": "160px",
                    "sort": true,
                    "template": ""
                  },
                  {
                    "type": "",
                    "name": "创建时间",
                    "prop": "CreateTime",
                    "width": "140px",
                    "sort": true,
                    "template": ""
                  },
                  {
                    "type": "",
                    "name": "修改人",
                    "prop": "UpdateUsrName",
                    "width": "90px",
                    "sort": true,
                    "template": ""
                  },
                  {
                    "type": "",
                    "name": "修改时间",
                    "prop": "UpdateTime",
                    "width": "120px",
                    "sort": true,
                    "template": ""
                  },
                  {
                    "type": "",
                    "name": "专利商",
                    "prop": "Licensor",
                    "width": "120px",
                    "sort": true,
                    "template": ""
                  },
                  {
                    "type": "",
                    "name": "主产品及规模",
                    "prop": "MainPro",
                    "width": "130px",
                    "sort": true,
                    "template": ""
                  },
                  {
                    "type": "",
                    "name": "工艺方法",
                    "prop": "IndustrialArt",
                    "width": "120px",
                    "sort": true,
                    "template": ""
                  },
                  {
                    "type": "",
                    "name": "原料路线",
                    "prop": "MaterialWay",
                    "width": "120px",
                    "sort": true,
                    "template": ""
                  },
                  {
                    "type": "",
                    "name": "项目地址",
                    "prop": "Addr",
                    "width": "200px",
                    "sort": true,
                    "template": ""
                  }
                ],
                "data": [
                  {
                    "Id": "19",
                    "Type": "Pro",
                    "ProName": "东区项目1",
                    "ProArchNo": "10001",
                    "FolderId": "8",
                    "FolderName": "东区",
                    "UsrId_Mgr": "3,4",
                    "UsrId_MgrName": "zhangsan[张三],testusr01[测试用户1]",
                    "OverallContract": "",
                    "ScrClsJson": "9,2,3",
                    "ScrClsJsonName": "机密,绝密,秘密",
                    "StorageId": "5",
                    "StorageName": "永久",
                    "TotalDay_Brw": "123",
                    "TotalDay_Ren": "456",
                    "ProSDate": "2021-12-28",
                    "ProEDate": "2021-12-28",
                    "CreateUsrId": "2",
                    "CreateUsrName": "admin[管理员]",
                    "CreateTime": "2021/12/28 9:45:30",
                    "UpdateUsrId": "0",
                    "UpdateUsrName": "",
                    "UpdateTime": "",
                    "Licensor": "",
                    "MainPro": "",
                    "IndustrialArt": "",
                    "MaterialWay": "",
                    "Addr": ""
                  },
                  {
                    "Id": "20",
                    "Type": "Pro",
                    "ProName": "东区项目2",
                    "ProArchNo": "10002",
                    "FolderId": "8",
                    "FolderName": "东区",
                    "UsrId_Mgr": "1,2",
                    "UsrId_MgrName": "sysadmin[系统管理员],admin[管理员]",
                    "OverallContract": "15",
                    "ScrClsJson": "9,2,3",
                    "ScrClsJsonName": "机密,绝密,秘密",
                    "StorageId": "4",
                    "StorageName": "50年",
                    "TotalDay_Brw": "111",
                    "TotalDay_Ren": "222",
                    "ProSDate": "2021-12-01",
                    "ProEDate": "2021-12-31",
                    "CreateUsrId": "1",
                    "CreateUsrName": "sysadmin[系统管理员]",
                    "CreateTime": "2021/12/28 9:51:31",
                    "UpdateUsrId": "0",
                    "UpdateUsrName": "",
                    "UpdateTime": "",
                    "Licensor": "16",
                    "MainPro": "17",
                    "IndustrialArt": "18",
                    "MaterialWay": "19",
                    "Addr": "14"
                  },
                  {
                    "Id": "21",
                    "Type": "Pro",
                    "ProName": "西区项目1",
                    "ProArchNo": "20001",
                    "FolderId": "9",
                    "FolderName": "西区",
                    "UsrId_Mgr": "0",
                    "UsrId_MgrName": "",
                    "OverallContract": "总承包",
                    "ScrClsJson": "1,9,2,3,4,8",
                    "ScrClsJsonName": "普通,机密,绝密,油商**,油商***,秘密",
                    "StorageId": "3",
                    "StorageName": "30年",
                    "TotalDay_Brw": "0",
                    "TotalDay_Ren": "0",
                    "ProSDate": "2022-01-01",
                    "ProEDate": "2022-01-31",
                    "CreateUsrId": "1",
                    "CreateUsrName": "sysadmin[系统管理员]",
                    "CreateTime": "2022/1/12 16:10:50",
                    "UpdateUsrId": "0",
                    "UpdateUsrName": "",
                    "UpdateTime": "",
                    "Licensor": "专利商",
                    "MainPro": "主产品及规模",
                    "IndustrialArt": "工艺方法",
                    "MaterialWay": "原料路线",
                    "Addr": "项目地址项目地址"
                  },
                  {
                    "Id": "22",
                    "Type": "Pro",
                    "ProName": "南3项目1",
                    "ProArchNo": "30001",
                    "FolderId": "39",
                    "FolderName": "南3",
                    "UsrId_Mgr": "0",
                    "UsrId_MgrName": "",
                    "OverallContract": "总承包",
                    "ScrClsJson": "1",
                    "ScrClsJsonName": "普通",
                    "StorageId": "3",
                    "StorageName": "30年",
                    "TotalDay_Brw": "0",
                    "TotalDay_Ren": "0",
                    "ProSDate": "2022-01-01",
                    "ProEDate": "2022-01-05",
                    "CreateUsrId": "1",
                    "CreateUsrName": "sysadmin[系统管理员]",
                    "CreateTime": "2022/1/13 10:34:57",
                    "UpdateUsrId": "0",
                    "UpdateUsrName": "",
                    "UpdateTime": "",
                    "Licensor": "专利商",
                    "MainPro": "主产品及规模",
                    "IndustrialArt": "工艺方法",
                    "MaterialWay": "原料路线",
                    "Addr": "项目地址"
                  },
                  {
                    "Id": "23",
                    "Type": "Pro",
                    "ProName": "南3项目2",
                    "ProArchNo": "30002",
                    "FolderId": "39",
                    "FolderName": "南3",
                    "UsrId_Mgr": "0",
                    "UsrId_MgrName": "",
                    "OverallContract": "总承包1",
                    "ScrClsJson": "9,2,3,4,1",
                    "ScrClsJsonName": "普通,机密,绝密,油商**,秘密",
                    "StorageId": "4",
                    "StorageName": "50年",
                    "TotalDay_Brw": "0",
                    "TotalDay_Ren": "0",
                    "ProSDate": "2022-01-02",
                    "ProEDate": "2022-01-06",
                    "CreateUsrId": "1",
                    "CreateUsrName": "sysadmin[系统管理员]",
                    "CreateTime": "2022/1/13 10:35:16",
                    "UpdateUsrId": "1",
                    "UpdateUsrName": "sysadmin[系统管理员]",
                    "UpdateTime": "2022/1/13 10:47:26",
                    "Licensor": "专利商1",
                    "MainPro": "主产品及规模11111",
                    "IndustrialArt": "工艺方法1",
                    "MaterialWay": "原料路线1",
                    "Addr": "项目地址"
                  }
                ],
                "limit": 10,
                count:100
              }
            }
        },
        mounted() {
        },
        methods: {
          cellClick(){},
          dbclickFun(){},
          reloadTableForThisPage(){},
        },
    }
</script>

<style scoped>

</style>
