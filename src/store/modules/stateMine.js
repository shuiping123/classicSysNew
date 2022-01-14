import {resetRouter} from '@/router'
import Vue from 'vue'

const state = {
  /**
   * 当前是否是登录状态
   * @value login/logout
   * */
  logState:'login',
  /**
   * 当前登录的用户权限Id
   * @value 1系统管理员/2管理员/3普通用户 目前按照这三种来写
   * null初始为0，没有任何权限，以免造成页面权限还未获取时可以点击的问题
   * */
  UsrRole:{
    nav:[]
  },
  // /**
  //  * 判定loading是否显示
  //  * 通用loading
  //  * 注：App.vue，如需修改，在App.vue中修改
  //  * @show true显示/false不显示
  //  * @title loading的标题
  //  * @msg loading的内容
  //  * */
  // loadingModal:{
  //   show:false,
  //   title:'加载中',
  //   msg:'加载中'
  // },
}

const mutations = {
  // 修改登录状态
  changeLogState(state,data){
    state.logState=data;
  },
  // 修改用户权限
  changeUsrRole(state,data){
    let {nav} = data;
    Vue.set(state.UsrRole,'nav',nav)
    if (data.nav.length>0){
       resetRouter(data.nav);
    }else {
      resetRouter(data.nav);
    }

  },
  // // 是否显示loading弹框
  // showLoading(state,data){
  //   Vue.set(state.loadingModal,'show',data.show?data.show:false);
  //   Vue.set(state.loadingModal,'title',data.title?data.title:'加载中');
  //   Vue.set(state.loadingModal,'msg',data.msg?data.msg:"加载中");
  // },
};

export default {
  namespaced: true,
  state,
  mutations,
}


