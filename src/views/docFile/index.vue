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
           v-if="$store.state.stateMine.logState=='login'&&selection&&(selection.Type!='Folder'&&selection.Type!='CFolder')&&selection.id">
        <tab-mine :data="tabsList" :active_tab.sync="activeName"></tab-mine>
        <div style="flex:1;width:100%;">
          <!--项目表-->
          <table-content
            v-if="activeName=='pro'"
            filter="tablePro"
            @rightClick="rightClick_pro"
            @cell-click="cellClick_pro"
            @row-dbclick="dbclickFun_pro"
            @reloadTableForThisPage="reloadTable_pro"
            @handleSelectionChange="multipleSelection_pro=$event"
            :page_bottom="true"
            :page_head="true"
            :data="tableData_pro">
            <div slot="t_header">
              <div style="padding:7px 0" class="form-inline">
                <el-input v-model="search_pro.name" size="mini" class="tableInputText" placeholder="请输入名称"></el-input>
                <el-input v-model="search_pro.code" size="mini" class="tableInputText" placeholder="请输入项目编号"></el-input>
                <el-button type="primary" icon="el-icon-search" size="mini" class="tableInputCircleBtn" circle
                           @click="searchFun_pro"
                           plain></el-button>
                <el-button type="primary" icon="el-icon-close" size="mini" class="tableInputCircleBtn" circle
                           @click="clearSeachFun_pro"
                           plain></el-button>
                <el-button type="primary" size="mini" class="tableInputBtn" plain :disabled="!showAddButton_pro"
                           @click="addProInfo">添加
                </el-button>
                <el-button type="danger" size="mini" class="tableInputBtn"
                           :disabled="!showDelButton_pro"
                           @click="delProsFun"
                           plain>批量删除
                </el-button>
              </div>
            </div>
          </table-content>
          <!--条目表-->
          <table-content
            v-if="activeName=='item'"
            filter="tableItem"
            @rightClick="rightClick_item"
            @cell-click="cellClick_item"
            @row-dbclick="dbclickFun_item"
            @reloadTableForThisPage="reloadTable_item"
            @handleSelectionChange="multipleSelection_item=$event"
            :page_bottom="true"
            :page_head="true"
            :data="tableData_item">
            <div slot="t_header">
              <div style="padding:7px 0;align-items: center;" class="form-inline">
                <el-input v-model="search_item.name" size="mini" class="tableInputText" placeholder="请输入名称"></el-input>
                <el-input v-model="search_item.code" size="mini" class="tableInputText"
                          placeholder="请输入档案号"></el-input>
                <el-checkbox v-model="search_item.haveVersion" size="mini" class="tableInputCheck">包含历史版本</el-checkbox>
                <el-checkbox v-model="search_item.isHaveFile" size="mini" class="tableInputCheck">包含电子文件</el-checkbox>
                <!--搜索-->
                <el-button type="primary" icon="el-icon-search" size="mini" class="tableInputCircleBtn" circle
                           @click="searchFun_item"
                           plain></el-button>
                <!--取消搜索-->
                <el-button type="primary" icon="el-icon-close" size="mini" class="tableInputCircleBtn" circle
                           @click="clearSeachFun_item"
                           plain></el-button>
                <!--添加-->
                <el-button type="primary" size="mini" class="tableInputBtn"
                           @click="getItemAttr_first" :disabled="!showAddButton_item"
                           plain>添加
                </el-button>
                <el-button type="danger" size="mini" class="tableInputBtn"
                           :disabled="!showDelButton_item"
                           @click="delItems"
                           plain>批量删除
                </el-button>
                <!--<el-button type="primary" size="mini" class="tableInputBtn"-->
                <!--           plain>提晒-->
                <!--</el-button>-->
              </div>
            </div>
          </table-content>
          <!--卷内件-->
          <table-content
            v-if="activeName=='vol'"
            filter="tableVol"
            @cell-click="cellClick_vol"
            @row-dbclick="dbclickFun_vol"
            @reloadTableForThisPage="reloadTable_vol"
            :page_bottom="true"
            :page_head="true"
            :data="tableData_vol">
            <div slot="t_header">
              <div style="padding:7px 0;align-items: center;" class="form-inline">
                <el-input v-model="search_vol.name" size="mini" class="tableInputText" placeholder="请输入名称"></el-input>
                <el-input v-model="search_vol.code" size="mini" class="tableInputText"
                          placeholder="请输入档案号"></el-input>
                <el-checkbox v-model="search_vol.haveVersion" size="mini" class="tableInputCheck">包含历史版本</el-checkbox>
                <el-checkbox v-model="search_vol.isHaveFile" size="mini" class="tableInputCheck">包含电子文件</el-checkbox>
                <el-button type="primary" icon="el-icon-search" size="mini" class="tableInputCircleBtn" circle
                           @click="searchFun_vol"
                           plain></el-button>
                <el-button type="primary" icon="el-icon-close" size="mini" class="tableInputCircleBtn" circle
                           @click="clearSeachFun_vol"
                           plain></el-button>
                <el-button type="primary" size="mini" class="tableInputBtn" plain>添加</el-button>
                <el-button type="danger" size="mini" class="tableInputBtn" plain>批量删除</el-button>
              </div>
            </div>
          </table-content>
          <!--电子文件-->
          <table-content
            v-if="activeName=='file'"
            filter="tableFile"
            @rightClick="rightClick_file"
            @cell-click="cellClick_file"
            @row-dbclick="dbclickFun_file"
            @reloadTableForThisPage="reloadTable_file"
            @handleSelectionChange="multipleSelection_file=$event"
            :page_bottom="true"
            :page_head="true"
            :data="tableData_file">
            <div slot="t_header">
              <div style="padding:7px 0;align-items: center;" class="form-inline">
                <el-input v-model="search_file.name" size="mini" class="tableInputText" placeholder="请输入名称"></el-input>
                <el-button type="primary" icon="el-icon-search" size="mini" class="tableInputCircleBtn"
                           @click="reloadTableForThisPage_file(search_file.id,search_file.Type,search_file.name,1)"
                           circle
                           plain></el-button>
                <el-button type="primary" icon="el-icon-close" size="mini" class="tableInputCircleBtn" circle
                           @click="clearSeachFun_file"
                           plain></el-button>
                <el-button type="primary" size="mini" class="tableInputBtn" @click="uploadFun_file"
                           :disabled="!showUploadButton_file" plain>
                  上传
                </el-button>
                <el-button type="primary" size="mini" class="tableInputBtn" @click="downFilesFun" plain>批量下载</el-button>
                <el-button type="danger" size="mini" class="tableInputBtn" @click="delFiles" plain>批量删除</el-button>
              </div>
            </div>
          </table-content>
        </div>
      </div>
    </div>

    <!--右键菜单 树形图-->
    <right-menu ref="rightMenu" @changeRightMenu="changeMenu"/>

    <!--添加文件夹-->
    <el-dialog width="470px" :close-on-click-modal="false" :title="folderForm.title" :visible.sync="folderForm.showFolderModal">
      <form-mine @submit="submit_folder" ref="folderForm" :model="folderForm" size="mini" label-width="140px">
        <form-item-mine label="上级目录" v-if="folderForm.type=='add'&&rightNode_sideTree">
          {{rightNode_sideTree.text}}
        </form-item-mine>
        <form-item-mine
          v-for="item in folderForm.formContent"
          :label="item.name+(item.required?' *':'')">
          <el-input size="mini" style="width:250px" v-if="item.type=='text'" :required="item.required"
                    v-model="item.value"
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
                     v-if="folderForm.other.HavePro!=0"
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
    <el-dialog width="780px" :close-on-click-modal="false" :title="folderForm.other.proInfo.title" :visible.sync="folderForm.other.proInfo.showModal">
      <div style="width:100%;" class="form-inline">
        <div style="padding:10px;">
          <div class="title">选中项</div>
          <el-table @selection-change="changeSelectPro" :data="folderForm.other.proInfo.proTableData" height="400"
                    border size="mini" style="width: 100%">
            <el-table-column type="selection" width="40"/>
            <el-table-column prop="AttrName" label="标题" width="120"/>
            <el-table-column prop="WithPx" label="宽度" width="170">
              <template slot-scope="scope">
                <el-input-number size="mini" v-model="scope.row.WithPx" :step="10"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-tag size="mini" @click="upRow(scope.$index,scope.row,'pro')"><i class="el-icon-top"></i></el-tag>
                <el-tag size="mini" @click="downRow(scope.$index,scope.row,'pro')" style="margin-left: 5px"><i
                  class="el-icon-bottom"></i></el-tag>
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
          <div class="title">待选项</div>
          <el-table @selection-change="changeSelectPro_pre" :data="folderForm.other.proInfo.proTableData_pre"
                    height="400" size="mini" border style="width: 100%">
            <el-table-column type="selection" width="40"/>
            <el-table-column prop="AttrName" label="标题" width="135"/>
          </el-table>
        </div>
      </div>
      <div style="text-align: center;width:100%;margin-top: 10px;">
        <el-button type="primary" size="mini" @click="$set(folderForm.other.proInfo,'showModal',false)">确定</el-button>
        <el-button size="mini" @click="$set(folderForm.other.proInfo,'showModal',false)">取消</el-button>
      </div>
    </el-dialog>
    <!--条目相关维护-->
    <el-dialog width="780px" :close-on-click-modal="false" :title="folderForm.other.itemInfo.title"
               :visible.sync="folderForm.other.itemInfo.showModal">
      <div style="width:100%;" class="form-inline">
        <div style="padding:10px;">
          <div class="title">选中项</div>
          <el-table @selection-change="changeSelectItem" :data="folderForm.other.itemInfo.itemTableData" height="400"
                    border size="mini" style="width: 100%">
            <el-table-column type="selection" width="40"/>
            <el-table-column prop="AttrName" label="标题" width="120"/>
            <el-table-column prop="WithPx" label="宽度" width="170">
              <template slot-scope="scope">
                <el-input-number size="mini" v-model="scope.row.WithPx" :step="10"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-tag size="mini" @click="upRow(scope.$index,scope.row,'item')"><i class="el-icon-top"></i></el-tag>
                <el-tag size="mini" @click="downRow(scope.$index,scope.row,'item')" style="margin-left: 5px"><i
                  class="el-icon-bottom"></i></el-tag>
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
          <div class="title">待选项</div>
          <el-table @selection-change="changeSelectItem_pre" :data="folderForm.other.itemInfo.itemTableData_pre"
                    height="400" size="mini" border style="width: 100%">
            <el-table-column type="selection" width="40"/>
            <el-table-column prop="AttrName" label="标题" width="135"/>
          </el-table>
        </div>
      </div>
      <div style="text-align: center;width:100%;margin-top: 10px;">
        <el-button type="primary" size="mini" @click="$set(folderForm.other.itemInfo,'showModal',false)">确定</el-button>
        <el-button size="mini" @click="$set(folderForm.other.itemInfo,'showModal',false)">取消</el-button>
      </div>
    </el-dialog>

    <!--添加项目-->
    <el-dialog width="470px" :title="proForm.title" :close-on-click-modal="false" :visible.sync="proForm.showModal">
      <form-mine @submit="submit_pro" ref="folderForm" size="mini" label-width="140px">
        <form-item-mine label="上级目录" v-if="proForm.type=='add'&&selection">
          {{selection.text}}
        </form-item-mine>
        <form-item-mine
          v-for="item in proForm.formContent"
          :label="item.name+(item.require?' *':'')">
          <el-input size="mini" style="width:250px" v-if="item.type=='txt'" :disabled="item.isdisable"
                    :required="item.require" v-model="item.defvalue"/>
          <el-input-number size="mini" v-else-if="item.type=='int'" :disabled="item.isdisable" :step="1"
                           :required="item.require" v-model.number="item.defvalue"/>
          <el-input-number size="mini" v-else-if="item.type=='float'" :disabled="item.isdisable" :step="0.1"
                           :required="item.require" v-model.number="item.defvalue"/>
          <el-select size="mini" style="width:250px" v-else-if="item.type=='select'" :disabled="item.isdisable"
                     v-model="item.defvalue" collapse-tags>
            <el-option
              v-for="item in item.data"
              :key="item.value"
              :label="item.text"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select size="mini" style="width:250px" v-else-if="item.type=='mulSelect'" :disabled="item.isdisable"
                     v-model="item.defvalue" :multiple="true" collapse-tags>
            <el-option
              v-for="item in item.data"
              :key="item.value"
              :label="item.text"
              :value="item.value">
            </el-option>
          </el-select>
          <el-date-picker size="mini" style="width:250px" v-else-if="item.type=='date'" value-format="yyyy-MM-dd"
                          :disabled="item.isdisable" v-model="item.defvalue" :required="item.require" type="date"
                          placeholder="选择日期"/>

        </form-item-mine>
        <div style="width:100%;text-align: center">
          <el-button size="mini" type="primary" native-type="submit">确定</el-button>
          <el-button size="mini" @click="$set(proForm,'showModal',false)">取消</el-button>
        </div>
      </form-mine>
    </el-dialog>

    <!--删除文件夹提示-->
    <el-dialog width="470px" title="删除文件夹提示" :close-on-click-modal="false" :visible.sync="delModal_folder.show">
      <form @submit.prevent="submit_del_folder">
        <div><span>{{delModal_folder.tip}}</span></div>
        <div style="padding:10px 0;">删除理由：</div>
        <el-input
          required
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="delModal_folder.desc">
        </el-input>
        <div style="text-align:center;margin-top:10px;">
          <el-button size="mini" type="primary" native-type="submit">确定</el-button>
          <el-button size="mini" @click="$set(delModal_folder,'show',false)">取消</el-button>
        </div>
      </form>
    </el-dialog>

    <!--删除项目提示-->
    <el-dialog width="470px" title="删除项目提示" :close-on-click-modal="false" :visible.sync="delModal_pro.show">
      <form @submit.prevent="submit_del_pro_tree">
        <div><span>{{delModal_pro.tip}}</span></div>
        <div style="padding:10px 0;">删除理由：</div>
        <el-input
          required
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="delModal_pro.desc">
        </el-input>
        <div style="text-align:center;margin-top:10px;">
          <el-button size="mini" type="primary" native-type="submit">确定</el-button>
          <el-button size="mini" @click="$set(delModal_pro,'show',false)">取消</el-button>
        </div>
      </form>
    </el-dialog>

    <!--下级节点排序弹框-->
    <el-dialog width="350px" title="下级节点排序" :close-on-click-modal="false" :visible.sync="nodeSort.show">
      <form @submit.prevent="submit_nodeSort">
        <el-table :data="nodeSort.data" height="250" border style="width: 100%">
          <el-table-column prop="text" label="名称" width="180"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-tag size="mini" @click="upRow(scope.$index,scope.row,'sort')"><i class="el-icon-top"></i></el-tag>
              <el-tag size="mini" @click="downRow(scope.$index,scope.row,'sort')" style="margin-left: 5px"><i
                class="el-icon-bottom"></i></el-tag>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align:center;margin-top:10px;">
          <el-button size="mini" type="primary" native-type="submit">确定</el-button>
          <el-button size="mini" @click="$set(nodeSort,'show',false)">取消</el-button>
        </div>
      </form>
    </el-dialog>

    <!--添加条目 第一个弹框 有项目文件夹 大类小类树形图-->
    <el-dialog width="750px" title="选择分类" :close-on-click-modal="false" :visible.sync="itemForm.first.havProShow">
      <form @submit.prevent="submit_chooseCls_item">
        <div style="width:100%;height:300px;overflow:auto;">
          <Tree :data="itemForm.first.chooseClsData"
                @selectionChange="$set(itemForm.first,'chooseClsValue',$event)"></Tree>
        </div>
        <div style="text-align:center;margin-top:10px;">
          <el-button size="mini" type="primary" native-type="submit">确定</el-button>
          <el-button size="mini" @click="$set(itemForm.first,'havProShow',false)">取消</el-button>
        </div>
      </form>
    </el-dialog>

    <!--添加条目 第一个弹框 无项目文件夹 选择模板-->
    <el-dialog width="350px" title="选择模板" :close-on-click-modal="false"  :visible.sync="itemForm.first.noProShow">
      <form @submit.prevent="submit_chooseTmp_item">
        <el-select v-model="itemForm.first.chooseTmpValue" style="width:100%;" placeholder="请选择">
          <el-option
            v-for="item in itemForm.first.chooseTmpData"
            :key="item.value"
            :label="item.text"
            :value="item.value">
          </el-option>
        </el-select>
        <div style="text-align:center;margin-top:10px;">
          <el-button size="mini" type="primary" native-type="submit">确定</el-button>
          <el-button size="mini" @click="$set(itemForm.first,'noProShow',false)">取消</el-button>
        </div>
      </form>
    </el-dialog>

    <!--添加条目/修改条目  第二个弹框-->
    <el-dialog width="500px" :close-on-click-modal="false" :title="itemForm.second.type=='add'?'添加条目':'修改条目'" :visible.sync="itemForm.second.show">
      <form-mine @submit="submit_item" ref="folderForm" size="mini" label-width="140px">
        <div style="height:350px;overflow:auto">
          <form-item-mine
            v-for="(item,key) in itemForm.second.formContent"
            :label="item.name+(item.require?' *':'')">
            <template v-if="!item.isdisable">
              <el-input size="mini" style="width:250px" v-if="item.type=='txt'&&item.prop!='ItemArchNo'"
                        :disabled="item.isdisable"
                        :required="item.require" v-model="item.defvalue"/>
              <template v-else-if="item.type=='txt'&&item.prop=='ItemArchNo'">
                <el-input size="mini" style="width:180px" :disabled="item.isdisable"
                          :required="item.require" v-model="item.defvalue"/>
                <el-button size="mini" @click="createCode_item" style="width:70px;"
                           :disabled="itemForm.second.data.ClsCode=='drawing'" :loading="createCodeLoading_item">
                  生成
                </el-button>
              </template>

              <el-input-number size="mini" v-else-if="item.type=='int'" :disabled="item.isdisable" :step="1"
                               :required="item.require" v-model.number="item.defvalue"/>
              <el-input-number size="mini" v-else-if="item.type=='float'" :disabled="item.isdisable" :step="0.1"
                               :required="item.require" v-model.number="item.defvalue"/>
              <el-select size="mini" v-else-if="item.type=='select'" :key="'itemFormSecond'+item.prop+key"
                         style="width:250px"
                         v-model="item.defvalue" collapse-tags>
                <el-option
                  v-for="item in item.data"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value">
                </el-option>
              </el-select>

              <el-select size="mini" v-else-if="item.type=='mulSelect'" style="width:250px"
                         v-model="item.defvalue" :multiple="true" collapse-tags>
                <el-option
                  v-for="item in item.data"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value">
                </el-option>
              </el-select>

              <el-date-picker size="mini" style="width:250px" v-else-if="item.type=='date'" value-format="yyyy-MM-dd"
                              :disabled="item.isdisable" v-model="item.defvalue" :required="item.require" type="date"
                              placeholder="选择日期"/>

            </template>
            <template v-else>
              <div>{{item.deftext}}</div>
            </template>

          </form-item-mine>
        </div>

        <div style="width:100%;text-align:center;margin-top:10px;">
          <el-button size="mini" type="primary" native-type="submit">确定</el-button>
          <el-button size="mini" @click="$set(itemForm.second,'show',false)">取消</el-button>
        </div>
      </form-mine>
    </el-dialog>

    <!--删除条目提示 - 右键-->
    <el-dialog width="470px" :close-on-click-modal="false" title="删除条目提示" :visible.sync="delModal_item.show">
      <form @submit.prevent="submit_del_item">
        <div><span>{{delModal_item.tip}}</span></div>
        <div style="padding:10px 0;">删除理由：</div>
        <el-input
          required
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="delModal_item.desc">
        </el-input>
        <div style="text-align:center;margin-top:10px;">
          <el-button size="mini" type="primary" native-type="submit">确定</el-button>
          <el-button size="mini" @click="$set(delModal_item,'show',false)">取消</el-button>
        </div>
      </form>
    </el-dialog>

    <!--删除电子文件提示-->
    <el-dialog width="470px" :close-on-click-modal="false" title="删除提示" :visible.sync="tipModal_file.delTipShow">
      <form @submit.prevent="realDelFile(tipModal_file.delData)">
        <div><span>确定删除电子文件吗？如确认删除，请填写删除理由后提交。</span></div>
        <div style="padding:10px 0;">删除理由：</div>
        <el-input
          required
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="tipModal_file.desc">
        </el-input>
        <div style="text-align:center;margin-top:10px;">
          <el-button size="mini" type="primary" native-type="submit">确定</el-button>
          <el-button size="mini" @click="$set(tipModal_file,'delTipShow',false)">取消</el-button>
        </div>
      </form>
    </el-dialog>


    <!--删除条目提示 - 批量删除-->
    <el-dialog width="470px" :close-on-click-modal="false" title="删除条目提示" :visible.sync="delModal_items.show">
      <form @submit.prevent="submit_del_items">
        <div><span>{{delModal_items.tip}}</span></div>
        <div style="padding:10px 0;">删除理由：</div>
        <el-input
          required
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="delModal_items.desc">
        </el-input>
        <div style="text-align:center;margin-top:10px;">
          <el-button size="mini" type="primary" native-type="submit">确定</el-button>
          <el-button size="mini" @click="$set(delModal_items,'show',false)">取消</el-button>
        </div>
      </form>
    </el-dialog>


    <!--电子文件 - 上传-->
    <el-dialog width="900px" :close-on-click-modal="false" title="上传列表" :visible.sync="uploadModal_file.show">
      <form @submit.prevent="submitFun_autoUpload">
        <div>
          <div style="height:100%;width:100%" class="upload-demo-mine">
            <div class="form-inline el-upload-dragger-mine"
                 v-loading="uploadModal_file.dragoverShow"
                 element-loading-text="拖动至此区域，放置预传输列表"
                 element-loading-spinner="el-icon-circle-plus"
                 element-loading-background="rgba(255, 255, 255, 0.8)"
                 @dragover.prevent="$set(uploadModal_file,'dragoverShow',true)"
                 @blur.prevent="$set(uploadModal_file,'dragoverShow',false)"
                 @mouseleave.prevent="$set(uploadModal_file,'dragoverShow',false)"
                 @drop.prevent="uploadFun"
                 style="width: 100%; height: 250px;position: relative">
              <div style="width: 100%; height: 100%;padding:10px">
                <div class="fileListDiv" style="width: 100%; height: 100%;overflow: auto;">
                  <table style="border: none; width: 100%">
                    <thead>
                    <tr>
                      <td style="width: 230px">名称</td>
                      <td>路径</td>
                      <td style="width: 150px">根目录</td>
                      <td style="width: 120px">状态</td>
                    </tr>
                    </thead>
                    <tr
                      v-for="(item, key) in fileListForView"
                      :class="{ checkedLi: item.check }"
                      @click="item.check = !item.check"
                      :key="'file_up' + key">
                      <td :title="item.name">{{ item.name }}</td>
                      <td :title="item.path">{{ item.path }}</td>
                      <td :title="item.path?item.path.split('/')[0]:''">
                        <div class="form-inline" v-if="item.path">
                          <div style="width:15px;" class="icon-folder-mine"></div>
                          <div class="ellipsisText" style="flex:1;margin-left:2px;">{{
                            item.path?item.path.split('/')[0]:'' }}
                          </div>
                        </div>
                      </td>
                      <!--<td-->
                      <!--  :title="item.version"-->
                      <!--  @dblclick="item.type = item.type == 'text' ? 'input' : 'text'">-->
                      <!--  <template v-if="item.type == 'text'">{{item.version }}</template>-->
                      <!--  <template v-else>-->
                      <!--    <input type="text" @keyup.enter="item.type = item.type == 'text' ? 'input' : 'text'" style="width: 100%" v-model="item.version"/>-->
                      <!--  </template>-->
                      <!--</td>-->
                      <td :title="item.msg">
                        <el-link :underline="false" :type="
                        item.state == 0? 'info'
                          : item.state == 1
                          ? 'success'
                          : item.state == 2
                          ? 'warning'
                          : item.state == 3
                          ? 'danger'
                          : 'danger'
                      "
                        >{{ item.msg }}
                        </el-link>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
            <div class="el-upload__tip-mine">请选择并拖动【文件】及【文件夹】至上传列表中，或通过下方【选择文件】或【选择文件夹】按钮操作上传</div>
          </div>
          <el-button-group style="margin-top: 10px">
            <el-button size="mini" type="primary" @click="triggerChooseFile">选择文件</el-button>
            <input
              type="file"
              multiple="multiple"
              class="hide"
              id="fileId"
              @change="getFile($event)"
              ref="chooseFile_real"/>
            <el-button size="mini" type="primary" @click="triggerChooseFolder">选择文件夹</el-button>
            <input
              type="file"
              webkitdirectory
              multiple="multiple"
              class="hide"
              id="folderId"
              @change="getFolder($event)"
              ref="chooseFolder_real"/>
            <el-button size="mini" type="primary" @click="removeChoose('')">移除选中项</el-button>
            <el-button size="mini" type="primary" @click="chooseAllFiles">全选</el-button>
            <el-button size="mini" type="primary" @click="clearAllFiles">取消选择</el-button>
          </el-button-group>
          <div style="margin-top: 10px; width: 100%">
            <form-mine class="margin-top" label-width="170px" size="mini" border>
              <form-item-mine label="是否上传文件夹根目录：">
                <div class="form-inline" style="width: 200px; align-items: center;">
                  <label class="form-inline" style="align-items: center"><input type="radio" v-model="isUpRoot_upload"
                                                                                value="1"/>上传</label>
                  <label class="form-inline" style="margin-left: 5px;align-items: center"><input type="radio"
                                                                                                 v-model="isUpRoot_upload"
                                                                                                 value="0"/>不上传</label>
                </div>
              </form-item-mine>
              <form-item-mine label="PDF类型：" v-if="dbclickData_item&&dbclickData_item.IsDraw  == 1">
                <div class="form-inline" style="width: 150px; align-items: center;">
                  <label class="form-inline" style="align-items: center"><input
                    type="radio"
                    v-model="pdfType_upload"
                    value="1"/>红章</label>
                  <label class="form-inline" style="margin-left: 5px;align-items: center">
                    <input
                      type="radio"
                      v-model="pdfType_upload"
                      value="2"/>黑章</label>
                </div>
              </form-item-mine>
            </form-mine>
          </div>
        </div>
        <div style="text-align:center;margin-top:10px;">
          <el-button size="mini" type="primary" native-type="submit">确定</el-button>
          <el-button size="mini" @click="$set(uploadModal_file,'show',false)">取消</el-button>
        </div>
      </form>
    </el-dialog>


    <!--查看PDF-->
    <el-dialog width="800px" :close-on-click-modal="false" title="查看PDF" :visible.sync="view_file.showPdf">
      <form @submit.prevent>
        <div style="width:100%" v-if="view_file.showPdf&&fileUrl">
          <div style="text-align: center;">
            <el-button-group>
              <el-button type="primary" icon="el-icon-arrow-left" size="mini" @click="prePage">上一页</el-button>
              <el-button type="primary" size="mini" @click="nextPage">下一页<i
                class="el-icon-arrow-right el-icon--right"></i>
              </el-button>
            </el-button-group>
            <div style="margin-top: 10px; color: #409EFF">{{ pageNum_pdf }} / {{ pageTotalNum }}</div>
          </div>
          <div style="width:100%;height:500px;overflow: auto">
            <pdf
              :page="pageNum_pdf"
              :src="fileUrl"
              @progress="loadedRatio = $event"
              @num-pages="pageTotalNum=$event"></pdf>
            <!--<img src="static/test.JPG" style="width:100%;height:500px;" alt="">-->
          </div>
        </div>
      </form>
    </el-dialog>

    <!--查看图片-->
    <el-dialog width="800px" :close-on-click-modal="false" title="查看图片" :visible.sync="view_file.showImg">
      <div @contextmenu.prevent>
        <img v-if="fileType=='img'&&fileUrl" :src="fileUrl" width="100%;" alt="">
      </div>
    </el-dialog>

    <!--查看excel-->
    <el-dialog width="800px" :close-on-click-modal="false" title="查看表格" :visible.sync="view_file.showExcel">
      <div @contextmenu.prevent style="width:100%;height:500px;">
        <iframe v-if="fileType=='excel'&&fileUrl" :src="'static/extension/viewExcel/index.html?url=/'+fileUrl"
                style="width:100%;height:100%;overflow: auto" frameborder="0"></iframe>
      </div>
    </el-dialog>

    <!--查看Word文档-->
    <el-dialog width="800px" :close-on-click-modal="false" title="查看Word文档" :visible.sync="view_file.showWord">
      <div @contextmenu.prevent style="width:100%;">
        <view-word v-if="fileType=='word'&&fileUrl" :url="fileUrl"></view-word>
      </div>
    </el-dialog>

    <!--下载失败/批量删除失败弹框-->
    <el-dialog :close-on-click-modal="false" :width="(tipModal_file.errData&&tipModal_file.errData.data.length>0)?'600px':'350px'" title="提示信息"
               :visible.sync="tipModal_file.showErr">
      <div>
        <div>{{tipModal_file.errTip}}</div>
        <div style="width:100%;height:300px;margin-top:10px;"
             v-if="tipModal_file.showErr&&tipModal_file.errData&&tipModal_file.errData.data.length>0">
          <table-content
            filter="tableFile_downErr"
            :page_bottom="false"
            :page_head="false"
            :data="tipModal_file.errData">
          </table-content>
        </div>
        <div style="text-align:center;margin-top:10px;">
          <el-button size="mini" type="primary"
                     v-if="tipModal_file.successData.length>0"
                     @click="()=>{$set(tipModal_file,'showErr',false);keepFun_file();}">继续
          </el-button>
          <el-button size="mini" @click="$set(tipModal_file,'showErr',false)">取消</el-button>
        </div>
      </div>
    </el-dialog>

    <!--批量删除失败-->
    <el-dialog width="600px" :close-on-click-modal="false" title="提示信息" :visible.sync="tipModal_current.show">
      <div v-if="tipModal_current.show">
        <div>{{tipModal_current.tip}}</div>
        <div style="width:100%;height:300px;margin-top:10px;">
          <table-content
            filter="tableFile_downErr"
            :page_bottom="false"
            :page_head="false"
            :data="tipModal_current.data">
          </table-content>
        </div>
        <div style="text-align:center;margin-top:10px;">
          <el-button size="mini" type="primary"
                     @click="()=>{keepFun;$set(tipModal_current,'show',false);}">继续
          </el-button>
          <el-button size="mini" @click="$set(tipModal_current,'show',false)">取消</el-button>
        </div>
      </div>
    </el-dialog>

    <!--查看属性弹框-->
    <el-dialog width="750px" :close-on-click-modal="false" title="查看属性信息" :visible.sync="viewAttrModal.show">
      <div style="margin-bottom:20px;">
        <el-tabs tab-position="top">
          <el-tab-pane label="属性">
            <form-mine ref="viewAttr" size="mini" label-width="120px" style="height: 350px;overflow:auto;">
              <form-item-mine v-for="item in viewAttrModal.formContent1" :label="item.k">{{item.v}}</form-item-mine>
            </form-mine>
          </el-tab-pane>
          <el-tab-pane label="上级属性">
            <form-mine ref="viewAttr" size="mini" label-width="120px" style="height: 350px;overflow:auto;">
              <form-item-mine v-for="item in viewAttrModal.formContent2" :label="item.k">{{item.v}}</form-item-mine>
            </form-mine>
          </el-tab-pane>
          <el-tab-pane label="借阅信息">
            <div style="height: 350px;overflow:auto;">
              暂无信息
            </div>
          </el-tab-pane>
          <el-tab-pane label="归档范围" v-if="viewAttrModal.showContent4">
            <div>
              <el-table size="mini" :data="viewAttrModal.formContent4"
                        style="width: 100%;margin-bottom: 20px;" row-key="id" height="350px" border default-expand-all
                        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                <el-table-column prop="text" label="名称" sortable/>
                <el-table-column prop="ClsCode" label="编号" sortable width="70"/>
                <el-table-column prop="ItemNum" label="条目数量" sortable width="95"/>
                <el-table-column prop="FileNum" label="电子文件数量" sortable width="120"/>
                <el-table-column prop="state" label="状态" sortable width="70">
                  <template slot-scope="scope">
                    {{scope.row.State==0?'':scope.row.State==1?'待确认':scope.row.State==2?'正常':'删除'}}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>

  </div>
