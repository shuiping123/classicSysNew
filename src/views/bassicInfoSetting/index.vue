<template>
  <div id="bassicInfoSettings" class="fullscreen-parent-mine">
    <div class="fullscreen-parent-mine" style="overflow: auto;display: flex;flex-direction: column">
      <div style="flex: 1;overflow: auto;width: 100%;">
        <form-frame modal-title="密级选项">
          <div style="width: 100%;" class="form-inline paddingLayout">
            <!--表格-->
            <DataGrid :data="mj_data"
                      style="height:130px;width: 180px;"
                      selectionMode="single"
                      @cellDblClick="rightClickForSysOption_MJ"
                      @selectionChange="selectRow_MJ=$event">
              <GridColumn field="label" title="密级选项"></GridColumn>
            </DataGrid>
            <!--上移/下移-->
            <div style="width: 100px;text-align: left;padding: 10px">
              <div style="padding:5px;">
                <el-button plain icon="el-icon-top" @click="upThisRow('mj_data','selectRow_MJ')" class="marginLayout"
                           size="mini"></el-button>
              </div>
              <div style="padding:5px;">
                <el-button plain icon="el-icon-bottom" @click="downThisRow('mj_data','selectRow_MJ')"
                           class="marginLayout" size="mini"></el-button>
              </div>
            </div>
            <!--表单-->
            <div class="form-mine">
              <form @submit.prevent="addFun_mj">
                <span class="boldText">输入新密级名称：</span>
                <el-input v-model.trim="name_newMJ" maxlength="10" required style="width: 200px;" size="mini"
                          show-word-limit placeholder="请输入内容"></el-input>
                <el-button plain native-type="submit" class="marginLayout" size="mini">添加</el-button>
              </form>
              <form @submit.prevent="editFun_mj">
                <span class="boldText">修改此密级名称：</span>
                <el-input v-model.trim="name_editMJ" maxlength="10" required style="width: 200px;" size="mini"
                          show-word-limit placeholder="请输入内容"></el-input>
                <el-button plain native-type="submit" class="marginLayout" size="mini">修改</el-button>
              </form>
              <div class="boldText">* 密级一旦启用，将不允许删除！</div>
            </div>
          </div>
        </form-frame>
        <form-frame modal-title="保管期限">
          <div style="width: 100%;" class="form-inline paddingLayout">
            <!--表格-->
            <DataGrid :data="date_data"
                      style="height:120px;width: 180px;"
                      selectionMode="single"
                      @cellDblClick="rightClickForSysOption_keepDate"
                      @selectionChange="selectRow_Date=$event">
              <GridColumn field="label" title="保管期限"></GridColumn>
            </DataGrid>
            <!--上移/下移-->
            <div style="width: 100px;text-align: left;padding: 10px">
              <div style="padding:5px;">
                <el-button plain icon="el-icon-top" @click="upThisRow('date_data','selectRow_Date')"
                           class="marginLayout" size="mini"></el-button>
                <!--<button type="button" class="normalBtn" @click="upThisRow('date_data','selectRow_Date')">上移</button>-->
              </div>
              <div style="padding:5px;">
                <el-button plain icon="el-icon-bottom" @click="downThisRow('date_data','selectRow_Date')"
                           class="marginLayout" size="mini"></el-button>
              </div>
            </div>
            <!--表单-->
            <div class="form-mine form-mine">
              <form @submit.prevent="addFun_Date">
                <div>
                  <span class="boldText">输入名称：</span>
                  <el-input v-model.trim="name_newDate" maxlength="20" required show-word-limit style="width: 200px;"
                            class="marginLayout" size="mini" placeholder="请输入内容"></el-input>
                  <el-input-number v-model="addDate_years" size="mini" required style="width:100px;"
                                   class="marginLayout" :min="1" :step="1"></el-input-number>
                  <span class="boldText marginLayout">年</span>
                  <el-button plain class="marginLayout" native-type="submit" size="mini">添加</el-button>
                </div>
              </form>
              <form @submit.prevent="editFun_Date">
                <div>
                  <span class="boldText">修改名称：</span>
                  <el-input v-model.trim="name_editDate" maxlength="20" required show-word-limit style="width: 200px;"
                            class="marginLayout" size="mini" placeholder="请输入内容"></el-input>
                  <el-input-number v-model="editDate_years" size="mini" required style="width:100px;"
                                   class="marginLayout" :min="1" :step="1"></el-input-number>
                  <span class="boldText marginLayout">年</span>
                  <el-button plain class="marginLayout" native-type="submit" size="mini">修改</el-button>
                </div>
              </form>
              <p class="boldText">* 保管期限一旦启用，将不允许删除！</p>
            </div>
          </div>
        </form-frame>
        <form-frame modal-title="专业选项">
          <div style="width: 100%;" class="form-inline paddingLayout">
            <!--表格-->
            <DataGrid :data="major_data"
                      style="height:160px;width: 180px;"
                      selectionMode="single"
                      @cellDblClick="rightClickForSysOption_major"
                      @selectionChange="selectRow_major=$event">
              <GridColumn field="label" title="名称"></GridColumn>
              <GridColumn field="MajorCode" title="代号"></GridColumn>
            </DataGrid>
            <!--上移/下移-->
            <div style="width: 100px;text-align: left;padding: 10px">
              <div style="padding:5px;">
                <el-button plain icon="el-icon-top" @click="upThisRow('major_data','selectRow_major')"
                           class="marginLayout" size="mini"></el-button>
              </div>
              <div style="padding:5px;">
                <el-button plain icon="el-icon-bottom" @click="downThisRow('major_data','selectRow_major')"
                           class="marginLayout" size="mini"></el-button>
              </div>
              <div style="padding:5px;">
                <el-button plain icon="el-icon-delete" @click="deleteThisFun"
                           class="marginLayout" size="mini"></el-button>
              </div>
            </div>
            <!--表单-->
            <div class="form-mine">
              <form @submit.prevent="addFun_Major">
                <div>
                  <span class="boldText">输入名称：</span>
                  <el-input v-model.trim="name_newMajor" style="width: 200px;" required maxlength="20" show-word-limit
                            class="marginLayout" size="mini" placeholder="请输入内容"></el-input>
                  <span class="boldText marginLayout">代号：</span>
                  <el-input v-model.trim="name_newMajorCode" style="width: 100px;" required class="marginLayout"
                            size="mini" placeholder="请输入内容"></el-input>
                  <el-button plain class="marginLayout" native-type="submit" size="mini">添加</el-button>
                </div>
              </form>
              <form @submit.prevent="editFun_Major">
                <div>
                  <span class="boldText">修改名称：</span>
                  <el-input v-model.trim="name_editMajor" style="width: 200px;" required maxlength="20" show-word-limit
                            class="marginLayout" size="mini" placeholder="请输入内容"></el-input>
                  <span class="boldText marginLayout">代号：</span>
                  <el-input v-model.trim="name_editMajorCode" style="width: 100px;" required class="marginLayout"
                            size="mini" placeholder="请输入内容"></el-input>
                  <el-button plain class="marginLayout" native-type="submit" size="mini">修改</el-button>
                </div>
              </form>
            </div>
          </div>
        </form-frame>
        <form-frame modal-title="敏感词">
          <div style="width: 100%;" class="form-inline paddingLayout">
            <!--表格-->
            <DataGrid :data="sensitiveWord_data"
                      style="height:160px;width: 180px;"
                      selectionMode="single"
                      @cellDblClick="rightClickForSysOption_sensitive"
                      @selectionChange="selectRow_sensitiveWord=$event">
              <GridColumn field="label" title="敏感词"></GridColumn>
            </DataGrid>
            <!--上移/下移-->
            <div style="width: 100px;text-align: left;padding: 10px">
              <div style="padding:5px;">
                <el-button plain icon="el-icon-top" @click="upThisRow('sensitiveWord_data','selectRow_sensitiveWord')"
                           class="marginLayout" size="mini"></el-button>
              </div>
              <div style="padding:5px;">
                <el-button plain icon="el-icon-bottom"
                           @click="downThisRow('sensitiveWord_data','selectRow_sensitiveWord')"
                           class="marginLayout" size="mini"></el-button>
              </div>
              <div style="padding:5px;">
                <el-button plain icon="el-icon-delete" @click="deleteThisSensitiveFun"
                           class="marginLayout" size="mini"></el-button>
              </div>
            </div>
            <!--表单-->
            <div class="form-mine">
              <form @submit.prevent="addFun_SensitiveWord">
                <div>
                  <span class="boldText">输入敏感词：</span>
                  <el-input v-model.trim="name_newSensitiveWord" required style="width: 200px;" maxlength="50"
                            show-word-limit class="marginLayout" size="mini" placeholder="请输入内容"></el-input>
                  <el-button plain class="marginLayout" maxlength="30" native-type="submit" size="mini">添加</el-button>
                </div>
              </form>
              <form @submit.prevent="editFun_SensitiveWord">
                <div>
                  <span class="boldText">修改敏感词：</span>
                  <el-input v-model.trim="name_editSensitiveWord" required style="width: 200px;" maxlength="50"
                            show-word-limit class="marginLayout" size="mini" placeholder="请输入内容"></el-input>
                  <el-button plain class="marginLayout" maxlength="30" native-type="submit" size="mini">修改</el-button>
                </div>
              </form>
            </div>
          </div>
        </form-frame>
        <form-frame modal-title="阶段维护">
          <div style="width: 100%;" class="form-inline paddingLayout">
            <!--表格-->
            <DataGrid :data="stage_data"
                      style="height:160px;width: 180px;"
                      selectionMode="single"
                      @cellDblClick="rightClickForSysOption_stage"
                      @selectionChange="selectRow_stage=$event">
              <GridColumn field="label" title="阶段维护"></GridColumn>
              <GridColumn field="StageCode" title="编码"></GridColumn>
            </DataGrid>
            <!--上移/下移-->
            <div style="width: 100px;text-align: left;padding: 10px">
              <div style="padding:5px;">
                <el-button plain icon="el-icon-top" @click="upThisRow('stage_data','selectRow_stage')"
                           class="marginLayout" size="mini"></el-button>
              </div>
              <div style="padding:5px;">
                <el-button plain icon="el-icon-bottom" @click="downThisRow('stage_data','selectRow_stage')"
                           class="marginLayout" size="mini"></el-button>
              </div>
              <!--<div style="padding:5px;">-->
              <!--  <el-button plain icon="el-icon-delete" @click="deleteThisSensitiveFun"-->
              <!--             class="marginLayout" size="mini"></el-button>-->
              <!--</div>-->
            </div>
            <!--表单-->
            <div class="form-mine">
              <form @submit.prevent="addFun_Stage">
                <div>
                  <span class="boldText">输入名称：</span>
                  <el-input v-model.trim="name_newStage" style="width: 200px;" required maxlength="20" show-word-limit
                            class="marginLayout" size="mini" placeholder="请输入内容"></el-input>
                  <span class="boldText marginLayout">编码：</span>
                  <el-input v-model.trim="code_newStage" style="width: 150px;" required maxlength="20" show-word-limit
                            class="marginLayout" size="mini" placeholder="请输入内容"></el-input>
                  <el-button plain class="marginLayout" maxlength="30" native-type="submit" size="mini">添加</el-button>
                </div>
              </form>
              <form @submit.prevent="editFun_Stage">
                <div>
                  <span class="boldText">修改名称：</span>
                  <el-input v-model.trim="name_editStage" style="width: 200px;" maxlength="20" show-word-limit
                            class="marginLayout" size="mini" placeholder="请输入内容"></el-input>
                  <span class="boldText marginLayout">编码：</span>
                  <el-input v-model.trim="code_editStage" style="width: 150px;" required maxlength="20" show-word-limit
                            class="marginLayout" size="mini" placeholder="请输入内容"></el-input>
                  <el-button plain class="marginLayout" maxlength="30" native-type="submit" size="mini">修改</el-button>
                </div>
              </form>
            </div>
          </div>
        </form-frame>
      </div>
      <div style="margin-top:20px;text-align:right;">
        <el-button type="primary" @click="submitForSysOption" plain>应用排序</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import formFrame from '@/components_coment/formFrame'

  import {request} from '@/network'

  export default {
    name: "index",
    components: {formFrame},
    data() {
      return {
        showForm: 1,//判断是基本设置还是更多设置
        mj_data: [],//密级数据
        selectRow_MJ: null,//密级当前选中行
        date_data: [],//保管期限
        selectRow_Date: null,//当前选中的保管期限
        major_data: [],//专业选项数据
        selectRow_major: null,//当前选中的专业选项行
        sensitiveWord_data: [],//敏感词数据
        selectRow_sensitiveWord: null,//当前选中的敏感词行
        stage_data: [],//敏感词数据
        selectRow_stage: null,//当前选中的敏感词行

        name_newMJ: '',//新的密级名称
        name_editMJ: '',//修改的密级名称

        name_newDate: '',//新的保管期限名称
        name_editDate: '',//修改的保管期限名称
        addDate_years: 1,//添加保管期限的年数
        editDate_years: 1,//修改保管期限的年数

        name_newMajor: '',//添加的专业名称
        name_newMajorCode: '',//添加的专业代号
        name_editMajor: '',//修改的专业名称
        name_editMajorCode: '',//修改的专业代号

        name_newSensitiveWord: '',//添加敏感词
        name_editSensitiveWord: '',//修改敏感词

        name_newStage: '',//添加阶段
        code_newStage: '',//添加阶段
        name_editStage: '',//修改阶段
        code_editStage: '',//修改阶段

      }
    },
    watch: {
      isBingding_add(newVal) {
        if (!newVal) {
          this.addDate_years = 1;
        }
      },
      isBingding_edit(newVal) {
        if (!newVal) {
          this.editDate_years = 1;
        }
      },
    },
    mounted() {
      this.initSysOption();
    },
    methods: {
      // 打开弹框时，初始化数据
      initSysOption() {
        this.getMjDataFun();//密级数据
        this.getDateDataFun();//保管年限数据
        this.getMajorDataFun();//专业选项数据
        this.getSensitiveWordDataFun();//敏感词数据
        this.getStageDataFun();//阶段数据
        this.name_newMJ = '';//清空新的密级名称
        this.name_editMJ = '';//清空修改的密级名称

        this.name_newDate = '';
        this.addDate_years = 1;
        this.name_editDate = '';
        this.editDate_years = 1;

        this.name_newMajor = '';
        this.name_newMajorCode = '';
        this.name_editMajor = '';
        this.name_editMajorCode = '';

        this.name_newSensitiveWord = '';
        this.name_editSensitiveWord = '';

        this.name_newStage = '';
        this.code_newStage = '';
        this.name_editStage = '';
        this.code_editStage = '';

      },
      /**
       * 点击上移 - 通用
       * @param type 当前对应的数据列表 例'mj_data'
       * @param nowSelect 当前对应的表格选中数据 例'selectRow_MJ'
       * */
      upThisRow(data, nowSelect) {
        if (this[nowSelect]) {
          let index;//当前点击的行是第几行
          this[data].map((item, key) => {
            if (item.value == this[nowSelect].value) {
              index = key;
            }
          });
          if (index == 0) {
            this.$current.messageMine("已是首位，无法上移", 'error');
          } else {
            let pre = this[data][index - 1];
            this.$set(this[data], (index - 1), this[nowSelect]);
            this.$set(this[data], index, pre);
          }
        } else {
          this.$current.messageMine("请选择上移项后重试", 'error');
        }
      },
      /**
       * 点击下移 - 通用
       * @param data 当前对应的数据列表 例'mj_data'
       * @param nowSelect 当前对应的表格选中数据 例'selectRow_MJ'
       * */
      downThisRow(data, nowSelect) {
        if (this[nowSelect]) {
          let index;//当前点击的行是第几行
          this[data].map((item, key) => {
            if (item.value === this[nowSelect].value) {
              index = key;
            }
          });
          if (index === (this[data].length - 1)) {
            this.$current.messageMine("已是最后一位，无法下移", 'error');
          } else {
            let next = this[data][index + 1];
            this.$set(this[data], index + 1, this[nowSelect]);
            this.$set(this[data], index, next);
          }
        } else {
          this.$current.messageMine("请选择下移项后重试", 'error');
        }
      },
      // 密级双击修改
      rightClickForSysOption_MJ(row) {
        let cellData = row.row;//当前双击的单元格的
        this.name_editMJ = cellData.label;
      },
      // 保管期限双击修改
      rightClickForSysOption_keepDate(row) {
        let cellData = row.row;//当前双击的单元格的
        this.name_editDate = cellData.label;
        this.editDate_years = cellData.StorageYear;
      },
      // 专业双击修改
      rightClickForSysOption_major(row) {
        let cellData = row.row;//当前双击的单元格的
        this.name_editMajor = cellData.label;
        this.name_editMajorCode = cellData.MajorCode;
      },
      // 敏感词双击修改
      rightClickForSysOption_sensitive(row) {
        let cellData = row.row;//当前双击的单元格的
        this.name_editSensitiveWord = cellData.label;
      },
      // 阶段双击修改
      rightClickForSysOption_stage(row) {
        let cellData = row.row;//当前双击的单元格的
        this.name_editStage = cellData.label;
      },
      // 获取密级数据 清空当前选中项
      getMjDataFun() {
        this.selectRow_MJ = null;//这里要密级选项选中项
        request({
          url: this.$collections.systemOption.getMjData,
          params: {ty: 'GetSecretClassLst'},
        }).then(res => {
          if (res.reCode == 0) {
            this.mj_data = res.reData;
          } else if (res.reCode == 1) {
            this.$current.alertMine(res.reMsg);
            this.mj_data = [];
          } else {

            this.mj_data = [];
          }
        })
      },
      // 获取保管期限数据
      getDateDataFun() {
        let data = 'date_data';
        let select = 'selectRow_Date'
        this[select] = null;//这里清空选中项
        request({
          url: this.$collections.systemOption.getDateData,
          params: {ty: 'GetStorageLst'},
        }).then(res => {
          if (res.reCode == 0) {
            this[data] = res.reData;
          } else if (res.reCode == 1) {
            this.$current.alertMine(res.reMsg);
            this[data] = [];
          } else {

            this[data] = [];
          }
        })
      },
      // 获取专业选项数据
      getMajorDataFun() {
        let data = 'major_data';
        let select = 'selectRow_major'
        this[select] = null;//这里清空选中项
        request({
          url: this.$collections.systemOption.getMajor,
          params: {ty: 'GetMajorLst'},
        }).then(res => {
          if (res.reCode == 0) {
            this[data] = res.reData;
          } else if (res.reCode == 1) {
            this.$current.alertMine(res.reMsg);
            this[data] = [];
          } else {

            this[data] = [];
          }
        })
      },
      // 获取敏感词数据
      getSensitiveWordDataFun() {
        let data = 'sensitiveWord_data';
        let select = 'selectRow_sensitiveWord'
        this[select] = null;//这里清空选中项
        request({
          url: this.$collections.systemOption.getSensitive,
          params: {ty: 'GetSensitiveLst'},
        }).then(res => {
          if (res.reCode == 0) {
            this[data] = res.reData;
          } else if (res.reCode == 1) {
            this.$current.alertMine(res.reMsg);
            this[data] = [];
          } else {

            this[data] = [];
          }
        })
      },
      // 获取阶段数据
      getStageDataFun() {
        let data = 'stage_data';
        let select = 'selectRow_stage'
        this[select] = null;//这里清空选中项
        request({
          url: this.$collections.systemOption.getStage,
          params: {ty: 'GetStageLst'},
        }).then(res => {
          if (res.reCode == 0) {
            this[data] = res.reData;
          } else if (res.reCode == 1) {
            this.$current.alertMine(res.reMsg);
            this[data] = [];
          } else {

            this[data] = [];
          }
        })
      },
      // 添加新密级
      addFun_mj() {
        if (!this.name_newMJ) {
          this.$current.alertMine("您还未输入新的密级名称，请输入后重试");
          return false;
        }
        request({
          url: this.$collections.systemOption.addMJ,
          params: {ty: 'AddSecretClassLst', ScrClsName: this.name_newMJ}
        }).then(res => {
          if (res.reCode == 0) {
            this.$current.messageMine(res.reMsg, 'success');
            this.name_newMJ = '';//清空新密级名称
            this.mj_data.push({
              label: res.reData.ScrClsName,
              value: res.reData.ScrClsId,
            });
          } else if (res.reCode == 1) {
            this.$current.alertMine(res.reMsg);
          } else {

          }
        })
      },
      // 修改此密级
      editFun_mj() {
        if (!this.selectRow_MJ) {
          this.$current.alertMine("您还未选中修改项");
          return false;
        }
        if (!this.name_editMJ) {
          this.$current.alertMine("您还未输入密级名称")
          return false;
        }
        request({
          url: this.$collections.systemOption.editMJ,
          params: {
            ty: 'EditSecretClassLst',
            ScrClsId: this.selectRow_MJ.value,
            ScrClsName: this.name_editMJ
          },
        }).then(res => {
          if (res.reCode == 0) {
            this.mj_data = this.mj_data.map((item, key) => {
              if (item.value === this.selectRow_MJ.value) {
                item.label = this.name_editMJ;
                return item;
              }
              return item;
            });
            this.$current.messageMine(res.reMsg, 'success');
            this.name_editMJ = '';//清空修改的名称
          } else if (res.reCode == 1) {
            this.$current.alertMine(res.reMsg);
          } else {

          }
        })
      },
      // 添加保管期限
      addFun_Date() {
        request({
          url: this.$collections.systemOption.addDate,
          params: {
            ty: 'AddStorageLst',
            StorageName: this.name_newDate,
            StorageYear: this.addDate_years,
          }
        }).then(res => {
          if (res.reCode == 0) {
            this.$current.messageMine(res.reMsg, 'success');
            this.name_newDate = '';
            this.isBingding_add = false;
            this.date_data.push({
              label: res.reData.StorageName,
              value: res.reData.StorageId,
            });
          } else if (res.reCode == 1) {
            this.$current.alertMine(res.reMsg);
          } else {

          }
        })
      },
      // 修改保管期限
      editFun_Date() {
        if (!this.selectRow_Date) {
          this.$current.alertMine("您还未选中修改项");
          return false;
        }
        request({
          url: this.$collections.systemOption.editDate,
          params: {
            ty: 'EditStorageLst',
            StorageId: this.selectRow_Date.value,
            StorageName: this.name_editDate,
            StorageYear: this.editDate_years,
          }
        }).then(res => {
          if (res.reCode == 0) {
            this.date_data = this.date_data.map((item, key) => {
              if (item.value === this.selectRow_Date.value) {
                item.label = this.name_editDate;
                return item;
              }
              return item;
            });
            this.$current.messageMine(res.reMsg, 'success');
            this.name_editDate = '';
            this.isBingding_edit = false;
          } else if (res.reCode == 1) {
            this.$current.alertMine(res.reMsg);
          } else {

          }
        })
      },
      // 添加专业
      addFun_Major() {
        request({
          url: this.$collections.systemOption.addMojor,
          params: {
            ty: 'AddMajorLst',
            MajorName: this.name_newMajor,
            MajorCode: this.name_newMajorCode,
          }
        }).then(res => {
          if (res.reCode == 0) {
            this.$current.messageMine(res.reMsg, 'success');
            this.name_newMajor = '';
            this.name_newMajorCode = '';
            this.major_data.push({
              value: res.reData.MajorId,
              label: res.reData.MajorName,
              MajorCode: res.reData.MajorCode,
            });
          } else if (res.reCode == 1) {
            this.$current.alertMine(res.reMsg);
          } else {

          }
        })
      },
      // 修改专业
      editFun_Major() {
        if (!this.selectRow_major) {
          this.$current.alertMine("您还未选中修改项");
          return false;
        }
        request({
          url: this.$collections.systemOption.editMojor,
          params: {
            ty: 'EditMajorLst',
            MajorId: this.selectRow_major.value,
            MajorName: this.name_editMajor,
            MajorCode: this.name_editMajorCode,
          }
        }).then(res => {
          if (res.reCode == 0) {
            this.major_data = this.major_data.map((item, key) => {
              if (item.value === this.selectRow_major.value) {
                item.label = this.name_editMajor;
                item.MajorCode = this.name_editMajorCode;
                return item;
              }
              return item;
            });
            this.$current.messageMine(res.reMsg, 'success');
            this.name_editMajor = '';
            this.name_editMajorCode = '';
          } else if (res.reCode == 1) {
            this.$current.alertMine(res.reMsg);
          } else {

          }
        })
      },
      // 删除专业
      deleteThisFun() {
        if (!this.selectRow_major) {
          this.$current.alertMine("您还未选中删除项");
          return false;
        }
        this.$current.confirmMine('提示信息', "您确定要删除选中专业吗？", () => {
          request({
            url: this.$collections.systemOption.deleteMojor,
            params: {
              ty: 'DelMajorLst',
              MajorId: this.selectRow_major.value,
            },
          }).then(res => {
            if (res.reCode == 0) {
              let index;
              this.major_data.map((item, key) => {
                if (item.value === this.selectRow_major.value) {
                  index = key;
                }
              });
              this.major_data.splice(index, 1);
              this.$current.messageMine(res.reMsg, 'success');
            } else if (res.reCode == 1) {
              this.$current.alertMine(res.reMsg);
            } else {
              this.closeModals()
            }
          })
        })

      },
      // 添加敏感词
      addFun_SensitiveWord() {
        request({
          url: this.$collections.systemOption.addSensitiveWord,
          params: {
            ty: 'AddSensitiveLst',
            SenWord: this.name_newSensitiveWord,
          }
        }).then(res => {
          if (res.reCode == 0) {
            this.$current.messageMine(res.reMsg, 'success');
            this.name_newSensitiveWord = '';
            this.sensitiveWord_data.push({
              value: res.reData.SenId,
              label: res.reData.SenWord,
            });
          } else if (res.reCode == 1) {
            this.$current.alertMine(res.reMsg);
          } else {

          }
        })
      },
      // 修改敏感词
      editFun_SensitiveWord() {
        if (!this.selectRow_sensitiveWord) {
          this.$current.alertMine("您还未选中修改项");
          return false;
        }
        request({
          url: this.$collections.systemOption.editSensitiveWord,
          params: {
            ty: 'EditSensitiveLst',
            SenId: this.selectRow_sensitiveWord.value,
            SenWord: this.name_editSensitiveWord,
          }
        }).then(res => {
          if (res.reCode == 0) {
            this.sensitiveWord_data = this.sensitiveWord_data.map((item, key) => {
              if (item.value === this.selectRow_sensitiveWord.value) {
                item.label = this.name_editSensitiveWord;
                return item;
              }
              return item;
            });
            this.$current.messageMine(res.reMsg, 'success');
            this.name_editSensitiveWord = '';
          } else if (res.reCode == 1) {
            this.$current.alertMine(res.reMsg);
          } else {

          }
        })
      },
      // 删除敏感词
      deleteThisSensitiveFun() {
        if (!this.selectRow_sensitiveWord) {
          this.$current.alertMine("您还未选中删除项");
          return false;
        }
        this.$current.confirmMine('提示信息', "您确定要删除选中敏感词吗？", () => {
          request({
            url: this.$collections.systemOption.deleteSensitiveWord,
            params: {
              ty: 'DelSensitiveLst',
              SenId: this.selectRow_sensitiveWord.value,
            },
          }).then(res => {
            if (res.reCode == 0) {
              let index;
              this.sensitiveWord_data.map((item, key) => {
                if (item.value === this.selectRow_sensitiveWord.value) {
                  index = key;
                }
              });
              this.sensitiveWord_data.splice(index, 1);
              this.$current.messageMine(res.reMsg, 'success');
            } else if (res.reCode == 1) {
              this.$current.alertMine(res.reMsg);
            } else {
              this.closeModals()
            }
          })
        })

      },
      // 添加阶段
      addFun_Stage() {
        request({
          url: this.$collections.systemOption.addStage,
          params: {
            ty: 'AddStageLst',
            StageName: this.name_newStage,
            StageCode: this.code_newStage,
          }
        }).then(res => {
          if (res.reCode == 0) {
            this.$current.messageMine(res.reMsg, 'success');
            this.name_newStage = '';
            this.code_newStage = '';
            this.stage_data.push({
              value: res.reData.StageId,
              label: res.reData.StageName,
              StageCode: res.reData.StageCode,
            });
          } else if (res.reCode == 1) {
            this.$current.alertMine(res.reMsg);
          } else {
          }
        })
      },
      // 修改阶段
      editFun_Stage() {
        if (!this.selectRow_stage) {
          this.$current.alertMine("您还未选中修改项");
          return false;
        }
        request({
          url: this.$collections.systemOption.editStage,
          params: {
            ty: 'EditStageLst',
            StageId: this.selectRow_stage.value,
            StageCode: this.code_editStage,
            StageName: this.name_editStage,
          }
        }).then(res => {
          if (res.reCode == 0) {
            this.stage_data = this.stage_data.map((item, key) => {
              if (item.value === this.selectRow_stage.value) {
                item.StageCode = this.code_editStage;
                item.label = this.name_editStage;
                return item;
              }
              return item;
            });
            this.$current.messageMine(res.reMsg, 'success');
            this.code_editStage = '';
            this.name_editStage = '';
          } else if (res.reCode == 1) {
            this.$current.alertMine(res.reMsg);
          } else {

          }
        })
      },
      // 最终提交
      submitForSysOption() {
        request({
          url: this.$collections.systemOption.submitBasics,
          params: {
            ty: 'SetSortMultiple',
            ScrClsId: this.mj_data.map(item => item.value).join(','),
            StorageId: this.date_data.map(item => item.value).join(','),
            MajorId: this.major_data.map(item => item.value).join(','),
            SenId: this.sensitiveWord_data.map(item => item.value).join(','),
            StageId: this.stage_data.map(item => item.value).join(','),
          },
        }).then(res => {
          if (res.reCode == 0) {
            this.$current.messageMine(res.reMsg, 'success');
            this.$refs.modalForSysOption.close();
          } else if (res.reCode == 1) {
            this.$current.alertMine(res.reMsg);
          } else {

          }
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  #bassicInfoSettings {
    padding: 20px 20px;
    min-width: 1000px;

    .paddingLayout {
      padding: 20px;
    }

    .marginLayout {
      margin-left: 5px;
    }

    .boldText {
      text-decoration: none;
      outline: none;
      cursor: pointer;
      padding: 0;
      font-size: 14px;
      font-weight: 500;
      /*color: #409eff;*/
    }

    @margin: 6px 0;

    .form-mine {
      > div {
        margin: @margin;
      }

      > form {
        margin: @margin;
      }
    }
  }
</style>
