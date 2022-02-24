import {request} from "@/network";

export const uploadOption = {
  data() {
    return {

      fileList: [],//用来存储显示列表的 文件列表
      fileList_real: [],//用来实际操作文件的 文件列表
      folderList: [],//用来存储显示列表的 文件夹列表
      folderList_real: [],//用来实际操作文件夹的 文件夹列表
      fileId: 0,//用来存储文件顺序的，只在前端生效


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
      if (files.length > 0) {
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
    pushFile(item) {
      this.fileList_real.push(item);
      this.fileId++;//加一个全局唯一的id，仅本次前台生效
      this.fileList.push({
        fileId: this.fileId,
        name: item.name,
        type: 'text',//text 当前显示文字字符串 input 当前显示文本框，用于version输入
        check: false,
        path: item.webkitRelativePath ? item.webkitRelativePath : item.fullPath,
        size: item.size,
        state: 0,//0-未上传 1-正常 2-填写版本号 3-文件太大 4-上传失败请重试
        msg: '未上传'
      })
    },
    // 当选中项发生改变时，获取文件夹列表
    getFolder(event) {
      let files = event.target.files;
      if (files.length > 0) {
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
      this.loading = this.$loading(this.$config.loadingStyle);
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
      formData.append('allFiles', JSON.stringify(this.fileListForView));
      formData.append('IsDraw', this.dbclickData_item.IsDraw);
      formData.append('pdfType', this.pdfType_upload);
      formData.append('isUpRoot', this.isUpRoot_upload);
      formData.append('Id', this.search_file.id);
      formData.append('Type', this.search_file.Type);
      request({
        url: this.$collections.fileManager.upFile,
        data: formData,
        headers: {'Content-Type': 'multipart/form-data'},
        contentType: false,
        processData: false,
      }).then(res => {
        this.loading.close();
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
          let {id,Type} = this.search_file;
          this.reloadTableForThisPage_file(id,Type,'',1)
        } else {
          // 无需做code=1的判断，此次只有code=0或2
        }
      })
    },
    // 拖拽上传
    uploadFun(event) {
      this.$set(this.uploadModal_file, 'dragoverShow', false)
      let files = [];
      let fileList = event.dataTransfer.files;
      let len = fileList.length;

      for (let i = 0; i < len; i++) {
        files[i] = fileList[i];
      }

      if (files.length) {
        let items = event.dataTransfer.items;
        if (items && items.length && items[0].webkitGetAsEntry != null) {
          this.addFilesItems(items);
        }
      }
    },
    addFilesItems(items) {
      let _this = this;
      return function () {
        var ret = [];
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          var entry;

          if (item.webkitGetAsEntry && (entry = item.webkitGetAsEntry())) {
            if (entry.isFile) {
              // 把文件对象放到结果数组中  这里的addFile方法要单独写 我没有写上 这个不是重点
              // ret.push(addFile(item.getAsFiles()));
              entry.file(function (file) {
                // file.fullPath = '';
                // 那么暴露出去的就是 '文件夹/q.jpg' 这种形式
                // return addFile(file);
                console.log(file);
                _this.pushFile(file)
              });
            } else if (entry.isDirectory) {
              _this.addFilesFormDirectory(entry, entry.name)
              // ret.push(this.addFilesFormDirectory(entry, entry.name));
            }
          }
        }
      }();
    },
    // 读取文件夹下的文件
    addFilesFormDirectory(directory, path) {
      const dirReader = directory.createReader();

      const readEntries = () => {
        return dirReader.readEntries((entries) => {
          entries.forEach((entry) => {
            if (entry.isFile) {
              // 如果是文件
              entry.file((file) => {
                file.fullPath = path + '/' + file.name;
                // file.webkitRelativePath = path;
                // 那么暴露出去的就是 '文件夹/q.jpg' 这种形式
                // return addFile(file);
                console.log(file);
                this.pushFile(file)
              });
              // return addFile(file);
            } else if (entry.isDirectory) {
              // 递归处理
              this.addFilesFormDirectory(entry, path + '/' + entry.name);
            }
          });
        });
      };
      return readEntries();
    }
  }
}
