import {request} from "@/network";

export const uploadOption = {
  data() {
    return {

      fileList: [],//用来存储显示列表的 文件列表
      fileList_real: [],//用来实际操作文件的 文件列表
      folderList: [],//用来存储显示列表的 文件夹列表
      folderList_real: [],//用来实际操作文件夹的 文件夹列表
      fileId: 0,//用来存储文件顺序的，只在前端生效


      isPdf_upload: '0',//是否是pdf上传 0原件上传 1pdf上传
      isUpRoot_upload: '1',//是否上传根目录 上传1 不上传0
      pdfType_upload: '1',//pdf类型 红章1 黑章2
    }
  },
  computed: {
    fileListForView: {
      get: function () {
        return this.fileList.concat(this.folderList)
      }
    },
  },
  methods: {
    // 打开上传列表弹框
    // 是否上传pdf 0原件 1pdf
    openUploadModal(isPdf) {
      this.isPdf_upload = isPdf;//自动上传是上传pdf 0原件 1pdf
      this.$refs.modalForUpload.open();
      this.clearUpFiles();
    },
    // 重新加载的刷新
    beforeunloadHandler(e) {
      e = e || window.event;
      if (e) {
        e.returnValue = "页面表单内数据将被清空，确定离开或重新加载页面吗？";
      }
      return "页面表单内数据将被清空，确定离开或重新加载页面吗？";
    },
    // 清空上传的文件，每当文本框被打开的时候就调用这个,初始化内容
    clearUpFiles() {
      this.fileList = [];
      this.fileList_real = [];
      this.folderList = [];
      this.folderList_real = [];
      this.fileId = 0;
      document.getElementById('fileId').value = '';
      document.getElementById('folderId').value = '';
      this.isUpRoot_upload = '1';
      this.pdfType_upload = '1';
    },
    // 触发选择文件
    triggerChooseFile() {
      document.getElementById('fileId').value = '';
      this.$refs.chooseFile_real.dispatchEvent(new MouseEvent("click"));
    },
    // 触发选择文件夹
    triggerChooseFolder() {
      document.getElementById('folderId').value = '';
      this.$refs.chooseFolder_real.dispatchEvent(new MouseEvent("click"));
    },
    // 当选中项发生改变时，获取文件列表
    getFile(event) {
      let files = event.target.files;
      if(files.length>0){
        // 下面存储文件列表显示的内容
        for (var i = 0; i < files.length; i++) {
          let item = files[i];
          this.fileList_real.push(item);
          this.fileId++;//加一个全局唯一的id，仅本次前台生效
          this.fileList.push({
            fileId: this.fileId,
            name: item.name,
            type: 'text',//text 当前显示文字字符串 input 当前显示文本框，用于version输入
            check: false,
            path: item.webkitRelativePath,
            size: item.size,
            state: 0,//0-未上传 1-正常 2-填写版本号 3-文件太大 4-上传失败请重试
            msg: '未上传'
          })
        }
      }
    },
    // 当选中项发生改变时，获取文件夹列表
    getFolder(event) {
      let files = event.target.files;
      if (files.length>0){
        this.folderList_real = [];//存储真正的文件夹对象
        // 更新存储显示的文件夹列表
        let arr = [];
        for (var i = 0; i < files.length; i++) {
          let item = files[i];
          this.folderList_real.push(item);
          this.fileId++;//加一个全局唯一的id，仅本次前台生效
          arr.push({
            fileId: this.fileId,
            name: item.name,
            type: 'text',//text 当前显示文字字符串 input 当前显示文本框，用于version输入
            check: false,
            path: item.webkitRelativePath,
            size: item.size,
            state: 0,//0-未上传 1-正常 2-填写版本号 3-文件太大 4-上传失败请重试
            msg: '未上传'
          })
        }
        this.folderList = arr;
      }

    },
    // 移除上传项 如果有传入的需要删除的项就删除传入的，如果没有就删除选中的
    removeChoose(list) {
      let checked = list ? list : this.fileListForView.filter(item => item.check);//需要移除的项
      if (checked.length == 0) {
        this.$current.alertMine("您未选择需要移除的文件");
        return false;
      }
      checked.map(item => {
        let fileArr = this.fileList.filter((file, key) => {
          if (file.fileId === item.fileId) {
            // 需要移除返回false
            this.fileList_real.splice(key, 1);
            return false;
          }
          return true;
        });
        this.fileList = fileArr;

        let folderArr = this.folderList.filter((file, key) => {
          if (file.fileId === item.fileId) {
            this.folderList_real.splice(key, 1);
            return false;
          }
          return true;
        });
        this.folderList = folderArr;

      })
    },
    // 选中全部文件 文件列表
    chooseAllFiles() {
      this.fileList = this.fileList.map(item => {
        item.check = true;
        return item;
      });
      this.folderList = this.folderList.map(item => {
        item.check = true;
        return item;
      })
    },
    // 清空全部文件 文件列表
    clearAllFiles() {
      this.fileList = this.fileList.map(item => {
        item.check = false;
        return item;
      });
      this.folderList = this.folderList.map(item => {
        item.check = false;
        return item;
      })
    },
    // 点击确定上传
    submitFun_autoUpload() {
      this.uploadLoading = true;
      let haveNotPdf = false;//全部都是pdf
      // 判断当前是文件上传，还是pdf上传 1pdf 0原件
      if (this.isPdf_upload == 1) {
        this.fileList.map(item => {
          if (item.name.substr(item.name.length - 4, 4).toLowerCase() !== '.pdf') {
            item.state = 4;
            item.msg = "非pdf文件,不可上传.";
            haveNotPdf = true;
          }
          return item;
        })
        this.folderList.map(item => {
          if (item.name.substr(item.name.length - 4, 4).toLowerCase() !== '.pdf') {
            item.state = 4;
            item.msg = "非pdf文件,不可上传.";
            haveNotPdf = true;
          }
          return item;
        })
        if (haveNotPdf) {
          this.$current.alertMine("当前为上传pdf，仅允许上传pdf文件，请移除非pdf文件后上传。");
          return false;
        }
      }
      var formData = new FormData();
      let index = 0;
      // 文件上传遍历
      for (let i = 0; i < this.fileList_real.length; i++) {
        formData.append('Files' + index, this.fileList_real[i]);
        index++;
      }
      // 文件夹上传遍历
      for (let i = 0; i < this.folderList_real.length; i++) {
        formData.append('Files' + index, this.folderList_real[i]);
        index++;
      }
      if (index == 0) {
        this.$current.alertMine("当前无上传文件");
        return false;
      }
      this.$refs.modalForLoading.open();
      formData.append('allFiles', JSON.stringify(this.fileListForView));
      formData.append('isPdf', this.isPdf_upload);
      formData.append('pdfType', this.pdfType_upload);
      formData.append('isUpRoot', this.isUpRoot_upload);
      formData.append('Id', this.directionNow_bot_resource.id);
      formData.append('Type', this.directionNow_bot_resource.Type);
      request({
        url: this.$collections.fileManager.upFile,
        data: formData,
        headers: {'Content-Type': 'multipart/form-data'},
        contentType: false,
        processData: false,
      }).then(res => {
        this.$refs.modalForLoading.close();
        if (res.reCode == 0) {
          let data = res.reData;
          let successList = [];
          data.map(item => {
            if (item.state == 1) {
              // 记录上传成功的内容
              successList.push(item);
            } else {
              // 更新 状态和提示信息 即state和msg
              this.fileList = this.fileList.map(file => {
                return file.fileId == item.fileId ? item : file;
              });
              this.folderList = this.folderList.map(file => {
                return file.fileId == item.fileId ? item : file;
              });
            }
          })
          this.$current.alertMine(`本次上传共${this.fileListForView.length}个文件。
            成功：${successList.length}个；
            失败：${this.fileListForView.length - successList.length}个。
            未成功上传的文件，请根据状态，修改后进行二次上传；\n
            若无需二次上传，请直接取消。`);
          if (successList.length > 0) {
            this.removeChoose(successList);//移除上传成功，留下失败的做二次上传
          }
          this.getResourceFileList(this.directionNow_bot_resource.id, this.directionNow_bot_resource.Type);
        } else {
          // 无需做code=1的判断，此次只有code=0或2
          this.closeModals();
        }
      })
    },
  }
}
