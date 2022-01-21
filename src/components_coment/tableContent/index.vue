<template>
  <div class="contentTable">
    <div v-if="page_top">
      <slot name="t_header"></slot>
    </div>
    <div class="body" @contextmenu.prevent style="position: relative">
      <div style="position: absolute;left: 0;right: 0;top: 0;bottom: 0;">
        <el-table
          ref="table"
          size="mini"
          :show-header="showHeader"
          v-loading="data.loading"
          :data="data.data"
          :cell-class-name="tableCellClassName"
          @row-contextmenu="rightClick"
          @cell-click="pinSelect"
          :highlight-current-row="true"
          @current-change="currentChange"
          :height="tableHeight"
          :empty-text="data.msg"
          style="cursor:pointer;"
          @selection-change="handleSelectionChange"
          @row-dblclick="dbClickFun"
          border>
          <template v-for="(item,key) in data.title">
            <el-table-column v-if="item.type" :key="filter+key"
                             :type="item.type"
                             :width="item.width"
                             :min-width="item.minWidth">
            </el-table-column>
            <el-table-column v-else :key="filter+key"
                             resizable show-overflow-tooltip
                             :type="item.type"
                             :prop="item.prop"
                             :sortable="item.sort"
                             :label="item.name"
                             :width="item.width"
                             :min-width="item.minWidth">
              <div slot-scope="scope" style="display: flex;align-items: center;">
                    <div v-html="item.template"></div>
              <span v-if="item.template" :class="chooseIcon(scope.row,scope.row[item.template])"
                    style="display: inline-block;width: 16px;height: 16px;overflow: hidden;"></span>
                <span style="display: inline-block;flex: 1;"
                      :style="{'margin-left': item.template?'10px':0,height: item.template?'18px':''}">{{scope.row[item.prop]}}</span>
              </div>
              <!--<template v-if="item.template" slot-scope="scope">-->
              <!--  <ex-slot :row="scope.row"></ex-slot>-->
              <!--</template>-->
            </el-table-column>
          </template>

        </el-table>
      </div>
    </div>
    <!--表格底部 - 页码控制 刷新 等-->
    <div class="footer form-inline" v-if="page_bottom">
      <!--<div class="availableBtn pointerBtn" @click="toFirstPage" style="border: none">-->
      <!--  <svg t="1636440596906" class="icon" viewBox="0 0 1024 1024" version="1.1"-->
      <!--       xmlns="http://www.w3.org/2000/svg"-->
      <!--       p-id="4189" width="18" height="18">-->
      <!--    <path-->
      <!--      d="M357.3 324v376c0 17.6-14.4 32-32 32s-32-14.4-32-32V324c0-17.6 14.4-32 32-32s32 14.4 32 32zM400.5 512c0 9 4.4 17.4 11.7 22.6l275.2 192.6c8.4 5.9 19.4 6.5 28.5 1.9 9.1-4.7 14.8-14.1 14.8-24.4V319.4c0-10.3-5.7-19.6-14.8-24.4-9.1-4.7-20.1-4-28.5 1.9L412.3 489.5a27.29 27.29 0 0 0-11.8 22.5z"-->
      <!--      fill="" p-id="4190"></path>-->
      <!--  </svg>-->
      <!--</div>-->
      <!--<div class="availableBtn pointerBtn" @click="toPrePage" style="border-left: none">-->
      <!--  <span type="button" class="el-icon-caret-left"></span>-->
      <!--</div>-->
      <!--<div class="availableBtn" style="display: flex;align-items: center;">-->
      <!--  <span>第 </span>-->
      <!--  <input type="text" :value="page_now" @keyup.enter="submitTablePage" style="width: 30px;margin: 0 5px;">-->
      <!--  <span> 页，共{{pageNum}}页</span>-->
      <!--</div>-->
      <!--<div class="availableBtn pointerBtn" @click="toNextPage" style="border-right: none">-->
      <!--  <span type="button" class="el-icon-caret-right"></span>-->
      <!--</div>-->
      <!--<div class="availableBtn pointerBtn" @click="toLastPage" style="border-left: none">-->
      <!--  <svg t="1636439843379" class="icon" viewBox="0 0 1024 1024" version="1.1"-->
      <!--       xmlns="http://www.w3.org/2000/svg"-->
      <!--       p-id="4050" width="18" height="18">-->
      <!--    <path-->
      <!--      d="M698.7 292c17.6 0 32 14.4 32 32v376c0 17.6-14.4 32-32 32s-32-14.4-32-32V324c0-17.6 14.4-32 32-32zM611.7 489.5L336.6 296.9c-8.4-5.9-19.4-6.6-28.5-1.9-9.1 4.8-14.8 14.1-14.8 24.4v385.3c0 10.3 5.7 19.7 14.8 24.4 9.1 4.6 20.1 4 28.5-1.9l275.2-192.6c7.3-5.2 11.7-13.6 11.7-22.6 0-9-4.4-17.4-11.8-22.5z"-->
      <!--      fill="" p-id="4051"></path>-->
      <!--  </svg>-->
      <!--</div>-->
      <!--<div class="availableBtn pointerBtn" @click="reloadThisPage">-->
      <!--  <svg t="1636442906184" class="icon" viewBox="0 0 1024 1024" version="1.1"-->
      <!--       xmlns="http://www.w3.org/2000/svg"-->
      <!--       p-id="5642" width="18" height="18">-->
      <!--    <path-->
      <!--      d="M981.314663 554.296783a681.276879 681.276879 0 0 1-46.986468 152.746388q-105.706098 230.734238-360.983096 242.19829a593.06288 593.06288 0 0 1-228.689008-33.853939v-1.022615l-31.808709 79.979258a55.759429 55.759429 0 0 1-20.506122 22.551352 40.043451 40.043451 0 0 1-21.04434 5.382184 51.076928 51.076928 0 0 1-19.483507-5.382184 95.210839 95.210839 0 0 1-13.347817-7.158305 52.314831 52.314831 0 0 1-5.382184-4.628679L71.671707 731.908862a57.427906 57.427906 0 0 1-7.158305-21.528737 46.932646 46.932646 0 0 1 1.022615-17.438277 35.952991 35.952991 0 0 1 7.158305-13.347816 74.435608 74.435608 0 0 1 10.279972-10.279972 60.495751 60.495751 0 0 1 11.248765-7.373593 50.431066 50.431066 0 0 1 8.18092-3.606063 6.189512 6.189512 0 0 0 3.067845-1.776121l281.003839-74.866183a91.497132 91.497132 0 0 1 35.899168-2.583448 122.337047 122.337047 0 0 1 22.174599 6.404799 21.528737 21.528737 0 0 1 12.325202 12.325202 76.157907 76.157907 0 0 1 4.628679 14.854829 47.63233 47.63233 0 0 1 0 14.370431 55.167388 55.167388 0 0 1-2.04523 10.764369 10.764368 10.764368 0 0 0-1.022615 3.606063l-32.831324 79.979258a677.50935 677.50935 0 0 0 164.264262 39.505232q77.395809 7.696523 131.809692-3.606063a358.507291 358.507291 0 0 0 101.023598-36.921784 381.27393 381.27393 0 0 0 73.951211-50.753997 352.64071 352.64071 0 0 0 48.708767-55.382676 410.391547 410.391547 0 0 0 26.910921-41.550462c3.767529-7.481236 6.673908-13.616926 8.719139-18.460892zM40.885614 449.667121a685.69027 685.69027 0 0 1 63.563595-176.427998q118.0313-212.273346 374.330913-207.160271a571.803252 571.803252 0 0 1 207.160271 39.989629l33.853939-78.956643A75.619688 75.619688 0 0 1 735.187378 9.189165a37.67529 37.67529 0 0 1 15.393047-8.234742 42.303968 42.303968 0 0 1 14.854829-0.538219 47.578509 47.578509 0 0 1 13.347817 3.606064 102.907362 102.907362 0 0 1 11.302586 6.13569 49.569917 49.569917 0 0 1 6.673909 4.628678l3.067845 3.067845 154.84544 276.913379a81.970666 81.970666 0 0 1 6.13569 22.712817 46.986468 46.986468 0 0 1-1.022615 17.438277 32.293105 32.293105 0 0 1-7.696523 13.347817 69.322533 69.322533 0 0 1-10.764369 9.741753 92.142994 92.142994 0 0 1-11.302587 6.673909l-8.18092 4.09046a7.104483 7.104483 0 0 1-3.067845 1.022615l-283.049068 67.546412a112.003254 112.003254 0 0 1-46.125319-1.022615c-11.571696-3.390776-19.160576-8.019454-22.551352-13.832214a41.173709 41.173709 0 0 1-5.382184-21.04434 97.256069 97.256069 0 0 1 1.291724-17.438277 24.381295 24.381295 0 0 1 3.067845-8.234742L600.632773 296.81309a663.730958 663.730958 0 0 0-164.102797-43.057474q-77.987849-9.203535-131.809692 0a348.227319 348.227319 0 0 0-101.292707 33.853938 368.571976 368.571976 0 0 0-75.350579 49.246986 383.31916 383.31916 0 0 0-50.269601 54.360061 408.507783 408.507783 0 0 0-28.740863 41.012244A113.025869 113.025869 0 0 0 40.885614 449.667121z m0 0"-->
      <!--      fill="#467CFD" p-id="5643"></path>-->
      <!--  </svg>-->
      <!--</div>-->
      <!--<div class="availableBtn pointerBtn" style="flex: 1;text-align: right;padding-right: 15px">-->
      <!--  <span>每页显示{{this.data.limit}}条数据</span>-->
      <!--</div>-->
      <div style="flex:1">
        <el-pagination
          @current-change="reloadThisPage"
          :current-page.sync="page_now"
          :page-sizes="[data.limit]"
          :page-size="data.limit"
          background
          layout="prev, pager, next,total,jumper"
          :total="data.count">
        </el-pagination>
      </div>
      <button type="button" class="clearStyleBtn" style="height: 100%;font-size:13px;color:#606266" @click="reloadThisPage">
        <i class="el-icon-refresh" style="color: #409eff"></i> 刷新
      </button>
      <button type="button" class="clearStyleBtn" style="height: 100%;font-size:13px;color:#606266">
        当前显示{{(page_now-1)*data.limit+1}} - {{(page_now-1)*data.limit+data.data.length}}条数据
      </button>
    </div>
  </div>
