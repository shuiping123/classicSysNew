import {request} from '@/network'

export const tableFile = {
  data() {
    return {
      rightData_file: null,//右键的行内信息 电子文件
      multipleSelection_file: [],//继续复选框选中内容 电子文件
      tableData_file: {
        title: [],
        data: [],
        limit: 10,
        count: 10,
        loading: false
      },
      search_file: {
        id: '',//当前目录的id
        Type: '',//当前目录的Type
        name: '',//名称
      },
      uploadModal_file: {
        show: false,
        dragoverShow: false,
      },
      // 下载和删除都使用此数据
      tipModal_file: {
        type: 'down',//down 下载 del删除
        delTipShow:false,//删除提示的弹框 填写删除理由
        desc:'',//删除理由
        delData:[],//需要删除的数据
        showErr: false,//失败后的提示表格
        errTip: '',//失败信息提示
        successData: [],//可下载的文件列表
        errData: {//失败信息表格
          title: [],
          data: [],
          msg: '',
        },
      }

    }
  },
  computed: {
    // 根据权限判断是否显示 上传 按钮
    showUploadButton_file: function () {
      let {optionRole} = this.$store.state.stateMine.UsrRole;
      let data = this.dbclickData_item;
      // console.log(optionRole);
      // console.log(data);
      if (this.selection && data && data.Type == 'Itm') {
        return optionRole.LstAuth.filter(item => item.OCFId == this.selection.OCFId)[0].Lst.filter(item => item.OCATId == data.OCATId)[0].ItmOriUpload;
      }
      return false;
    },
  },
  methods: {
    clearSeachFun_file() {
      this.$set(this.search_file, 'name', '');
      let {id, Type} = this.search_file;
      this.reloadTableForThisPage_file(id, Type, '', 1);
    },
    cellClick_file() {
    },
    dbclickFun_file(row) {
      let data = row.row;
      if (data.Type == 'FileFolder' || data.Type == 'Itm') {
        this.reloadTableForThisPage_file(data.Id, data.Type, this.search_file.name, 1)
      }

    },
    rightClick_file(arg) {
      let {row, column, event} = arg;
      this.rightData_file = row;
      // 判断权限 当前条目是否有修改权限
      let {optionRole} = this.$store.state.stateMine.UsrRole;
      let showDownload = false, showView = false, showDel = false;
      // 如果不是文件夹或者文件 旨在刨除上一级的情况
      if (row.Type != 'FileFolder' && row.Type != 'File') return false;
      // 如果是文件夹
      if (row.Type == 'FileFolder') {
        showDownload = true;
        showView = false;
        showDel = true;
      } else {
        // FileType 1 原件 2 pdf黑章版 3 pdf红章版
        if (row.FileType == 1) {
          showDownload = optionRole.LstAuth.filter(item => item.OCFId == row.OCFId)[0].Lst.filter(item => item.OCATId == row.OCATId)[0].DwnOri;
          showView = optionRole.LstAuth.filter(item => item.OCFId == row.OCFId)[0].Lst.filter(item => item.OCATId == row.OCATId)[0].LkOri;
        } else if (row.FileType == 2) {
          showDownload = optionRole.LstAuth.filter(item => item.OCFId == row.OCFId)[0].Lst.filter(item => item.OCATId == row.OCATId)[0].DwnPDF;
          showView = optionRole.LstAuth.filter(item => item.OCFId == row.OCFId)[0].Lst.filter(item => item.OCATId == row.OCATId)[0].LkPDF;
        } else if (row.FileType == 3) {
          showDownload = optionRole.LstAuth.filter(item => item.OCFId == row.OCFId)[0].Lst.filter(item => item.OCATId == row.OCATId)[0].DwnPDF_R;
          showView = optionRole.LstAuth.filter(item => item.OCFId == row.OCFId)[0].Lst.filter(item => item.OCATId == row.OCATId)[0].LkPDF_R;
        }
        showDel = optionRole.LstAuth.filter(item => item.OCFId == row.OCFId)[0].Lst.filter(item => item.OCATId == row.OCATId)[0].ItmOriDel;
      }


      // 显示右键菜单
      let menu = [
        {
          value: 'down_file',
          label: '下载',
          disabled: !showDownload,
        },
        {
          value: 'view_file',
          label: '预览',
          disabled: !showView,
        },
        {
          value: 'del_file',
          label: '删除',
          disabled: !showDel,
        },
      ];
      this.$refs.rightMenu.openMenu(menu, event.pageX, event.pageY);
    },
    reloadTableForThisPage_file(id, Type, searchName, pageNow) {
      this.$set(this.search_file, 'id', id);
      this.$set(this.search_file, 'Type', Type);
      this.$set(this.tableData_file, 'loading', true);
      request({
        url: this.$collections.fileManager.getTableFile,
        params: {
          ty: 'GetItemFileLst',
          id: id,
          Type: Type,
          SearchName: searchName,
          isSelection: true,//是否开启多选框
          page: 1,//是否分页
          pageNow: pageNow,//当前的页码
        }
      }).then(res => {
        this.$set(this.tableData_file, 'loading', false);
        if (res.reCode == 0) {
          let {title, data, limit} = res.reData;
          this.$set(this.tableData_file, 'title', title);
          this.$set(this.tableData_file, 'data', data);
          this.$set(this.tableData_file, 'limit', limit);
          this.$set(this.tableData_file, 'count', res.reCount);
        } else if (res.reCode == 1) {
          let {title, data, limit} = res.reData;
          this.$set(this.tableData_file, 'title', title);
          this.$set(this.tableData_file, 'data', data);
          this.$set(this.tableData_file, 'limit', limit);
          this.$set(this.tableData_file, 'count', res.reCount);
          this.$set(this.tableData_file, 'msg', res.reMsg);
        }
      })
    },
    uploadFun_file() {
      this.$set(this.uploadModal_file, 'show', true);
      this.isUpRoot_upload = 1;
      this.pdfType_upload = 1;
      this.clearUpFiles();
    },
    // 点击批量下载
    downFilesFun() {
      if (!this.multipleSelection_file.length) {
        this.$current.alertMine("未选中下载项，请选中后重试。")
        return false;
      }
      let data = this.multipleSelection_file.map(item => {
        let obj = {k: item.Id, t: item.Type};
        return obj;
      });
      this.realDownFile(data);
    },
    // 下载操作
    // data 格式 [{k:需要下载的文件id,t:需要下载的文件Type}]
    realDownFile(data) {
      this.$set(this.tipModal_file, 'type', 'down');
      this.loading = this.$loading(this.$config.loadingStyle);
      request({
        url: this.$collections.fileManager.downFile,
        params: {
          ty: 'DownFile',
        },
        data: {
          downLst: JSON.stringify(data),
        },
      }).then(res => {
        this.loading.close();
        if (res.reCode == 0) {
          // window.location.href=res.reMsg;
          let a = document.createElement('a');
          a.style.display = "none";
          a.setAttribute('href', res.reMsg);
          let arr = res.reMsg.split('\\');
          a.setAttribute('download', arr[arr.length - 1]);
          a.click();
        } else if (res.reCode == 1) {
          this.$set(this.tipModal_file, 'showErr', true);//打开错误提示弹框
          this.$set(this.tipModal_file, 'errData', res.reData);//显示错误信息表格
          this.$set(this.tipModal_file, 'successData', res.reData1);//记录成功信息
          this.$set(this.tipModal_file, 'errTip', res.reMsg);//显示错误信息文字提示
        }
      })
    },
    // 删除操作
    realDelFile(data) {
        this.$set(this.tipModal_file, 'type', 'del');
        this.loading = this.$loading(this.$config.loadingStyle);
        request({
          url: this.$collections.fileManager.delFile,
          params: {
            ty: 'DelFileLst',
          },
          data: {
            delNote:this.tipModal_file.desc,
            downLst: JSON.stringify(data),
          },
        }).then(res => {
          this.loading.close();
          if (res.reCode == 0) {
            this.$set(this.tipModal_file,'delTipShow',false);//关闭弹框
            this.$current.alertMine(res.reMsg);
            this.reloadTableForThisPage_file(this.search_file.id,this.search_file.Type,this.search_file.name,1)
          } else if (res.reCode == 1) {
            this.$set(this.tipModal_file, 'showErr', true);//打开错误提示弹框
            this.$set(this.tipModal_file, 'errData', res.reData);//显示错误信息表格
            this.$set(this.tipModal_file, 'successData', res.reData1);//记录成功信息
            this.$set(this.tipModal_file, 'errTip', res.reMsg);//显示错误信息文字提示
          }
        })

    },
    // 点击继续
    keepFun_file() {
      let {type} = this.tipModal_file;
      if (type == 'down') {
        this.realDownFile(this.tipModal_file.successData)
      } else {
        this.realDelFile(this.tipModal_file.successData)
      }
    },
    // 点击批量下载
    delFiles(){
      if (!this.multipleSelection_file.length) {
        this.$current.alertMine("未选中删除项，请选中后重试。")
        return false;
      }
      let data = this.multipleSelection_file.map(item => {
        let obj = {k: item.Id, t: item.Type};
        return obj;
      });
      this.$set(this.tipModal_file, 'delData',data);
      this.delFilesFun();
    },
    // 显示删除提醒
    delFilesFun() {
      if (!this.multipleSelection_file.length) {
        this.$current.alertMine("未选中删除项，请选中后重试。")
        return false;
      }
      this.$set(this.tipModal_file,'delTipShow',true);//打开弹框
      this.$set(this.tipModal_file,'desc','');//清空删除理由
    },
  }
}


