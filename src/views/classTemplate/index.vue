<template>
  <div id="classTemplate" class="fullscreen-parent-mine">
    <div class="fullscreen-parent-mine form-inline content">
      <!--侧边栏-->
      <div v-loading="treeLoading" class="borderStyle" v-Resizable="{minWidth:100,minHeight:'100%'}">
        <div @contextmenu.prevent>
          <Tree :data="treeData"
                style="flex-shrink:0"
                ref="tree"
                @nodeContextMenu="rightClickMenu($event)"
                @selectionChange="selectionChange($event)"
                @nodeExpand="onNodeExpand($event)"></Tree>
        </div>
      </div>
      <!--表格-->
      <div>
        <table-content
          v-if="selection&&selection.id!==0&&selection.id!==-1"
          filter="table"
          @rightClick="rightClick_table"
          @cell-click="cellClick_table"
          @row-dbclick="dbclickFun_table"
          @reloadTableForThisPage="reloadTableForThisPage"
          @handleSelectionChange="multipleSelection=$event"
          :page_bottom="true"
          :page_head="true"
          :data="tableData">
          <div slot="t_header">
            <div style="padding:7px 0" class="form-inline">
              <el-input v-model="search.name" size="mini" class="tableInputText" placeholder="请输入名称"></el-input>
              <el-button type="primary" icon="el-icon-search" size="mini" class="tableInputCircleBtn" circle
                         @click="searchFun"
                         plain></el-button>
              <el-button type="primary" icon="el-icon-close" size="mini" class="tableInputCircleBtn" circle
                         @click="clearSeachFun"
                         plain></el-button>
              <!--添加部门-->
              <el-button type="primary" @click="openAddAttr" size="mini" class="tableInputBtn"
                         :disabled="!showOptionButton" plain>添加
              </el-button>
            </div>
          </div>
        </table-content>
      </div>
    </div>

    <!--右键菜单 树形图-->
    <right-menu ref="rightMenu" @changeRightMenu="changeMenu"/>

    <!--添加属性-->
    <el-dialog width="470px" :close-on-click-modal="false" :title="attrModal.type=='add'?'添加属性':'修改属性'" :visible.sync="attrModal.show">
      <form-mine @submit="submitAttrOption" ref="folderForm" size="mini" label-width="140px">
        <form-item-mine label="中文名 *">
          <el-input v-model="attrModal.form.nameCN" required size="mini" class="formWidth" placeholder="请输入内容"></el-input>
        </form-item-mine>
        <form-item-mine label="英文名 *">
          <el-input v-model="attrModal.form.nameEN" required size="mini" class="formWidth" placeholder="请输入内容"></el-input>
        </form-item-mine>
        <form-item-mine label="字段名 *">
          <el-input v-model="attrModal.form.propName" :disabled="disabledEditAttr" required size="mini" class="formWidth" placeholder="请输入内容"></el-input>
        </form-item-mine>
        <form-item-mine label="类型 *">
          <el-select v-model="attrModal.form.dataType" size="mini" :disabled="disabledEditAttr" class="formWidth" placeholder="请选择">
            <el-option label="整型" value="int"/>
            <el-option label="长整型" value="bigint"/>
            <el-option label="字符型" value="nvarchar"/>
            <el-option label="日期型" value="date"/>
            <el-option label="日期时间型" value="datetime"/>
          </el-select>
        </form-item-mine>
        <form-item-mine label="最大长度 *" v-if="attrModal.form.dataType=='nvarchar'">
          <el-input-number v-model="attrModal.form.strLength" :disabled="disabledEditAttr" required size="mini" :min="1" :max="200"></el-input-number>
        </form-item-mine>
        <form-item-mine label="允许为null *">
          <el-radio v-model="attrModal.form.allowBeNull" :disabled="disabledEditAttr" size="mini" :label="1">允许</el-radio>
          <el-radio v-model="attrModal.form.allowBeNull" :disabled="disabledEditAttr" size="mini" :label="0">不允许</el-radio>
        </form-item-mine>
        <form-item-mine label="默认值 *" v-if="attrModal.form.dataType!=='date'&&attrModal.form.dataType!=='datetime'">
          <el-input-number v-if="attrModal.form.dataType=='int'||attrModal.form.dataType=='bigint'" :disabled="disabledEditAttr" required v-model="attrModal.form.defaultVal" size="mini" :min="1" :max="200"></el-input-number>
          <el-input v-if="attrModal.form.dataType=='nvarchar'" :disabled="disabledEditAttr" required v-model="attrModal.form.defaultVal" size="mini" class="formWidth" placeholder="请输入内容"></el-input>
        </form-item-mine>
        <div style="width:100%;text-align: center">
          <el-button size="mini" type="primary" native-type="submit">确定</el-button>
          <el-button size="mini" @click="$set(attrModal,'show',false)">取消</el-button>
        </div>
      </form-mine>
    </el-dialog>

    <!--添加分类模板-->
    <el-dialog width="470px" :close-on-click-modal="false" :title="classTmpModal.type=='add'?'添加分类模板':'修改分类模板'" :visible.sync="classTmpModal.show">
      <form-mine @submit="submitClassModule" ref="folderForm" size="mini" label-width="140px">
        <form-item-mine label="名称 *">
          <el-input v-model="classTmpModal.form.name" required size="mini" class="formWidth" placeholder="请输入内容"></el-input>
        </form-item-mine>
        <form-item-mine label="数据表名 *">
          <el-input v-model="classTmpModal.form.dataTableName" :disabled="disabledEditClass" required size="mini" class="formWidth" placeholder="请输入内容"></el-input>
        </form-item-mine>
        <div style="width:100%;text-align: center">
          <el-button size="mini" type="primary" native-type="submit">确定</el-button>
          <el-button size="mini" @click="$set(classTmpModal,'show',false)">取消</el-button>
        </div>
      </form-mine>
    </el-dialog>

  </div>
</template>

<script>
  import '@/assets/css/icon.css'

  import {classTree} from './minxins/classTree'
  import {classTable} from './minxins/classTable'
  import {classModal} from './minxins/classModal'

  import tableContent from "@/components_coment/tableContent";
  import rightMenu from "@/components_coment/rightMenu";
  import btnGroupMine from "@/components_coment/btnGroupMine";
  import btnGroupItem from "@/components_coment/btnGroupMine/btnGroupItem";

  export default {
    name: "classificationManagement",
    mixins: [classTree, classTable,classModal],
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
  #classTemplate {
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

