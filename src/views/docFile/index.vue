<template>
  <div class="fullscreen-parent-mine docFile">
    <div class="form-inline fullscreen-parent-mine">
      <!--侧边栏-->
      <div v-Resizable="{minWidth:100,minHeight:'100%'}" style="width:200px;height:100%;overflow:auto">
        <el-card shadow="hover" class="fullscreen-parent-mine"
                 :body-style="{padding:'10px',width:'100%',height:'100%',overflow:'auto',display: 'flex'}"
                 style="border-radius: 0;">
          <!--树形图-->
          <div style="width:auto;height:auto;" @contextmenu.prevent>
            <Tree :data="tree_side_data"
                  ref="sideTree"
                  style="flex-shrink:0"
                  @nodeContextMenu="rightClickMenu($event)"
                  @nodeExpand="onNodeExpand($event)"
                  @nodeClick="nodeClickFun($event)"></Tree>
          </div>
        </el-card>
      </div>
      <div style="flex:1;display:flex;flex-direction:column;"
           v-if="selection&&(selection.Type!='Folder'&&selection.Type!='CFolder')">
        <tab-mine :data="tabsList" :active_tab.sync="activeName"></tab-mine>
        <div style="flex:1;width:100%;">
          <!--项目表-->
          <table-content
            v-if="activeName=='pro'"
            filter="tablePro"
            @cell-click="cellClick_pro"
            @row-dbclick="dbclickFun_pro"
            @reloadTableForThisPage="reloadTableForThisPage_pro"
            :page_bottom="true"
            :page_head="true"
            :data="tableData_pro">
            <div slot="t_header">
              <div style="padding:7px 0" class="form-inline">
                <el-input v-model="search_pro.name" size="mini" class="tableInputText" placeholder="请输入名称"></el-input>
                <el-input v-model="search_pro.code" size="mini" class="tableInputText" placeholder="请输入项目编号"></el-input>
                <el-button type="primary" icon="el-icon-search" size="mini" class="tableInputCircleBtn" circle
                           plain></el-button>
                <el-button type="primary" icon="el-icon-close" size="mini" class="tableInputCircleBtn" circle
                           plain></el-button>
                <el-button type="primary" size="mini" class="tableInputBtn" plain>添加</el-button>
                <el-button type="danger" size="mini" class="tableInputBtn" plain>批量删除</el-button>
              </div>
            </div>
          </table-content>
          <!--条目表-->
          <table-content
            v-if="activeName=='item'"
            filter="tableItem"
            @cell-click="cellClick_item"
            @row-dbclick="dbclickFun_item"
            @reloadTableForThisPage="reloadTableForThisPage_item"
            :page_bottom="true"
            :page_head="true"
            :data="tableData_item">
            <div slot="t_header">
              <div style="padding:7px 0;align-items: center;" class="form-inline">
                <el-input v-model="search_item.name" size="mini" class="tableInputText" placeholder="请输入名称"></el-input>
                <el-input v-model="search_item.code" size="mini" class="tableInputText"
                          placeholder="请输入条目编号"></el-input>
                <el-checkbox v-model="search_item.isHaveFile" size="mini" class="tableInputCheck">包含电子文件</el-checkbox>
                <el-button type="primary" icon="el-icon-search" size="mini" class="tableInputCircleBtn" circle
                           plain></el-button>
                <el-button type="primary" icon="el-icon-close" size="mini" class="tableInputCircleBtn" circle
                           plain></el-button>
                <el-button type="primary" size="mini" class="tableInputBtn" plain>添加</el-button>
                <el-button type="danger" size="mini" class="tableInputBtn" plain>批量删除</el-button>
              </div>
            </div>
          </table-content>
          <!--卷内件-->
          <table-content
            v-if="activeName=='vol'"
            filter="tableVol"
            @cell-click="cellClick"
            @row-dbclick="dbclickFun"
            @reloadTableForThisPage="reloadTableForThisPage_pro"
            :page_bottom="true"
            :page_head="true"
            :data="tableData_pro">
            <div slot="t_header">
              <div style="height: 30px">

              </div>
            </div>
          </table-content>
          <!--电子文件-->
          <table-content
            v-if="activeName=='file'"
            filter="tableFile"
            @cell-click="cellClick"
            @row-dbclick="dbclickFun"
            @reloadTableForThisPage="reloadTableForThisPage_pro"
            :page_bottom="true"
            :page_head="true"
            :data="tableData_pro">
            <div slot="t_header">
              <div style="height: 30px">

              </div>
            </div>
          </table-content>
        </div>
      </div>
    </div>

    <!--右键菜单 树形图-->
    <right-menu ref="rightMenu" @changeRightMenu="changeMenu"/>

    <!--添加文件夹-->
    <el-dialog width="470px" :title="folderForm.title" :visible.sync="folderForm.showFolderModal">
      <form-mine @submit="submit_folder" ref="folderForm" :model="folderForm" size="mini" label-width="140px">
        <form-item-mine label="上级目录" v-if="folderForm.type=='add'&&rightNode_sideTree">
          {{rightNode_sideTree.text}}
        </form-item-mine>
        <form-item-mine
          v-for="item in folderForm.formContent"
          :label="item.name+(item.required?' *':'')">
          <el-input size="mini" style="width:250px" v-if="item.type=='text'" :required="item.required" v-model="item.value"
                    :placeholder="item.placeholder"></el-input>
          <el-input-number size="mini" v-else-if="item.type=='number'" :step="1" :required="item.required"
                           v-model.number="item.value"></el-input-number>
          <el-select size="mini" style="width:250px" v-else-if="item.type=='select'"
                     v-model="item.value"
                     :multiple="item.multiple"
                     collapse-tags
                     :placeholder="item.placeholder">
            <el-option
              v-for="item in item.data"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </form-item-mine>
        <form-item-mine label="是否存在项目 *" v-if="showTmp">
          <el-select size="mini" style="width:250px"
                     v-model="folderForm.other.HavePro"
                     :multiple="false"
                     collapse-tags
                     placeholder="请选择">
            <el-option label="有项目（使用项目的归档范围新建条目）" :value="1"></el-option>
            <el-option label="有项目（使用公共归档范围新建条目）" :value="2"></el-option>
            <el-option label="无项目（使用模板新建条目）" :value="0"></el-option>
          </el-select>
        </form-item-mine>
        <form-item-mine label="选择分类模板 *" v-if="showTmp">
          <el-select size="mini" style="width:250px" v-model="folderForm.other.AttrTypeId"
                     @change="getViewTmpData"
                     :multiple="true" collapse-tags placeholder="请选择">
            <el-option v-for="item in folderForm.other.AttrTypeData" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </form-item-mine>
        <form-item-mine label="选择显示模板 *" v-if="showTmp&&folderForm.other.showViewTmp">
          <el-select size="mini"
                     style="width:250px" v-model="folderForm.other.TmpIds" :multiple="true" collapse-tags
                     placeholder="请选择">
            <el-option v-for="item in folderForm.other.TmpData" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </form-item-mine>
        <form-item-mine label="维护 *" v-if="showTmp">
          <el-button size="mini" type="text" style="text-decoration:underline"
                     @click="$set(folderForm.other.proInfo,'showModal',true)"><b>项目相关维护*</b></el-button>
          <el-button size="mini" type="text" style="text-decoration:underline"
                     @click="$set(folderForm.other.itemInfo,'showModal',true)"><b>条目相关维护*</b></el-button>
        </form-item-mine>
        <form-item-mine>
          <el-button size="mini" type="primary" native-type="submit">确定</el-button>
          <el-button size="mini" @click="$set(folderForm,'showFolderModal',false)">取消</el-button>
        </form-item-mine>
      </form-mine>
    </el-dialog>
    <!--项目相关维护-->
    <el-dialog width="780px" :title="folderForm.other.proInfo.title" :visible.sync="folderForm.other.proInfo.showModal">
      <div style="width:100%;" class="form-inline">
        <div style="padding:10px;">
          <div class="title">选中项</div>
          <el-table @selection-change="changeSelectPro" :data="folderForm.other.proInfo.proTableData" height="400" border size="mini" style="width: 100%">
            <el-table-column type="selection" width="40"/>
            <el-table-column  prop="AttrName" label="标题" width="120"/>
            <el-table-column prop="WithPx" label="宽度" width="170">
              <template slot-scope="scope">
                <el-input-number size="mini" v-model="scope.row.WithPx" :step="10"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-tag size="mini" @click="upRow(scope.$index,scope.row,'pro')"><i class="el-icon-top"></i></el-tag>
                <el-tag size="mini" @click="downRow(scope.$index,scope.row,'pro')" style="margin-left: 5px"><i class="el-icon-bottom"></i></el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="optionBtn">
          <div class="itemBtn">
            <el-button
              icon="el-icon-back"
              @click="removeList('toLeft','pro',folderForm.other.proInfo.multiple_pre)"
              size="mini" plain title="移动到显示列"/>
          </div>
          <div class="itemBtn">
            <el-button
              icon="el-icon-right"
              @click="removeList('toRight','pro',folderForm.other.proInfo.multiple)"
              size="mini" plain title="移动到备选列"/>
          </div>
          <!--<div class="itemBtn">-->
          <!--  <el-button icon="el-icon-top" size="mini" plain title="左侧显示列选中项排序上移"/>-->
          <!--</div>-->
          <!--<div class="itemBtn">-->
          <!--  <el-button icon="el-icon-bottom" size="mini" plain title="左侧显示列选中项排序下移"/>-->
          <!--</div>-->
        </div>
        <div style="padding:10px;">
          <el-table @selection-change="changeSelectPro_pre" :data="folderForm.other.proInfo.proTableData_pre" height="400" size="mini" border style="width: 100%">
            <el-table-column type="selection" width="40"/>
            <el-table-column prop="AttrName" label="标题" width="135"/>
          </el-table>
        </div>
      </div>
      <div style="text-align: center;width:100%;margin-top: 10px;">
        <el-button type="primary" size="mini"  @click="$set(folderForm.other.proInfo,'showModal',false)">确定</el-button>
        <el-button size="mini" @click="$set(folderForm.other.proInfo,'showModal',false)">取消</el-button>
      </div>
    </el-dialog>
    <!--条目相关维护-->
    <el-dialog width="780px" :title="folderForm.other.itemInfo.title" :visible.sync="folderForm.other.itemInfo.showModal">
      <div style="width:100%;" class="form-inline">
        <div style="padding:10px;">
          <el-table @selection-change="changeSelectItem" :data="folderForm.other.itemInfo.itemTableData" height="400" border size="mini" style="width: 100%">
            <el-table-column type="selection" width="40"/>
            <el-table-column  prop="AttrName" label="标题" width="120"/>
            <el-table-column prop="WithPx" label="宽度" width="170">
              <template slot-scope="scope">
                <el-input-number size="mini" v-model="scope.row.WithPx" :step="10"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-tag size="mini" @click="upRow(scope.$index,scope.row,'item')"><i class="el-icon-top"></i></el-tag>
                <el-tag size="mini" @click="downRow(scope.$index,scope.row,'item')" style="margin-left: 5px"><i class="el-icon-bottom"></i></el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="optionBtn">
          <div class="itemBtn">
            <el-button
              icon="el-icon-back"
              @click="removeList('toLeft','item',folderForm.other.itemInfo.multiple_pre)"
              size="mini" plain title="移动到显示列"/>
          </div>
          <div class="itemBtn">
            <el-button
              icon="el-icon-right"
              @click="removeList('toRight','item',folderForm.other.itemInfo.multiple)"
              size="mini" plain title="移动到备选列"/>
          </div>
          <!--<div class="itemBtn">-->
          <!--  <el-button icon="el-icon-top" size="mini" plain title="左侧显示列选中项排序上移"/>-->
          <!--</div>-->
          <!--<div class="itemBtn">-->
          <!--  <el-button icon="el-icon-bottom" size="mini" plain title="左侧显示列选中项排序下移"/>-->
          <!--</div>-->
        </div>
        <div style="padding:10px;">
          <el-table @selection-change="changeSelectItem_pre" :data="folderForm.other.itemInfo.itemTableData_pre" height="400" size="mini" border style="width: 100%">
            <el-table-column type="selection" width="40"/>
            <el-table-column prop="AttrName" label="标题" width="135"/>
          </el-table>
        </div>
      </div>
      <div style="text-align: center;width:100%;margin-top: 10px;">
        <el-button type="primary" size="mini"  @click="$set(folderForm.other.itemInfo,'showModal',false)">确定</el-button>
        <el-button size="mini" @click="$set(folderForm.other.itemInfo,'showModal',false)">取消</el-button>
      </div>
    </el-dialog>

    <!--添加项目-->
    <el-dialog width="470px" :title="proForm.title" :visible.sync="proForm.showModal">
      <form-mine @submit="submit_pro" ref="folderForm" size="mini" label-width="140px">
        <form-item-mine label="上级目录" v-if="proForm.type=='add'&&rightNode_sideTree">
          {{rightNode_sideTree.text}}
        </form-item-mine>
        <form-item-mine
          v-for="item in proForm.formContent"
          :label="item.name+(item.require?' *':'')">
          <el-input size="mini" style="width:250px" v-if="item.type=='txt'" :disabled="item.isdisable" :required="item.require"  v-model="item.defvalue"/>
          <el-input-number size="mini" v-else-if="item.type=='int'" :disabled="item.isdisable" :step="1" :required="item.require" v-model.number="item.defvalue"/>
          <el-input-number size="mini" v-else-if="item.type=='float'" :disabled="item.isdisable" :step="0.1" :required="item.require" v-model.number="item.defvalue"/>
          <el-select size="mini" style="width:250px" v-else-if="item.type=='select'" :disabled="item.isdisable" v-model="item.defvalue" collapse-tags>
            <el-option
              v-for="item in item.data"
              :key="item.value"
              :label="item.text"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select size="mini" style="width:250px" v-else-if="item.type=='mulSelect'" :disabled="item.isdisable" v-model="item.defvalue" :multiple="true" collapse-tags>
            <el-option
              v-for="item in item.data"
              :key="item.value"
              :label="item.text"
              :value="item.value">
            </el-option>
          </el-select>
          <el-date-picker size="mini" style="width:250px" v-else-if="item.type=='date'" :disabled="item.isdisable" v-model="item.defvalue" :required="item.require" type="date" placeholder="选择日期"/>

        </form-item-mine>
        <form-item-mine>
          <el-button size="mini" type="primary" native-type="submit">确定</el-button>
          <el-button size="mini" @click="$set(folderForm,'showFolderModal',false)">取消</el-button>
        </form-item-mine>
      </form-mine>
    </el-dialog>


  </div>
