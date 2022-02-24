import {request} from '@/network'
export const viewFile = {

  data() {
    return {
      fileUrl: '',//文件链接，根据文件类型判断用什么弹框处理文件链接
      fileType:'pdf',//pdf/img/word/excel
      // pdfUrl: 'http://0.0.0.0:8080/static/AWEIS_Setup_Guide_v1_2_20_0.pdf',
      pageNum_pdf: 1,
      pageTotalNum: 1,
      loadedRatio: 0,
      view_file:{
        showPdf:false,
        showImg:false,
        showExcel:false,
      }
    }
  },
  methods: {
    openViewModal(){
      this.fileUrl='';//清空url
      switch (this.rightData_file.FileExt.toLowerCase()) {
        case ".pdf":
          this.fileType='pdf';
          break;
        case ".jpg":
          this.fileType='img';
          break;
        case ".png":
          this.fileType='img';
          break;
        case ".xls":
          this.fileType='excel';
          break;
        case ".xlsx":
          this.fileType='excel';
          break;
        case ".svg":
          this.fileType='excel';
          break;
        default:
          this.$current.alertMine("该文件格式不支持预览。");
      }

      this.openViewFileModal();
    },
    // 查看原件 中转站
    // openViewFileTranslator(){
    //   switch (this.cellClickRow_resource_bot.FileExt){
    //     case '.png':
    //       this.fileType='img';
    //       break;
    //     case '.jpg':
    //       this.fileType='img';
    //       break;
    //     case '.xlsx':
    //       this.fileType='excel';
    //       break;
    //     case '.docx':
    //       this.fileType='word';
    //       break;
    //     default:
    //       this.fileType='';
    //   }
    // },
    // 查看文件 获取文件的url 并打开弹框查看
    // suffix传后缀名
    openViewFileModal(){
      // 根据当前行的后缀名判断类型 判断发送什么参数，以及打开什么弹框
      this.loading = this.$loading(this.$config.loadingStyle);

      request({
        url:this.$collections.fileManager.getViewPdfUrl,
        params:{
          ty:'FileView',
          ViewType:this.fileType,
          FileId:this.rightData_file.Id,
        }
      }).then(res=>{
        this.loading.close();
        if (res.reCode==0){
          switch (this.fileType){
            case 'pdf':
              this.$set(this.view_file,'showPdf',true);
              break;
            case 'img':
              this.$set(this.view_file,'showImg',true);
              break;
            case 'excel':
              this.$set(this.view_file,'showExcel',true);
              break;
            case 'word':
              // this.$refs.modalViewWord.open();
              break;
          }
          // this.fileUrl="static\\FileViews\\dms00414\\(10022_451)iDiscover_系统部署手册v3.0_20181212.pdf";
          this.fileUrl=res.reData;
        }else if (res.reCode==1){
          this.$current.alertMine(res.reMsg);
        }else {
          // this.closeModals();
        }
      })
    },
    // 上一页
    prePage() {
      let page = this.pageNum_pdf
      page = page > 1 ? page - 1 : this.pageTotalNum
      this.pageNum_pdf = page
    },
    // 下一页
    nextPage() {
      let page = this.pageNum_pdf
      page = page < this.pageTotalNum ? page + 1 : 1
      this.pageNum_pdf = page
    },
  }
}