</template>

<script>

  import pdf from 'vue-pdf'

  import tableContent from "@/components_coment/tableContent";
  import tabMine from "@/components_coment/tabMine";
  import rightMenu from "@/components_coment/rightMenu";
  import viewWord from '@/components_coment/viewWord'
  // import formMine from "@/components_coment/formMine";
  // import formItemMine from "@/components_coment/formItemMine";

  import {tablePro} from './mixins/tablePro'
  import {tableItem} from './mixins/tableItem'
  import {tableVol} from './mixins/tableVol'
  import {tableFile} from './mixins/tableFile'
  import {tree} from './mixins/tree'
  import {navTabs} from './mixins/navTabs'
  import {modalOptions} from './mixins/modalOptions'
  import {uploadOption} from './mixins/uploadOption'
  import {viewFile} from './mixins/viewFile'

  export default {
    name: "Dashboard",
    components: {pdf, tableContent, tabMine, rightMenu, viewWord},
    mixins: [tablePro, tableItem, tree, navTabs, modalOptions, tableVol, tableFile, uploadOption, viewFile],
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

  .checkedLi {
    background: #cde8ff;
    color: #327daa;
  }

  .fileListDiv table {
    width: 100px;
    table-layout: fixed; /* 只有定义了表格的布局算法为fixed，下面td的定义才能起作用。 */
  }

  .fileListDiv table td {
    width: 100%;
    word-break: keep-all; /* 不换行 */
    white-space: nowrap; /* 不换行 */
    overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
    text-overflow: ellipsis; /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用*/
    text-align: left;
    padding-left: 5px;
  }

</style>
<style>


</style>

