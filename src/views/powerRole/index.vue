<template>
  <div class="fullscreen-parent-mine powerRolePage">
    <div class="form-inline fullscreen-parent-mine">
      <div class="form-inline column" style="flex:1;height:100%;width:0;">
        <div class="form-inline column" style="width:100%;flex:1;height:0;">
          <div style="width:100%;padding: 15px;overflow:hidden;" title="部门人员列表>已有权限列表">
            <el-breadcrumb separator-class="el-icon-arrow-right ellipsisText">
              <el-breadcrumb-item>部门人员列表</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div style="flex:1;overflow:auto;width:100%;padding:0 20px;height:0">
            <div style="width:600px;">
              <Tree :data="userTree"
                    style="height:auto"
                    ref="userTree"
                    @selectionChange="selectionChange($event)"
                    @nodeExpand="onNodeExpand($event)"></Tree>
            </div>
          </div>
        </div>
        <div class="form-inline borderTop column" style="width:100%;height:300px;overflow:hidden"
             v-Resizable="{minWidth:'100%',minHeight:100}">
          <div style="width:100%;padding: 15px;overflow:hidden" title="部门人员列表>已有权限列表">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item>部门人员列表</el-breadcrumb-item>
              <el-breadcrumb-item>已有权限列表</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div style="flex:1;overflow:auto;width:100%;padding:0 20px;padding-bottom:20px;height:0">
            <table-content
              ref="powerList_already"
              filter="powerList_already"
              @rightClick="rightClick"
              @current-change="currentChange"
              :page_bottom="false"
              :page_head="true"
              @handleSelectionChange="multipleSelection=$event"
              :data="tableData">
              <div slot="t_header">
                <div style="padding-bottom:7px;align-items: center;" class="form-inline">
                  <!--添加权限-->
                  <el-button type="primary" icon="el-icon-plus" size="mini" class="tableInputCircleBtn"
                             @click="addPower"
                             :disabled="!showOptionButton"
                             plain>添加权限
                  </el-button>
                  <!--批量删除-->
                  <el-button type="danger" icon="el-icon-close" size="mini" class="tableInputCircleBtn"
                             @click="isDetermineDel(multipleSelection.map(item=>item.AuthId).join(','),multipleSelection.map(item=>item.OCATId).join(','))"
                             :disabled="!showOptionButton"
                             plain>批量删除
                  </el-button>
                </div>
              </div>
            </table-content>
          </div>
        </div>
      </div>
      <div class="borderLeft form-inline column" style="height:100%"
           v-Resizable="{minWidth:320,minHeight:'100%',maxWidth:800}">
        <div style="width:100%;padding: 15px;overflow:hidden;" title="部门人员列表>已有权限列表>操作权限">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>部门人员列表</el-breadcrumb-item>
            <el-breadcrumb-item>已有权限列表</el-breadcrumb-item>
            <el-breadcrumb-item>操作权限</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div style="flex:1;height:0;overflow:auto;padding:0 20px" v-loading="rightPowerTree.show">
          <Tree :data="rightPowerTree.data" v-if="currentTable"
                style="height:auto"
                ref="rightPowerTree"></Tree>
        </div>
      </div>
    </div>

    <!--添加权限弹框-->
    <el-dialog width="950px" title="权限设置" :close-on-click-modal="false" v-if="powerModal.show" :visible.sync="powerModal.show">
      <div class="form-inline" style="height:500px;align-items:stretch;margin-bottom:10px;">
        <!--选择分类节点-->
        <div class="borderStyle form-inline column" style="flex:1;border-right:none;">
          <div style="width:100%;padding: 10px;overflow:hidden;" title="选择分类节点">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item>选择分类节点</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div style="width:100%;padding: 0 10px;overflow:hidden;padding-bottom:5px;"
               class="form-inline;align-items:center;">
            <el-input v-model="powerModal.chooseClass.search.name" size="mini" placeholder="请输入内容" style="width:350px;">
              <template slot="append">
                <el-button icon="el-icon-search" size="mini" @click="search_fileTree_usrPowerOption">查找</el-button>
                <el-button size="mini" icon="el-icon-arrow-left" @click="search_fileTree_toPre_usrPowerOption">上一条
                </el-button>
                <el-button size="mini" @click="search_fileTree_toNext_usrPowerOption">下一条<i
                  class="el-icon-arrow-right el-icon--right"></i></el-button>
              </template>
            </el-input>
          </div>
          <div style="flex:1;height:0;width:100%;overflow: auto;" v-loading="powerModal.chooseClass.loading">
            <Tree :data="powerModal.chooseClass.data"
                  style="height:auto"
                  ref="chooseClass"
                  @selectionChange="selectionChange_chooseClass($event)"></Tree>
          </div>
        </div>
        <!--操作权限-->
        <div class="borderStyle form-inline column" style="width:250px;border-right:none;">
          <div style="width:100%;padding: 10px;overflow:hidden;" title="选择操作权限">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item>选择操作权限</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div style="width:100%;padding: 0 10px;overflow:hidden;"
               class="form-inline;align-items:center;">
            <el-button-group>
              <el-button type="primary" size="mini" plain icon="el-icon-s-claim" @click="checkedAllFun_usrPowerOption">
                全选
              </el-button>
              <el-button type="primary" size="mini" plain icon="el-icon-delete-solid"
                         @click="checkedClear_usrPowerOption">清空
              </el-button>
            </el-button-group>
          </div>
          <div style="flex:1;height:0;overflow:auto;" v-loading="powerModal.choosePower.loading">
            <Tree :data="powerModal.choosePower.data"
                  style="height:auto" :checkbox="true"
                  ref="choosePower"
                  @checkChange="checkChange_choosePower($event)"></Tree>
          </div>
        </div>
        <!--其他设置-->
        <div class="borderStyle form-inline column" style="width: 250px">
          <form-frame modal-title="允许查看密级">
            <div style="height: 100px;overflow: auto;">
              <el-checkbox-group v-model="powerModal.mj_checkbox">
                <div v-for="(item,key) in powerModal.mjData">
                  <el-checkbox  :key="'mjForView'+key" :label="item.value">
                    {{item.label}}
                  </el-checkbox>
                </div>
              </el-checkbox-group>
            </div>
          </form-frame>
          <form-frame modal-title="权限生效时间">
            <div style="font-size:12px;">
              <div>
                <el-checkbox v-model="powerModal.isOpenDate">启用</el-checkbox>
              </div>
              <p>开始日期：</p>
              <el-date-picker :disabled="!powerModal.isOpenDate"
                              value-format="yyyy-MM-dd"
                              style="width: auto!important;" size="mini"
                              v-model="powerModal.startDate"
                              type="date" placeholder="选择日期"></el-date-picker>
              <p>结束日期：</p>
              <el-date-picker :disabled="!powerModal.isOpenDate"
                              value-format="yyyy-MM-dd"
                              style="width: auto!important;" size="mini"
                              v-model="powerModal.endDate"
                              type="date" placeholder="选择日期"></el-date-picker>
            </div>
          </form-frame>
          <form-frame modal-title="部门权限设置" v-if="userSelection.type=='Dep'">
            <div style="padding:2px;">
              <el-radio v-model="powerModal.isSetAll" size="mini" :label="0">仅设置部门及其直属用户权限</el-radio>
            </div>
            <div style="padding:2px;">
              <el-radio v-model="powerModal.isSetAll" size="mini" :label="1">设置部门/全部下属部门/用户权限</el-radio>
            </div>
          </form-frame>
          <div class="form-inline column" style="flex:1;justify-content:center;align-items:center;">
            <div style="padding:2px;">
              <el-button type="primary" plain size="mini"
                         @click="()=>{$set(powerModal,'btnType','应用');submitPowerOptionFun(0)}">应用
              </el-button>
            </div>
            <div style="padding:2px;">
              <el-button type="primary" plain size="mini"
                         @click="()=>{$set(powerModal,'btnType','确定');submitPowerOptionFun(0)}">确定
              </el-button>
            </div>
            <div style="padding:2px;">
              <el-button type="danger" plain size="mini" @click="$set(powerModal,'show',false)">取消</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!--添加权限提交后报错的弹框-->
    <el-dialog width="600px" title="提示信息" :close-on-click-modal="false" :visible.sync="powerModal.errTip.show">
      <div v-if="powerModal.errTip.show">
        <div>{{powerModal.errTip.tip}}</div>
        <div style="width:100%;height:300px;margin-top:10px;">
          <table-content
            filter="tableFile_downErr"
            :page_bottom="false"
            :page_head="false"
            :data="powerModal.errTip.data">
          </table-content>
        </div>
        <div style="text-align:center;margin-top:10px;">
          <el-button size="mini" type="primary"
                     @click="()=>{submitPowerOptionFun(1);$set(powerModal.errTip,'show',false);}">覆盖
          </el-button>
          <el-button size="mini"
                     @click="()=>{submitPowerOptionFun(2,powerModal.errTip.successData);$set(powerModal.errTip,'show',false);}">
            跳过
          </el-button>
          <el-button size="mini" @click="$set(powerModal.errTip,'show',false)">取消</el-button>
        </div>
      </div>
    </el-dialog>

    <!--右键菜单 树形图-->
    <right-menu ref="rightMenu" @changeRightMenu="changeMenu"/>


    <!--部门删除前确认-->
    <el-dialog width="400px" :close-on-click-modal="false" title="部门删除前确认" :visible.sync="beforeDelPower.show">
      <form-mine @submit="submitDelPower" ref="depDelPower" size="mini" label-width="140px">
        <form-item-mine label="删除范围 *">
          <el-select v-model="beforeDelPower.range" size="mini" class="formWidth" placeholder="请选择">
            <el-option label="选定部门及直属用户" :value="0"/>
            <el-option label="选定部门及全部用户" :value="1"/>
          </el-select>
        </form-item-mine>
        <form-item-mine label="删除权限 *">
          <el-select v-model="beforeDelPower.power" size="mini" class="formWidth" placeholder="请选择">
            <el-option label="删除所有权限" :value="0"/>
            <el-option label="删除已设置的相同权限" :value="1"/>
          </el-select>
        </form-item-mine>
        <div style="width:100%;text-align: center">
          <el-button size="mini" type="primary" native-type="submit">确定</el-button>
          <el-button size="mini" @click="$set(beforeDelPower,'show',false)">取消</el-button>
        </div>
      </form-mine>
    </el-dialog>


  </div>

</template>

<script>
  import "@/assets/css/icon.css";


  import {userTree} from './mixins/userTree'
  import {powerTableData} from './mixins/powerTableData'
  import {modal} from './mixins/modal'

  import tableContent from "@/components_coment/tableContent";
  import formFrame from "@/components_coment/formFrame";
  import rightMenu from "@/components_coment/rightMenu";


  export default {
    name: "index",
    // name: "operationAuthorityManagement",
    mixins: [userTree, powerTableData, modal,],
    components: {tableContent, formFrame, rightMenu,},
    data() {
      return {
        loading: null,
      }
    },
    mounted() {
    },
    methods: {},
  }
</script>

<style scoped>
  .powerRolePage {
    overflow: hidden;
  }

</style>
