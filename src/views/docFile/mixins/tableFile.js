import {request} from '@/network'

export const tableFile = {
  data() {
    return {
      rightData_file:null,//右键的行内信息 电子文件

      tableData_file: {
        title: [],
        data: [],
        limit: 10,
        count: 10,
        loading: false
      },
      search_file: {
        id:'',//当前目录的id
        Type:'',//当前目录的Type
        name: '',//名称
      },
      uploadModal_file:{
        show:false,
        dragoverShow:false,
      },

    }
  },
  computed: {
    // 根据权限判断是否显示 上传 按钮
    showUploadButton_file: function () {
      let {optionRole} = this.$store.state.stateMine.UsrRole;
      let data=this.dbclickData_item;
      // console.log(optionRole);
      // console.log(data);
      if (this.selection && data && data.Type == 'Itm') {
        return optionRole.LstAuth.filter(item => item.OCFId == this.selection.OCFId)[0].Lst.filter(item => item.OCATId==data.OCATId)[0].ItmOriUpload;
      }
      return false;
    },
  },
  methods: {
    cellClick_file() {
    },
    dbclickFun_file(row) {
      let data= row.row;
      if (data.Type=='FileFolder'||data.Type=='Itm'){
        this.reloadTableForThisPage_file(data.Id,data.Type,this.search_file.name,1)
      }

    },
    rightClick_file(arg) {
      let {row, column, event} = arg;
      this.rightData_file = row;
      // 判断权限 当前条目是否有修改权限
      let {optionRole} = this.$store.state.stateMine.UsrRole;
      let showDownload = false, showView = false, showDel = false;
      console.log(optionRole)
      console.log(row)
      // if (this.selection) {
      //   showDownload = optionRole.LstAuth.filter(item => item.OCFId == row.OCFId)[0].Lst.filter(item => item.OCATId == row.OCATId)[0].DwnOri;
      //   showView = optionRole.LstAuth.filter(item => item.OCFId == row.OCFId)[0].Lst.filter(item => item.OCATId == row.OCATId)[0].DwnOri;
      //   showDel = optionRole.LstAuth.filter(item => item.OCFId == row.OCFId)[0].Lst.filter(item => item.OCATId == row.OCATId)[0].DwnOri;
      // }
      // 显示右键菜单
      let menu = [
        {
          value: 'down_file',
          label: '下载',
          disabled: false,
        },
        {
          value: 'view_file',
          label: '预览',
          disabled: false,
        },
        {
          value: 'del_file',
          label: '删除',
          disabled: false,
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
        if (res.reCode == 2) {
          return false;
        }
        if (res.reCode == 0) {
          let {title, data, limit} = res.reData;
          this.$set(this.tableData_file, 'title', title);
          this.$set(this.tableData_file, 'data', data);
          this.$set(this.tableData_file, 'limit', limit);
          this.$set(this.tableData_file, 'count', res.reCount);
        } else {
          let {title, data, limit} = res.reData;
          this.$set(this.tableData_file, 'title', title);
          this.$set(this.tableData_file, 'data', data);
          this.$set(this.tableData_file, 'limit', limit);
          this.$set(this.tableData_file, 'count', res.reCount);
          this.$set(this.tableData_file, 'msg', res.reMsg);
        }
      })
    },
    uploadFun_file(){
      this.$set(this.uploadModal_file, 'show',true);
      this.isUpRoot_upload=1;
      this.pdfType_upload=1;
      this.clearUpFiles();
    },
  }
}


