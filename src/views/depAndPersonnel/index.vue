<template>
  <div id="depAndPersonnel" class="fullscreen-parent-mine">
    <div class="fullscreen-parent-mine form-inline content">
      <!--侧边栏-->
      <div v-loading="treeLoading" class="borderStyle" v-Resizable="{minWidth:100,minHeight:'100%'}">
        <div @contextmenu.prevent>
          <Tree :data="treeData"
                style="flex-shrink:0"
                ref="depTree"
                @nodeContextMenu="rightClickMenu($event)"
                @selectionChange="selectionChange($event)"
                @nodeExpand="onNodeExpand($event)"></Tree>
        </div>
      </div>
      <!--表格-->
      <div>
        <table-content
          v-if="selection"
          filter="table"
          @rightClick="rightClick_table"
          @cell-click="cellClick_table"
          @row-dbclick="dbclickFun_table"
          @handleSelectionChange="multipleSelection=$event"
          :page_bottom="false"
          :page_head="true"
          :data="tableData">
          <div slot="t_header">
            <div style="padding:7px 0" class="form-inline">
              <el-input v-model="search.name" size="mini" class="tableInputText" placeholder="请输入名称"></el-input>
              <el-select v-model="search.type" size="mini" style="width:100px;" class="tableSelect">
                <el-option label="全部" value="1"/>
                <el-option label="仅部门" value="2"/>
                <el-option label="仅用户" value="3"/>
              </el-select>
              <el-button type="primary" icon="el-icon-search" size="mini" class="tableInputCircleBtn" circle
                         @click="searchFun"
                         plain></el-button>
              <el-button type="primary" icon="el-icon-close" size="mini" class="tableInputCircleBtn" circle
                         @click="clearSeachFun"
                         plain></el-button>
              <!--添加部门-->
              <el-button type="primary" @click="openAddDep" size="mini" class="tableInputBtn"
                         :disabled="!showOptionButton" plain>添加部门
              </el-button>
              <!--添加用户-->
              <el-button type="primary" @click="openAddUsr" size="mini" class="tableInputBtn"
                         :disabled="!showOptionButton" plain>添加用户
              </el-button>
              <!--批量禁用/取消禁用-->
              <btn-group-mine>
                <template slot="content">
                  <btn-group-item @click="batchDisabledUsrFun(0)" :disabled="!showOptionButton||multipleSelection.filter(item=>{return item.DType=='Dep'}).length > 0">批量禁用</btn-group-item>
                  <btn-group-item @click="batchDisabledUsrFun(1)" :disabled="!showOptionButton||multipleSelection.filter(item=>{return item.DType=='Dep'}).length > 0">取消禁用</btn-group-item>
                </template>
                <el-button type="primary" slot="reference" size="mini" class="tableInputBtn" plain>禁用操作
                  <i class="el-icon-caret-bottom el-icon--right"></i>
                </el-button>
              </btn-group-mine>
              <!--批量删除-->
              <el-button type="danger" @click="BatchDelUsrFun" size="mini" class="tableInputBtn" plain
                         :disabled="!showOptionButton||multipleSelection.filter(item=>{return item.DType=='Dep'}).length > 0">
                删除用户
              </el-button>
              <!--更多-->
              <btn-group-mine>
                <template slot="content">
                  <btn-group-item :disabled="!showOptionButton||multipleSelection.filter(item=>{return item.DType=='Dep'}).length > 0" @click="openPersonnelTransferModal">人员调转</btn-group-item>
                  <btn-group-item type="line"/>
                  <btn-group-item :disabled="!showOptionButton" @click="openDelUsrModal">已删人员管理</btn-group-item>
                </template>
                <el-button type="primary" slot="reference" size="mini" class="tableInputBtn" plain>更多
                  <i class="el-icon-caret-bottom el-icon--right"></i>
                </el-button>
              </btn-group-mine>
            </div>
          </div>
        </table-content>
      </div>
    </div>

    <!--右键菜单 树形图-->
    <right-menu ref="rightMenu" @changeRightMenu="changeMenu"/>

    <!--部门弹框-->
    <el-dialog width="380px" :close-on-click-modal="false" :title="depModal.type=='add'?'添加部门':'修改部门'" :visible.sync="depModal.show">
      <form-mine @submit="submitDepOption" ref="folderForm" size="mini" label-width="120px">
        <form-item-mine label="所属部门" v-if="selection">{{selection.text}}</form-item-mine>
        <form-item-mine label="名称 *">
          <el-input v-model="depModal.name" size="mini" required class="formWidth" placeholder="请输入内容"></el-input>
        </form-item-mine>
        <form-item-mine label="编号 *">
          <el-input v-model="depModal.code" size="mini" required class="formWidth" placeholder="请输入内容"></el-input>
        </form-item-mine>
        <form-item-mine label="文件对应专业">
          <el-select v-model="depModal.chooseZY_document" size="mini" class="formWidth" multiple collapse-tags placeholder="请选择">
            <el-option v-for="item in depModal.ZYData" :key="'chooseZY_document'+item.value" :label="item.label"
                       :value="item.value"/>
          </el-select>
        </form-item-mine>
        <form-item-mine label="图纸对应专业">
          <el-select v-model="depModal.chooseZY_img" size="mini" class="formWidth" multiple collapse-tags placeholder="请选择">
            <el-option v-for="item in depModal.ZYData" :key="'chooseZY_img'+item.value" :label="item.label"
                       :value="item.value"/>
          </el-select>
        </form-item-mine>
        <div style="width:100%;text-align: center;margin-top:10px;">
          <el-button size="mini" type="primary" native-type="submit">确定</el-button>
          <el-button size="mini" @click="$set(depModal,'show',false)">取消</el-button>
        </div>
      </form-mine>
    </el-dialog>

    <!--用户弹框-->
    <el-dialog width="450px" :close-on-click-modal="false" :title="usrModal.type=='add'?'添加用户':'修改用户'" :visible.sync="usrModal.show">
      <form-mine @submit="submitUsrOption" ref="folderForm" size="mini" label-width="130px">
        <div style="height:300px;overflow:auto">
          <form-item-mine label="所属部门" v-if="selection">{{selection.text}}</form-item-mine>
          <form-item-mine label="姓名 *">
            <el-input v-model="usrModal.name" size="mini" required class="formWidth" placeholder="请输入内容"></el-input>
          </form-item-mine>
          <form-item-mine label="登录名 *">
            <el-input v-model="usrModal.loginName" :disabled="usrModal.type!=='add'" size="mini" required class="formWidth"
                      placeholder="请输入内容"></el-input>
          </form-item-mine>
          <form-item-mine label="编号">
            <el-input v-model="usrModal.code" :disabled="usrModal.type!=='add'" size="mini" class="formWidth" placeholder="请输入内容"></el-input>
          </form-item-mine>
          <form-item-mine label="邮箱 *">
            <el-input v-model="usrModal.email" type="email" size="mini" required class="formWidth"
                      placeholder="请输入内容"></el-input>
          </form-item-mine>
          <form-item-mine label="电话">
            <el-input v-model="usrModal.tel" size="mini" class="formWidth" placeholder="请输入内容"></el-input>
          </form-item-mine>
          <form-item-mine label="手机号">
            <el-input v-model="usrModal.phone" size="mini" class="formWidth" placeholder="请输入内容"></el-input>
          </form-item-mine>
          <form-item-mine label="文件对应专业">
            <el-select v-model="usrModal.chooseZY_document" size="mini" class="formWidth" multiple collapse-tags
                       placeholder="请选择">
              <el-option v-for="item in usrModal.ZYData" :key="'chooseZY_usr'+item.value" :label="item.label"
                         :value="item.value"/>
            </el-select>
          </form-item-mine>
          <form-item-mine label="图纸对应专业">
            <el-select v-model="usrModal.chooseZY_img" size="mini" class="formWidth" multiple collapse-tags
                       placeholder="请选择">
              <el-option v-for="item in usrModal.ZYData" :key="'chooseZY_usr'+item.value" :label="item.label"
                         :value="item.value"/>
            </el-select>
          </form-item-mine>
          <form-item-mine label="允许借阅数">
            <el-input-number v-model="usrModal.borrowNum" size="mini" :min="0"></el-input-number>
          </form-item-mine>
          <form-item-mine label="默认语言 *">
            <el-radio v-model="usrModal.language" size="mini" label="CN">中文</el-radio>
            <el-radio v-model="usrModal.language" size="mini" label="EN">英文</el-radio>
          </form-item-mine>
          <form-item-mine label="审批流程权限">
            <el-radio v-model="usrModal.power" size="mini" :label="1">开启</el-radio>
            <el-radio v-model="usrModal.power" size="mini" :label="0">关闭</el-radio>
          </form-item-mine>
          <form-item-mine label="禁用">
            <el-radio v-model="usrModal.disabled" size="mini" :label="1">启用</el-radio>
            <el-radio v-model="usrModal.disabled" size="mini" :label="0">禁用</el-radio>
          </form-item-mine>
        </div>
        <div style="width:100%;text-align: center;margin-top:10px;">
          <el-button size="mini" type="primary" native-type="submit">确定</el-button>
          <el-button size="mini" @click="$set(usrModal,'show',false)">取消</el-button>
        </div>
      </form-mine>
    </el-dialog>

    <!--已删人员管理-->
    <el-dialog width="850px" :close-on-click-modal="false" title="已删人员管理" :visible.sync="delUsrModal.show">
      <div style="width:100%;height:400px;">
        <table-content
          filter="delUsrTable"
          @handleSelectionChange="delUsrModal.multipleSelection_delUsr=$event"
          :page_bottom="false"
          :page_head="true"
          :data="delUsrModal.tableData">
          <div slot="t_header">
            <div style="padding:7px 0" class="form-inline">
              <el-input v-model="delUsrModal.searchName" size="mini" class="tableInputText" style="width:200px;" placeholder="请输入名称"></el-input>
              <el-button type="primary" icon="el-icon-search" size="mini" class="tableInputCircleBtn" circle
                         @click="searchForDelUsrList" plain></el-button>
              <el-button type="primary" icon="el-icon-close" size="mini" class="tableInputCircleBtn" circle
                         @click="clearSearchForDelUsrList" plain></el-button>
              <!--恢复-->
              <el-button type="primary" @click="batchRecoveryUsrFun" size="mini" class="tableInputBtn" plain>恢复</el-button>
              <!--彻底删除-->
              <el-button type="danger" @click="batchDeepDelUsrFun" size="mini" class="tableInputBtn" plain>彻底删除</el-button>
            </div>
          </div>
        </table-content>
      </div>
    </el-dialog>


    <!--人员调转-->
    <el-dialog width="450px" :close-on-click-modal="false" title="人员调转" :visible.sync="personnelTransferModal.show">
      <div style="width:100%;">
        <div>是否保留用户已设置权限：
          <el-radio v-model="personnelTransferModal.keepUsrPower" :label="1">是</el-radio>
          <el-radio v-model="personnelTransferModal.keepUsrPower" :label="0">否</el-radio>
        </div>
        <div style="height:180px;overflow:auto">
          <Tree :data="treeData"
                ref="transferTree"
                style="flex-shrink:0"
                @selectionChange="personnelTransferModal.selection=$event"></Tree>
        </div>
        <div style="width:100%;text-align: center;margin-top:10px;">
          <el-button size="mini" type="primary" @click="submitPersonnelTransfer">确定</el-button>
          <el-button size="mini" @click="$set(personnelTransferModal,'show',false)">取消</el-button>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import '@/assets/css/icon.css'

  import {depTree} from './minxins/depTree'
  import {depAndPersonnelTable} from './minxins/depAndPersonnelTable'
  import {depOptions} from './minxins/depOption'
  import {usrOption} from './minxins/usrOption'

  import tableContent from "@/components_coment/tableContent";
  import rightMenu from "@/components_coment/rightMenu";
  import btnGroupMine from "@/components_coment/btnGroupMine";
  import btnGroupItem from "@/components_coment/btnGroupMine/btnGroupItem";

  export default {
    // name: "index",
    name: "companyAndUserManagement",
    mixins: [depTree, depAndPersonnelTable, depOptions, usrOption],
    components: {tableContent, rightMenu, btnGroupMine,btnGroupItem},
    data() {
      return {}
    },
    mounted() {
    },
    methods: {},
  }
</script>

<style lang="less" scope>
  @color: red;
  #depAndPersonnel {
    > .content {
      > div {
        height: 100%;
      }

      /*侧边栏*/
      > div:first-child {
        width: 200px;
        padding: 10px;
        overflow: auto;
        display: flex;

        > div {
          width: auto;
          height: auto
        }
      }

      > div:last-child {
        flex: 1;
      }
    }

    .formWidth {
      width: 200px;
    }
  }
</style>