</template>

<script>
  import tableContent from "@/components_coment/tableContent";
  import tabMine from "@/components_coment/tabMine";
  import rightMenu from "@/components_coment/rightMenu";
  // import formMine from "@/components_coment/formMine";
  // import formItemMine from "@/components_coment/formItemMine";

  import {tablePro} from './mixins/tablePro'
  import {tableItem} from './mixins/tableItem'
  import {tree} from './mixins/tree'
  import {navTabs} from './mixins/navTabs'
  import {modalOptions} from './mixins/modalOptions'

  export default {
    name: "index",
    components: {tableContent, tabMine, rightMenu},
    mixins: [tablePro, tableItem, tree, navTabs, modalOptions],
    data() {
      return {}
    },
    mounted() {
    },
    methods: {},
  }
</script>

<style scoped>
  .optionBtn {
    display: flex;
    flex-direction: column;
    justify-content: center
  }

  .optionBtn .itemBtn {
    padding: 10px;
  }
</style>
<style>
  .tableInputText {
    width: 120px;
    margin-left: 5px !important;

  }

  .tableInputCircleBtn {
    margin-left: 5px !important;
  }

  .tableInputBtn {
    margin-left: 5px !important;
  }

  .tableInputCheck {
    margin-left: 5px !important;
  }

</style>