</template>

<script>
  import ResizeObserverPolyfill from 'resize-observer-polyfill';
  import Vue from 'vue'
  import { Table } from 'element-ui';
  // 根据阅读Vue源代码(src/core/global-api/extend.js 第23~26),当Vue将一个配置对象注册成组件的时候,会自动的在配置上面
  // 加上属性_Ctor,当再次使用同一个配置对象的时候,因为这个对象上面已经有_Ctor[SuperId]了,那么就会直接返回早已经注册后的
  // 组件,导致我们下面的注册代码无效果
  /* 这就是上述的Vue源代码
    const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }
  */
  // 解决方案两个:1.直接让Vue.component...这段注册代码早于Vue.use(ElementUI) 2.执行 delete Table._Ctor后再注册
  delete Table._Ctor
  const bindEvents = Table.methods.bindEvents
  Object.assign(Table.methods,{
    bindEvents() {
      bindEvents.call(this)
      this.bodyWrapper.addEventListener('mousewheel', this.handleBodyMousewheel)
    },
    handleBodyMousewheel(event) {
      const fixedWrapper = this.$refs.fixedWrapper
      if (fixedWrapper) {
        const fixedBodyWrapper = fixedWrapper.querySelector('.el-table__fixed-body-wrapper')
        if (fixedBodyWrapper) {
          event.preventDefault()
          fixedBodyWrapper.scrollBy({ left: event.deltaX, top: event.deltaY })
          this.$refs.bodyWrapper.scrollBy({ left: event.deltaX, top: event.deltaY })
        }
      }
    }
  })
  Vue.component(
    Table.name,
    Table
  );


  export default {
    name: "index",
    components:{},
    props: {
      // 表格的数据，含title,data,limit,
      data: {
        type: Object,
        default: () => {
        },
      },
      // 是否显示分页
      page_bottom: {
        type: Boolean,
        default: true,
      },
      // 是否显示表头功能区
      page_top: {
        type: Boolean,
        default: true,
      },
      // 是否显示表头标题
      showHeader: {
        type: Boolean,
        default: true,
      },
      // 表格的名字，类似于id，不可重复，此项用于key使用
      filter: {
        type: String,
        default: '',
      }
    },
    data() {
      return {
        origin: -1,//按住shift连选的起点
        pin: false,//shift是否被按住。false不按住，true按住
        db: true,//是否是双击
        page_now: 1,
        tableHeight: 100, //设置表格默认高度
      }
    },
    watch: {},
    computed: {
      // 计算分页总数
      pageNum() {
        let {count, limit} = this.data;
        let num = count % limit !== 0 ? parseInt(count / limit) + 1 : count / limit;
        return num;
      },
    },
    mounted() {
      // 表格自适应高度
      this.$nextTick(() => {
        let dom = this.$el.querySelector('.body');
        // 根据浏览器高度设置初始高度
        // 监听浏览器高度变化，改变表格高度
        new ResizeObserverPolyfill(entries => {
          // 注意，entres是个数组，数组项为每个需要监听的DOM节点
          entries.forEach(entry => {
            this.tableHeight = entry.contentRect.height - 5;
          })
        }).observe(dom)
      })


      // 获取键盘事件，修改状态
      window.addEventListener('keydown', code => {//键盘按住事件
        if (code.keyCode === 16 && code.shiftKey) {
          this.pin = true;
        }
      });
      window.addEventListener('keyup', code => {//键盘松开事件
        if (code.keyCode === 16) {
          this.pin = false;
        }
      });
    },
    methods: {
      // 跳转到表格第几页
      submitTablePage() {
        this.$emit('reloadTableForThisPage', this.page_now);
      },
      // 回到首页
      toFirstPage() {
        this.page_now = 1;
        this.$emit('reloadTableForThisPage', this.page_now);
      },
      // 往前翻一页
      toPrePage() {
        if (this.page_now > 1) {
          this.page_now -= 1;
          this.$emit('reloadTableForThisPage', this.page_now);
        } else {
          let content = this.$store.state.language === "zh" ? "您已在首页" : "You are already on the home page.";
          this.$current.messageMine(content, 'warning');
        }
      },
      // 往后翻一页
      toNextPage() {
        if (this.page_now < this.pageNum) {
          this.page_now += 1;
          this.$emit('reloadTableForThisPage', this.page_now);
        } else {
          let content = this.$store.state.language === "zh" ? "您已在尾页" : "You are already on the last page.";
          this.$current.messageMine(content, 'warning');
        }
      },
      // 翻到最后一页
      toLastPage() {
        this.page_now = this.pageNum;
        this.$emit('reloadTableForThisPage', this.page_now);
      },
      // 刷新当前页
      reloadThisPage() {
        this.$emit('reloadTableForThisPage', this.page_now);
      },
      // 图标判断
      chooseIcon(thisTr, type) {
        // 此处判断返回上一级，FFType是folder，无法判断，只能与FFName高耦合，“返回上一级”提示修改，修改此处
        if (thisTr.IsReturn && thisTr.IsReturn == "1") {
          return 'icon-redo';
        }
        let cls = "";
        switch (type) {
          case 'Folder':
            cls = 'tree-folder-open';
            break;
          case 'PubFolder':
            cls = 'tree-folder-open';
            break;
          case 'PriFolder':
            cls = 'tree-folder-open';
            break;
          case 'Item':
            cls = 'icon-normal-file-mine';
            break;
          case 'ProHavePub':
            cls = 'icon-project-mine';
            break;
          case 'ProNoHavePub':
            cls = 'icon-project-mine';
            break;
          // 下面的原件列表的Type
          case 'File':
            cls = 'icon-normal-file-mine';
            break;
          case 'ItemFolder':
            cls = 'tree-folder-open';
            break;
        }
        return cls;
      },
      dbClickFun(row, column, event) {
        this.db = true;
        this.$emit('row-dbclick', {row, column, event})
      },
      // 行右键
      rightClick(row, column, event) {
        this.$emit('rightClick', {row, column, event})
      },
      // 当选择项发生变化时会触发该事件
      handleSelectionChange(selection) {
        this.$emit('handleSelectionChange', selection)
      },
      // js选中某一行的数据 - 默认
      setCurrentRow(data) {
        this.$refs.table.setCurrentRow(data);
      },
      // *******************按住shift连选*******************
      // 当前高亮行，修改事件
      currentChange(currentRow, oldCurrentRow) {
        setTimeout(() => {
          if (this.data.length > 0) {
            if (!this.pin && !this.db) {
              this.origin = currentRow.index;
            }
          }
        }, 100)

      },
      // 给单元格加行index和列index - 这一步不可修改
      tableCellClassName({row, column, rowIndex, columnIndex}) {
        //注意这里是解构
        //利用单元格的 className 的回调方法，给行列索引赋值
        row.index = rowIndex;
        column.index = columnIndex;
      },
      // 单元格单击事件
      pinSelect(row, column, cell, event) {
        if (!this.pin) {
          this.origin = row.index;
          this.db = false;
          // 单元格点击联动内容
          this.$emit('cell-click', row);
        } else {
          let data = this.$refs.table.tableData;//排序后的数据，当前数据
          let origin = this.origin <= row.index ? this.origin : row.index;
          let endP = this.origin >= row.index ? this.origin : row.index;
          let term = endP - origin;
          for (let i = 0; i <= term; i++) {
            this.$refs.table.toggleRowSelection(data[origin + i], true);
          }
        }
      },
      // *******************按住shift连选*******************
    },
  }
</script>

<style scoped>
  /*表格内容*/
  .contentTable {
    width: 100%;
    height: 100% !important;
    display: flex;
    flex-direction: column;
  }

  /*.contentTable > .header {*/
  /*  height: 30px;*/
  /*}*/

  .contentTable > .body {
    flex: 1;
    /*height: 0;*/
    overflow: hidden;
  }

  .contentTable > .footer {
    width: 100%;
    /*height: 30px;*/
    padding: 0 0 5px 0;
  }
</style>
<style>
  .form-inline {
    display: flex;
  }

  .contentTable .el-table {
    display: flex !important;
    flex-direction: column;
    /*position: absolute;*/
    /*left: 0;*/
    /*top:0;*/
  }

  .contentTable .el-table .el-table__header-wrapper {
    /*高度自适应*/
    /*height: auto!important;*/
  }

  .contentTable .el-table .el-table__body-wrapper {
    flex: 1 !important;
  }

  .contentTable .l-btn-text {
    /*line-height: 25px!important;*/
  }

  .contentTable .el-table__body-wrapper {
    /*background: red!important;*/
    /*height: auto;*/
    /*height: 90%!important;*/
  }
</style>
