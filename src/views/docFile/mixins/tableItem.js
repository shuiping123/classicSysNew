import {request} from '@/network'

export const tableItem = {
  data() {
    return {
      dbclickData_item: null,//双击的条目信息
      rightData_item: null,//记录右键的条目信息
      multipleSelection_item:[],//记录复选框选中的条目信息
      tableData_item: {
        title: [],
        data: [],
        limit: 10,
        count: 10,
        loading: false
      },
      search_item: {
        id: '',//当前目录的查询条件 id
        Type: '',//当前目录的查询条件 type
        name: '',//名称
        code: '',//编号
        isHaveFile: false,//是否包含电子文件
      },
      createCodeLoading_item:false,//生成档案号 loading是否显示
    }
  },
  computed: {
    // 根据权限判断是否显示 添加条目 按钮
    showAddButton_item: function () {
      let {optionRole} = this.$store.state.stateMine.UsrRole;
      if (this.selection) {
        let type = this.search_item.Type;
        if (type == 'NoHPro' || type == 'Pro_Self' || type == 'Pro_Public') {
          return optionRole.LstAuth.filter(item => item.OCFId == this.selection.OCFId)[0].ItmNew;
        } else {
          return false;
        }
      }
      return false;
    },
    // 根据权限判断是否显示 批量删除条目 按钮
    showDelButton_item: function () {
      let {optionRole} = this.$store.state.stateMine.UsrRole;
      if (this.selection) {
        return optionRole.LstAuth.filter(item => item.OCFId == this.selection.OCFId)[0].ItmDel;
      }
      return false;
    },
  },
  methods: {
    cellClick_item() {
    },
    dbclickFun_item(row, column, event) {
      this.dbclickData_item = row.row;//给双击条目信息变量赋值
      let data = row.row;
      // 判断当前的Type，卷内件显示卷内件标签，普通条目显示电子文件便签
      if (data.IsVol == '卷') {
        // 如果是卷内件
        // 需要清空查询条件并重新查询结果
        this.search_vol = {
          name: '',//名称
          code: '',//编号
          isHaveFile: false,//是否包含电子文件
        };
        let {name, code, isHaveFile} = this.search_vol;
        this.reloadTableForThisPage_vol(data.Id, data.Type, name, code, 1);
        // 标签联动
        this.$set(this.tabsList[2], 'show', true);// 打开卷内件标签
        this.activeName = this.tabsList[2].name;// 并激活卷内件标签
        this.$set(this.tabsList[3], 'show', false);//关闭电子文件标签
      } else {
        // 如果是电子文件
        // 需要清空查询条件并重新查询结果
        this.$set(this.search_file, 'name', '');
        this.reloadTableForThisPage_file(data.Id, data.Type, this.search_file.name, 1)
        // 标签联动
        this.$set(this.tabsList[3], 'show', true);// 打开电子文件标签
        this.activeName = this.tabsList[3].name;// 并激活电子文件标签
        this.$set(this.tabsList[2], 'show', false);//关闭卷内件标签
      }
    },
    rightClick_item(arg) {
      let {row, column, event} = arg;
      this.rightData_item = row;
      // 判断权限 当前条目是否有修改权限
      let {optionRole} = this.$store.state.stateMine.UsrRole;
      let showEdit = false, showDel = false;
      if (this.selection) {
        showEdit = optionRole.LstAuth.filter(item => item.OCFId == this.selection.OCFId)[0].Lst.filter(item => item.OCATId == row.OCATId)[0].ItmUpdate;
        showDel = optionRole.LstAuth.filter(item => item.OCFId == this.selection.OCFId)[0].Lst.filter(item => item.OCATId == row.OCATId)[0].ItmDel;
      }
      // 显示右键菜单
      let menu = [
        {
          value: 'edit_item',
          label: '编辑',
          disabled: !showEdit,
        },
        {
          value: 'del_item',
          label: '删除',
          disabled: !showDel,
        },
      ];
      this.$refs.rightMenu.openMenu(menu, event.pageX, event.pageY);
    },
    // 点击查询
    searchFun_item() {
      let {id, Type, name, code, isHaveFile} = this.search_item;
      this.reloadTableForThisPage_item(id, Type, name, code, 1);
      // 如果选中了包含的电子文件
      if (isHaveFile) {
        // 清空查询条件 电子文件
        this.$set(this.search_file, 'name', '');
        // 标签联动 开启电子文件标签 关闭卷内件标签
        this.$set(this.tabsList[3], 'show', true);
        this.$set(this.tabsList[2], 'show', false);
        // 查询结果 电子文件
        this.reloadTableForThisPage_file(id, Type, '', 1)
      }
    },
    // 取消查询
    clearSeachFun_item() {
      // 清空查询条件 电子文件
      this.$set(this.search_item, 'name', '');
      this.$set(this.search_item, 'code', '');
      this.$set(this.search_item, 'isHaveFile', false);
      let {id, Type} = this.search_item;
      // 进行取消查询
      this.reloadTableForThisPage_item(id, Type, '', '', 1);
      // 标签联动 关闭电子文件标签 关闭卷内件标签
      this.$set(this.tabsList[3], 'show', false);
      this.$set(this.tabsList[2], 'show', false);
    },
    // 查询条目列表 表格
    reloadTableForThisPage_item(id, Type, searchName, searchCode, pageNow) {
      this.$set(this.tableData_item, 'loading', true);
      this.$set(this.search_item, 'id', id);
      this.$set(this.search_item, 'Type', Type);

      request({
        url: this.$collections.fileManager.getTableItem,
        params: {
          ty: 'GetProFileInfo_Auth',
          id: id,
          Type: Type,
          SearchName: searchName,
          SearchArchNo: searchCode,
          isSelection: true,//是否开启多选框
          page: 1,
          pageNow: pageNow,
          ProId: 0,
          isPro: 0,//1项目列表，0条目列表
        }
      }).then(res => {
        this.$set(this.tableData_item, 'loading', false);

        if (res.reCode == 0) {
          let {title, data, limit} = res.reData;
          this.$set(this.tableData_item, 'title', title);
          this.$set(this.tableData_item, 'data', data);
          this.$set(this.tableData_item, 'limit', limit);
          this.$set(this.tableData_item, 'count', res.reCount);
        } else {
          let {title, data, limit} = res.reData;
          this.$set(this.tableData_item, 'title', title);
          this.$set(this.tableData_item, 'data', data);
          this.$set(this.tableData_item, 'limit', limit);
          this.$set(this.tableData_item, 'count', res.reCount);
          this.$set(this.tableData_item, 'msg', res.reMsg);
        }
      })
    },
    // 点击添加条目  获取条目弹框信息 第一个弹框
    getItemAttr_first() {
      // 如果是无项目文件夹
      if (this.selection.Type=='NoHPro'){
        this.$set(this.itemForm.first,'chooseTmpValue','');//清空选中项
        this.loading=this.$loading(this.$config.loadingStyle);
        request({
          url:this.$collections.fileManager.getItemInfoForm,
          params:{
            ty:'GetTmp',
            TmpIds:this.selection.TmpIds,
          }
        }).then(res=>{
          this.loading.close();
          if (res.reCode==0){
            if (res.reData.length==1){
              this.$set(this.itemForm.first,'chooseTmpValue',res.reData[0].value);
              this.getItemAttr_second(0,this.search_item.id,this.search_item.Type,0,res.reData[0].value);
              return false;
            }
            this.$set(this.itemForm.first,'noProShow',true);
            this.$set(this.itemForm.first,'chooseTmpData',res.reData)
          }else if (res.reCode == 1){
            this.$current.alertMine(res.reMsg);
          }
        }).catch(rej=>{
          this.loading.close();
        })
      }
      // 如果是有项目文件夹
      else {
        this.$set(this.itemForm.first, 'chooseClsValue', '');//清空选中项
        this.loading=this.$loading(this.$config.loadingStyle);
        request({
          url: this.$collections.fileManager.getClsTree,
          params: {
            ty: 'Get_ItmClsTotal',
            ProId: this.search_item.Type=='NoHPro'?0:this.search_item.id,
            OCFId: this.selection.OCFId,
          }
        }).then(res => {
          this.loading.close();
          if (res.reCode == 0) {
            this.$set(this.itemForm.first, 'havProShow', true);
            this.$set(this.itemForm.first, 'chooseClsData', res.reData);
          } else if (res.reCode == 1) {
            this.$current.alertMine(res.reMsg);
          }
        }).catch(rej=>{this.loading.close();})
      }
    },
    // 提交选择分类 有项目文件夹 添加条目
    submit_chooseCls_item() {
      let value=this.itemForm.first.chooseClsValue;
      // 判断是否选中了有效选择项 即是否选择了小类
      if (value&&!value.disabled) {
        this.$set(this.itemForm.first,'havProShow',false);//关闭第一个弹框
        this.getItemAttr_second(0,this.search_item.id,this.search_item.Type,value.id,0);
      }else {
        this.$current.alertMine('未选中有效项，请重新选择后确定。');
      }
    },
    // 提交选择模板 无项目文件夹 添加条目
    submit_chooseTmp_item(){
      let value=this.itemForm.first.chooseTmpValue;
      if (value){
        this.$set(this.itemForm.first,'noProShow',false);//关闭第一个弹框
        this.getItemAttr_second(0,this.search_item.id,this.search_item.Type,0,value);
      }else {
        this.$current.alertMine('未选中有效项，请重新选择后确定。');
      }
    },
    // 添加条目 加载表单信息 并打开第二个弹框
    getItemAttr_second(ItemId,id,Type,ClsId,TmpId){
      this.$set(this.itemForm.second.data,'ClsId',ClsId);
      this.$set(this.itemForm.second.data,'TmpId',TmpId);
      this.loading=this.$loading(this.$config.loadingStyle);
      request({
        url:this.$collections.fileManager.getItemInfoForm,
        params:{
          ty:'GetItemLstAttrByType',
          ItemId:ItemId,
          id:id,
          Type:Type,
          ClsId:ClsId,
          TmpId:TmpId,
        },
      }).then(res=>{
        this.loading.close();
        if (res.reCode==0){
          this.$set(this.itemForm.second,'show',true);
          this.$set(this.itemForm.second,'formContent',res.reData.map(item=>{
            if (item.type=='select'){
              item.defvalue=item.defvalue===0?null:item.defvalue.toString();
            }else if (item.type=='mulSelect'){
              item.defvalue=item.defvalue.split(',');
            }
            return item;
          }));
        }else if(res.reCode == 1){
          this.$current.alertMine(res.reMsg);
        }
      }).catch(rej=>{
        this.loading.close();
      })
    },
    // 生成档案号
    createCode_item() {
      let BigClsId, ClsId, ProId, MajorId, DevAreaCode, ContractType, ContractNo;
      let tips = [];
      this.itemForm.second.formContent.map(item => {
        switch (item.prop) {
          case 'BigClsId':
            if (item.require && (item.defvalue == '' || item.defvalue == null || (item.type == 'mulSelect' && item.defvalue.length == 0))) {
              tips.push(item.name);
            } else {
              BigClsId = item.defvalue;
            }
            break;
          case 'ClsId':
            if (item.require && (item.defvalue == '' || item.defvalue == null || (item.type == 'mulSelect' && item.defvalue.length == 0))) {
              tips.push(item.name);
            } else {
              ClsId = item.defvalue;
            }
            break;
          case 'ProId':
            if (item.require && (item.defvalue == '' || item.defvalue == null || (item.type == 'mulSelect' && item.defvalue.length == 0))) {
              tips.push(item.name);
            } else {
              ProId = item.defvalue;
            }
            break;
          case 'MajorId':
            if (item.require && (item.defvalue == '' || item.defvalue == null || (item.type == 'mulSelect' && item.defvalue.length == 0))) {
              tips.push(item.name);
            } else {
              MajorId = item.defvalue;
            }
            break;
          case 'DevAreaCode':
            if (item.require && (item.defvalue == '' || item.defvalue == null || (item.type == 'mulSelect' && item.defvalue.length == 0))) {
              tips.push(item.name);
            } else {
              DevAreaCode = item.defvalue;
            }
            break;
          case 'ContractType':
            if (item.require && (item.defvalue == '' || item.defvalue == null || (item.type == 'mulSelect' && item.defvalue.length == 0))) {
              tips.push(item.name);
            } else {
              ContractType = item.defvalue;
            }
            break;
          case 'ContractNo':
            if (item.require && (item.defvalue == '' || item.defvalue == null || (item.type == 'mulSelect' && item.defvalue.length == 0))) {
              tips.push(item.name);
            } else {
              ContractNo = item.defvalue;
            }
            break;
        }
      });
      if (tips.length > 0) {
        this.$current.alertMine("请填写" + tips.join(',') + "等内容后重试。");
        return false;
      }
      this.createCodeLoading_item=true;
      request({
        url: this.$collections.fileManager.createCode,
        params: {
          ty: 'GetItemArchNo',
          BigClsId,
          ClsId,
          ProId,
          MajorId,
          DevAreaCode,
          ContractType,
          ContractNo,
        }
      }).then(res => {
        this.createCodeLoading_item=false;
        if (res.reCode == 0) {
          this.itemForm.second.formContent.map(item => {
            if (item.prop == 'ItemArchNo') {
              this.$set(item, 'defvalue', res.reData);
            }
          })
        } else if (res.reCode == 1){
          this.$current.alertMine(res.reMsg);
        }
      }).catch(rej=>{this.createCodeLoading_item=false;})
    },
    // 添加/修改 条目 提交
    submit_item(){
      let tips=[];
      let ItemId=()=>{
        if(this.itemForm.type==='add')return 0;
        else return this.rightData_item.Id;
      }
      let obj={
        ty:this.itemForm.type==='add'?'AddItemLst':'EditItemLst',
        id:this.search_item.id,
        ItemId:ItemId,
        Type:this.search_item.Type,
        OCFId:this.selection.OCFId,
        ClsId:this.itemForm.second.data.ClsId,
        TmpId:this.itemForm.second.data.TmpId,
        itemInfo:[]
      };

      this.itemForm.second.formContent.map(item=>{
        if (item.require && (item.defvalue == '' || item.defvalue == null || (item.type == 'mulSelect' && item.defvalue.length == 0))) {
          tips.push(item.name);
        }else {
          let listObj={
            k:item.prop,
            v:item.type=='mulSelect'?item.defvalue.join(','):item.defvalue?item.defvalue.toString():'',
            t:item.ty
          };
          obj.itemInfo.push(listObj);
        }
      });
      // 判断必填内容
      if (tips.length > 0){
        this.$current.alertMine("请填写" + tips.join(',') + "等内容后重试。")
        return false;
      }
      obj.itemInfo=JSON.stringify(obj.itemInfo);
      this.loading=this.$loading(this.$config.loadingStyle);
      request({
        url:this.$collections.fileManager.subItem,
        params:obj
      }).then(res=>{
        this.loading.close();
        if (res.reCode==0){
          this.$current.alertMine(res.reMsg);
          this.$set(this.itemForm.second,'show',false);
          let {id, Type, name, code, isHaveFile} = this.search_item;
          this.searchFun_item();
        }else if (res.reCode==1){
          this.$current.alertMine(res.reMsg);
        }
      }).catch(rej=>{
        this.loading.close();
      })
    },
    // 删除前检测
    beforeDel_item(ids,type){
      this.loading=this.$loading(this.$config.loadingStyle);
      request({
        url:this.$collections.fileManager.beforeDel_item,
        params:{
          ty:'DelItemCheck',
          ItemId:ids
        }
      }).then(res=>{
        this.loading.close();
        if (res.reCode == 0){
          if (type=='rightDel'){
            this.$set(this.delModal_item,'tip',res.reMsg);
            this.$set(this.delModal_item,'show',true);
          }else if (type=='tableDel'){
            this.$set(this.delModal_items,'tip',res.reMsg);
            this.$set(this.delModal_items,'show',true);
          }
        }else {
          this.$current.alertMine(res.reMsg);
        }
      }).catch(rej=>{this.loading.close();})
    },
    // 删除条目 提交  右键
    submit_del_item(){
      let {desc} = this.delModal_item;
      let {Id}= this.rightData_item;
      this.realDel_item(Id,desc);
    },
    // 删除条目 提交  头部批量删除
    submit_del_items(){
      let {desc} = this.delModal_items;
      let ids=this.multipleSelection_item.map(item=>{return item.Id});
      this.realDel_item(ids.join(','),desc);
    },
    // 点击条目列表头部  批量删除
    delItems(){
      if (this.multipleSelection_item.length==0){
        this.$current.alertMine("当前无选中项，请选中后重试。");
        return false;
      }
      let ids=this.multipleSelection_item.map(item=>{
        return item.Id;
      });
      this.beforeDel_item(ids.join(","),'tableDel');
    },
    // 真正的删除操作
    realDel_item(ids,desc){
      this.loading=this.$loading(this.$config.loadingStyle);
      request({
        url:this.$collections.fileManager.subDel_item,
        params:{
          ty:'DelItemLstById',
          delNote:desc,
          ItemId:ids,
        }
      }).then(res=>{
        this.loading.close();
        if (res.reCode==0){
          this.$current.alertMine(res.reMsg);
          this.$set(this.delModal_item,'show',false);
          this.$set(this.delModal_items,'show',false);
          let {id, Type, name, code} = this.search_item;
          this.searchFun_item();
        }else if (res.reCode==1){
          this.$current.alertMine(res.reMsg);
        }
      }).catch(rej=>{this.loading.close();})
    },
  }
}
